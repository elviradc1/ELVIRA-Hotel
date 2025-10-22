import { useState, useEffect } from "react";
import { Modal, Button } from "../../../../../components/ui";
import { supabase } from "../../../../../services/supabase";
import { useHotelId } from "../../../../../hooks";

interface HotelPhotoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageUrls: string[]) => Promise<void>;
  initialImages?: string[];
}

export function HotelPhotoGalleryModal({
  isOpen,
  onClose,
  onSave,
  initialImages = [],
}: HotelPhotoGalleryModalProps) {
  const hotelId = useHotelId();
  const [images, setImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const MAX_IMAGES = 8;
  const BUCKET_NAME = "hotel-assets";

  useEffect(() => {
    if (isOpen) {
      // Filter out base64 data URLs and only keep valid HTTP(S) URLs
      const validImages = (initialImages || []).filter(
        (url) => url.startsWith("http://") || url.startsWith("https://")
      );

      if (validImages.length !== initialImages?.length) {
        console.log(
          `⚠️ Filtered out ${
            (initialImages?.length || 0) - validImages.length
          } invalid image(s)`
        );
      }

      setImages(validImages);
    }
  }, [initialImages, isOpen]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("🔵 [Photo Upload] handleFileSelect started");
    const files = event.target.files;

    if (!files || files.length === 0) {
      console.log("❌ [Photo Upload] No files selected");
      return;
    }

    console.log(`📁 [Photo Upload] Selected ${files.length} file(s)`);

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      console.log("❌ [Photo Upload] Maximum photos reached");
      alert("Maximum 8 photos allowed");
      return;
    }

    if (!hotelId) {
      console.log("❌ [Photo Upload] Hotel ID not found");
      alert("Hotel ID not found");
      return;
    }

    console.log(`🏨 [Photo Upload] Hotel ID: ${hotelId}`);
    console.log(`🗂️ [Photo Upload] Bucket: ${BUCKET_NAME}`);

    setIsUploading(true);

    try {
      const newImageUrls: string[] = [];
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      for (const file of filesToProcess) {
        console.log(`\n📸 [Photo Upload] Processing: ${file.name}`);
        console.log(`   - Type: ${file.type}`);
        console.log(`   - Size: ${(file.size / 1024).toFixed(2)} KB`);

        // Validate file type
        if (!file.type.match(/^image\/(jpeg|jpg|png|webp|gif)$/)) {
          console.log(`❌ [Photo Upload] Invalid file type: ${file.type}`);
          alert(
            `Invalid file type: ${file.name}. Please use JPG, PNG, WebP, or GIF.`
          );
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          console.log(`❌ [Photo Upload] File too large: ${file.size} bytes`);
          alert(`File too large: ${file.name}. Maximum size is 5MB.`);
          continue;
        }

        // Upload to Supabase Storage
        const fileExt = file.name.split(".").pop();
        const fileName = `hotel-gallery/${hotelId}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;

        console.log(`📤 [Photo Upload] Uploading to: ${fileName}`);

        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("❌ [Photo Upload] Upload error:", error);
          console.error("   - Message:", error.message);
          console.error("   - Error object:", JSON.stringify(error, null, 2));

          // Check if bucket doesn't exist
          if (error.message.includes("Bucket not found")) {
            alert(
              `Storage bucket "${BUCKET_NAME}" not found. Please create it in your Supabase dashboard:\n\n` +
                `1. Go to Storage in Supabase\n` +
                `2. Create a new bucket named "${BUCKET_NAME}"\n` +
                `3. Make it public\n` +
                `4. Try uploading again`
            );
            setIsUploading(false);
            event.target.value = "";
            return;
          }

          alert(`Failed to upload ${file.name}: ${error.message}`);
          continue;
        }

        console.log("✅ [Photo Upload] Upload successful:", data);
        console.log("   - Path:", data.path);
        console.log("   - Full path:", data.fullPath);

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

        console.log("🔗 [Photo Upload] Public URL:", publicUrl);

        newImageUrls.push(publicUrl);
      }

      console.log(
        `✅ [Photo Upload] Successfully uploaded ${newImageUrls.length} image(s)`
      );
      console.log("📋 [Photo Upload] URLs:", newImageUrls);

      if (newImageUrls.length > 0) {
        setImages((prev) => [...prev, ...newImageUrls]);
      }
    } catch (error) {
      console.error("❌ [Photo Upload] Unexpected error:", error);
      alert("An error occurred while uploading images");
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = "";
      console.log("🏁 [Photo Upload] Process completed\n");
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index];

    // Remove from local state first
    setImages((prev) => prev.filter((_, i) => i !== index));

    // Delete from Supabase Storage
    try {
      // Extract the file path from the public URL
      // URL format: https://[project-ref].supabase.co/storage/v1/object/public/hotel-assets/[path]
      const urlParts = imageUrl.split(`${BUCKET_NAME}/`);
      if (urlParts.length > 1) {
        const filePath = urlParts[1];

        const { error } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([filePath]);

        if (error) {
          console.error("Error deleting file from storage:", error);
        }
      }
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(images);
      onClose();
    } catch (error) {
      console.error("Error saving photos:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving && !isUploading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Hotel Photo Gallery"
      size="xl"
    >
      <div className="space-y-4">
        {/* Header Info */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Upload and manage up to 8 photos
          </p>
          <p className="text-sm font-medium text-gray-900">
            {images.length} / {MAX_IMAGES}
          </p>
        </div>

        {/* Upload Button */}
        <div>
          <label
            htmlFor="photo-upload"
            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors ${
              images.length >= MAX_IMAGES || isUploading || isSaving
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {isUploading ? "Uploading..." : "Upload Photos"}
          </label>
          <input
            id="photo-upload"
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            disabled={images.length >= MAX_IMAGES || isUploading || isSaving}
            className="hidden"
          />
          <p className="text-xs text-gray-500 mt-1">
            Select multiple photos (JPG, PNG, WebP, GIF - Max 5MB each)
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-2">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
            >
              <img
                src={imageUrl}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
                onLoad={() =>
                  console.log(`✅ Image ${index + 1} loaded:`, imageUrl)
                }
                onError={(e) => {
                  console.error(
                    `❌ Image ${index + 1} failed to load:`,
                    imageUrl
                  );
                  console.error("Error details:", e);
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleRemoveImage(index)}
                  disabled={isSaving || isUploading}
                  className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all disabled:opacity-50"
                  title="Remove photo"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                Photo {index + 1}
              </div>
            </div>
          ))}

          {/* Empty slots */}
          {images.length < MAX_IMAGES &&
            Array.from({ length: MAX_IMAGES - images.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center"
              >
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSaving || isUploading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving || isUploading}
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Photos"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
