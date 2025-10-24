import { useState, useEffect } from "react";
import { ModalForm, ModalFormActions } from "../../../../../../components/ui";
import { QuestionSection } from "./QuestionSection";
import { AnswerSection } from "./AnswerSection";
import { CategorySection } from "./CategorySection";
import type { QAFormData } from "./types";
import type { Database } from "../../../../../../types/database";

type QARecommendation = Database["public"]["Tables"]["qa_recommendations"]["Row"];

interface QAModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  qaItem?: QARecommendation | null;
  onSubmit: (data: QAFormData) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const initialFormData: QAFormData = {
  question: "",
  answer: "",
  category: "General",
  type: "FAQ",
  isActive: true,
};

export function QAModal({
  isOpen,
  onClose,
  mode,
  qaItem,
  onSubmit,
  onEdit,
  onDelete,
}: QAModalProps) {
  const [formData, setFormData] = useState<QAFormData>(initialFormData);

  useEffect(() => {
    if (qaItem && (mode === "edit" || mode === "view")) {
      setFormData({
        question: qaItem.question || "",
        answer: qaItem.answer || "",
        category: qaItem.category || "General",
        type: qaItem.type || "FAQ",
        isActive: qaItem.is_active,
      });
    } else if (mode === "create") {
      setFormData(initialFormData);
    }
  }, [qaItem, mode, isOpen]);

  const handleChange = (field: keyof QAFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      return;
    }
    onSubmit(formData);
  };

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Add Q&A";
      case "edit":
        return "Edit Q&A";
      case "view":
        return "Q&A Details";
    }
  };

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      size="2xl"
      onSubmit={handleSubmit}
    >
      <QuestionSection formData={formData} onChange={handleChange} mode={mode} />
      <AnswerSection formData={formData} onChange={handleChange} mode={mode} />
      <CategorySection formData={formData} onChange={handleChange} mode={mode} />

      <ModalFormActions
        mode={mode}
        onCancel={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
        submitLabel={mode === "create" ? "Add Q&A" : "Save Changes"}
        isPending={false}
      />
    </ModalForm>
  );
}
