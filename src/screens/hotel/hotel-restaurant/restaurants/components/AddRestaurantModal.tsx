import { useState, useEffect } from "react";
import { Modal, Input, Button, Textarea } from "../../../../../components/ui";
import {
  useCreateRestaurant,
  useUpdateRestaurant,
} from "../../../../../hooks/hotel-restaurant/restaurants/useRestaurants";
import { useHotelContext } from "../../../../../hooks/useHotelContext";
import { useAuth } from "../../../../../hooks/useAuth";
import type { Database } from "../../../../../types/database";

type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];

interface AddRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: Restaurant | null;
}

export function AddRestaurantModal({
  isOpen,
  onClose,
  editData,
}: AddRestaurantModalProps) {
  const { user } = useAuth();
  const { hotelId } = useHotelContext();
  const createRestaurant = useCreateRestaurant();
  const updateRestaurant = useUpdateRestaurant();

  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    description: "",
    foodTypes: [] as string[],
    foodTypesInput: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    cuisine: "",
    description: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        cuisine: editData.cuisine,
        description: editData.description || "",
        foodTypes: editData.food_types || [],
        foodTypesInput: "",
      });
    } else {
      setFormData({
        name: "",
        cuisine: "",
        description: "",
        foodTypes: [],
        foodTypesInput: "",
      });
    }
  }, [editData]);

  const validateForm = () => {
    const newErrors = {
      name: "",
      cuisine: "",
      description: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Restaurant name is required";
    }

    if (!formData.cuisine.trim()) {
      newErrors.cuisine = "Cuisine type is required";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.cuisine;
  };

  const handleAddFoodType = () => {
    const foodType = formData.foodTypesInput.trim();
    if (foodType && !formData.foodTypes.includes(foodType)) {
      setFormData({
        ...formData,
        foodTypes: [...formData.foodTypes, foodType],
        foodTypesInput: "",
      });
    }
  };

  const handleRemoveFoodType = (foodType: string) => {
    setFormData({
      ...formData,
      foodTypes: formData.foodTypes.filter((ft) => ft !== foodType),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFoodType();
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!hotelId || !user?.id) {
return;
    }

    try {
      if (editData) {
        // Update existing restaurant
        await updateRestaurant.mutateAsync({
          id: editData.id,
          updates: {
            name: formData.name.trim(),
            cuisine: formData.cuisine.trim(),
            description: formData.description.trim() || null,
            food_types:
              formData.foodTypes.length > 0 ? formData.foodTypes : null,
          },
        });
      } else {
        // Create new restaurant
        await createRestaurant.mutateAsync({
          name: formData.name.trim(),
          cuisine: formData.cuisine.trim(),
          description: formData.description.trim() || null,
          food_types: formData.foodTypes.length > 0 ? formData.foodTypes : null,
          hotel_id: hotelId,
          created_by: user.id,
          is_active: true,
        });
      }

      // Reset form and close modal
      setFormData({
        name: "",
        cuisine: "",
        description: "",
        foodTypes: [],
        foodTypesInput: "",
      });
      setErrors({ name: "", cuisine: "", description: "" });
      onClose();
    } catch (error) {
}
  };

  const handleClose = () => {
    setFormData({
      name: "",
      cuisine: "",
      description: "",
      foodTypes: [],
      foodTypesInput: "",
    });
    setErrors({ name: "", cuisine: "", description: "" });
    onClose();
  };

  const isEditMode = !!editData;
  const isPending = createRestaurant.isPending || updateRestaurant.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Restaurant" : "Add Restaurant"}
      size="lg"
    >
      <div className="space-y-4">
        {/* Restaurant Name Input */}
        <Input
          label="Restaurant Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter restaurant name"
          error={errors.name}
          disabled={isPending}
          leftIcon={
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
        />

        {/* Cuisine Type Input */}
        <Input
          label="Cuisine Type"
          value={formData.cuisine}
          onChange={(e) =>
            setFormData({ ...formData, cuisine: e.target.value })
          }
          placeholder="e.g., Italian, Chinese, Mexican"
          error={errors.cuisine}
          disabled={isPending}
          leftIcon={
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          }
        />

        {/* Description Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-gray-400">(Optional)</span>
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter restaurant description"
            error={errors.description}
            disabled={isPending}
            rows={3}
          />
        </div>

        {/* Food Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Food Types <span className="text-gray-400">(Optional)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.foodTypesInput}
              onChange={(e) =>
                setFormData({ ...formData, foodTypesInput: e.target.value })
              }
              onKeyPress={handleKeyPress}
              placeholder="e.g., Pasta, Pizza, Sushi"
              disabled={isPending}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:border-gray-400 transition-colors"
            />
            <Button
              variant="outline"
              onClick={handleAddFoodType}
              disabled={isPending || !formData.foodTypesInput.trim()}
            >
              Add
            </Button>
          </div>
          {formData.foodTypes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.foodTypes.map((foodType) => (
                <span
                  key={foodType}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
                >
                  {foodType}
                  <button
                    type="button"
                    onClick={() => handleRemoveFoodType(foodType)}
                    disabled={isPending}
                    className="hover:text-emerald-900 focus:outline-none"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Press Enter or click Add to add food types
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
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
                {isEditMode ? "Updating..." : "Adding..."}
              </>
            ) : isEditMode ? (
              "Update Restaurant"
            ) : (
              "Add Restaurant"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
