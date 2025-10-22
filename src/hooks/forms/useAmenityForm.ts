import { useState, useEffect } from "react";
import {
  useCreateAmenity,
  useUpdateAmenity,
} from "../amenities/amenities/useAmenities";
import { useHotelContext } from "../useHotelContext";
import { useAuth } from "../useAuth";
import type { Database } from "../../types/database";

type AmenityRow = Database["public"]["Tables"]["amenities"]["Row"];

interface FormData {
  name: string;
  price: string;
  category: string;
  description: string;
  imageUrl: string | null;
  recommended: boolean;
}

interface FormErrors {
  name: string;
  price: string;
  category: string;
  description: string;
}

const initialFormData: FormData = {
  name: "",
  price: "",
  category: "",
  description: "",
  imageUrl: null,
  recommended: false,
};

const initialErrors: FormErrors = {
  name: "",
  price: "",
  category: "",
  description: "",
};

export function useAmenityForm(
  amenity: AmenityRow | null | undefined,
  onSuccess: () => void
) {
  const { user } = useAuth();
  const { hotelId } = useHotelContext();
  const createAmenity = useCreateAmenity();
  const updateAmenity = useUpdateAmenity();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);

  const isEditMode = !!amenity;
  const isPending = createAmenity.isPending || updateAmenity.isPending;

  // Initialize form when amenity changes
  useEffect(() => {
    if (amenity) {
      setFormData({
        name: amenity.name,
        price: amenity.price.toString(),
        category: amenity.category,
        description: amenity.description || "",
        imageUrl: amenity.image_url,
        recommended: amenity.recommended || false,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [amenity]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: "",
      price: "",
      category: "",
      description: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Amenity name is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.price && !newErrors.category;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!hotelId || !user?.id) {
      console.error("Hotel ID or User ID is missing");
      return;
    }

    try {
      if (isEditMode && amenity) {
        await updateAmenity.mutateAsync({
          id: amenity.id,
          updates: {
            name: formData.name.trim(),
            price: parseFloat(formData.price),
            category: formData.category,
            description: formData.description.trim() || null,
            image_url: formData.imageUrl,
            recommended: formData.recommended,
          },
        });
      } else {
        await createAmenity.mutateAsync({
          name: formData.name.trim(),
          price: parseFloat(formData.price),
          category: formData.category,
          description: formData.description.trim() || null,
          image_url: formData.imageUrl,
          recommended: formData.recommended,
          hotel_id: hotelId,
          created_by: user.id,
          is_active: true,
        });
      }

      resetForm();
      onSuccess();
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} amenity:`,
        error
      );
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors(initialErrors);
  };

  return {
    formData,
    errors,
    isEditMode,
    isPending,
    setFormData,
    handleFieldChange,
    handleSubmit,
    resetForm,
  };
}
