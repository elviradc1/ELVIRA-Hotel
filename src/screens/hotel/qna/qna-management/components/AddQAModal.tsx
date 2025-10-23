import { useState, useEffect } from "react";
import { Modal, Input, Button } from "../../../../../components/ui";
import {
  useCreateQARecommendation,
  useUpdateQARecommendation,
} from "../../../../../hooks/qna/useQARecommendations";
import { useHotelContext } from "../../../../../hooks/useHotelContext";
import { useAuth } from "../../../../../hooks/useAuth";
import type { Database } from "../../../../../types/database";

type QARecommendation =
  Database["public"]["Tables"]["qa_recommendations"]["Row"];

interface AddQAModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: QARecommendation | null;
}

export function AddQAModal({
  isOpen,
  onClose,
  editData = null,
}: AddQAModalProps) {
  const { user } = useAuth();
  const { hotelId } = useHotelContext();
  const createQA = useCreateQARecommendation();
  const updateQA = useUpdateQARecommendation();

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "general",
    type: "qa",
  });

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        question: editData.question || "",
        answer: editData.answer || "",
        category: editData.category,
        type: editData.type,
      });
    } else {
      setFormData({
        question: "",
        answer: "",
        category: "general",
        type: "qa",
      });
    }
  }, [editData]);

  const [errors, setErrors] = useState({
    question: "",
    answer: "",
    category: "",
    type: "",
  });

  const categories = [
    { value: "general", label: "General" },
    { value: "amenities", label: "Amenities" },
    { value: "services", label: "Services" },
    { value: "facilities", label: "Facilities" },
    { value: "policies", label: "Policies" },
    { value: "dining", label: "Dining" },
    { value: "transportation", label: "Transportation" },
    { value: "local-area", label: "Local Area" },
  ];

  const types = [
    { value: "qa", label: "Q&A" },
    { value: "recommendation", label: "Recommendation" },
  ];

  const validateForm = () => {
    const newErrors = {
      question: "",
      answer: "",
      category: "",
      type: "",
    };

    if (!formData.question.trim()) {
      newErrors.question = "Question is required";
    }

    if (!formData.answer.trim()) {
      newErrors.answer = "Answer is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.type) {
      newErrors.type = "Type is required";
    }

    setErrors(newErrors);
    return (
      !newErrors.question &&
      !newErrors.answer &&
      !newErrors.category &&
      !newErrors.type
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!hotelId || !user?.id) {
return;
    }

    try {
      if (editData) {
        // Update existing Q&A
        await updateQA.mutateAsync({
          id: editData.id,
          updates: {
            question: formData.question.trim(),
            answer: formData.answer.trim(),
            category: formData.category,
            type: formData.type,
          },
        });
      } else {
        // Create new Q&A
        await createQA.mutateAsync({
          question: formData.question.trim(),
          answer: formData.answer.trim(),
          category: formData.category,
          type: formData.type,
          hotel_id: hotelId,
          created_by: user.id,
          is_active: true,
        });
      }

      // Reset form and close modal
      setFormData({
        question: "",
        answer: "",
        category: "general",
        type: "qa",
      });
      setErrors({ question: "", answer: "", category: "", type: "" });
      onClose();
    } catch (error) {
}
  };

  const handleClose = () => {
    setFormData({
      question: "",
      answer: "",
      category: "general",
      type: "qa",
    });
    setErrors({ question: "", answer: "", category: "", type: "" });
    onClose();
  };

  const isEditMode = !!editData;
  const isPending = createQA.isPending || updateQA.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Q&A" : "Add Q&A"}
      size="lg"
    >
      <div className="space-y-4">
        {/* Type Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            disabled={isPending}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
              errors.type
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            } ${createQA.isPending ? "bg-gray-50" : ""}`}
          >
            {types.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
          )}
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            disabled={isPending}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
              errors.category
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            } ${createQA.isPending ? "bg-gray-50" : ""}`}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Question Input */}
        <Input
          label="Question"
          value={formData.question}
          onChange={(e) =>
            setFormData({ ...formData, question: e.target.value })
          }
          placeholder="Enter question"
          error={errors.question}
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
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        {/* Answer Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Answer
          </label>
          <textarea
            value={formData.answer}
            onChange={(e) =>
              setFormData({ ...formData, answer: e.target.value })
            }
            placeholder="Enter answer or recommendation"
            disabled={isPending}
            rows={5}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
              errors.answer
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            } ${createQA.isPending ? "bg-gray-50" : ""}`}
          />
          {errors.answer && (
            <p className="mt-1 text-sm text-red-600">{errors.answer}</p>
          )}
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
              "Update Q&A"
            ) : (
              "Add Q&A"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
