import type { ReactNode } from "react";
import { Card } from "./Card";

interface InfoCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
}

export function InfoCard({
  title,
  description,
  icon,
  children,
  actions,
}: InfoCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          {icon && (
            <div className="mr-3 p-2 bg-emerald-100 rounded-xl">
              <div className="text-emerald-600">{icon}</div>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </Card>
  );
}
