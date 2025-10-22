import { Input } from "../../../../../../../components/ui";

interface StaffContactFieldsProps {
  phone: string;
  dateOfBirth: string;
  onPhoneChange: (value: string) => void;
  onDateOfBirthChange: (value: string) => void;
  disabled?: boolean;
}

export function StaffContactFields({
  phone,
  dateOfBirth,
  onPhoneChange,
  onDateOfBirthChange,
  disabled = false,
}: StaffContactFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Phone Number */}
      <Input
        label="Phone Number"
        type="tel"
        placeholder="Enter phone number"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        disabled={disabled}
        leftIcon={
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
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        }
      />

      {/* Date of Birth */}
      <Input
        label="Date of Birth"
        type="date"
        value={dateOfBirth}
        onChange={(e) => onDateOfBirthChange(e.target.value)}
        disabled={disabled}
        leftIcon={
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        }
      />
    </div>
  );
}
