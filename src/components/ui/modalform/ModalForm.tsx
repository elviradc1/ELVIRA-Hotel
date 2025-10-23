import type { ReactNode } from "react";
import { Modal } from "../modals";

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * ModalForm - A consistent modal wrapper for forms and detail views
 * Provides consistent spacing and layout for all modal content
 */
export function ModalForm({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "lg",
}: ModalFormProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <div className="space-y-4">{children}</div>
      {footer && (
        <div className="sticky bottom-0 bg-white flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
          {footer}
        </div>
      )}
    </Modal>
  );
}
