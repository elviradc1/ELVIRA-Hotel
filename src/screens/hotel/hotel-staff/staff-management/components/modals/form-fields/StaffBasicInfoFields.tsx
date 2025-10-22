import { Input } from "../../../../../../../components/ui";

interface StaffBasicInfoFieldsProps {
  firstName: string;
  lastName: string;
  email: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  errors: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  disabled?: boolean;
  isEditMode?: boolean;
}

export function StaffBasicInfoFields({
  firstName,
  lastName,
  email,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  errors,
  disabled = false,
  isEditMode = false,
}: StaffBasicInfoFieldsProps) {
  return (
    <>
      {/* First Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          placeholder="Enter first name"
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
          error={errors.firstName}
          required
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
        />

        {/* Last Name */}
        <Input
          label="Last Name"
          type="text"
          placeholder="Enter last name"
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
          error={errors.lastName}
          required
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
        />
      </div>

      {/* Email */}
      <Input
        label="Email"
        type="email"
        placeholder="Enter email address"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        error={errors.email}
        required
        disabled={disabled || isEditMode}
        hint={isEditMode ? "Email cannot be changed after creation" : undefined}
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        }
      />
    </>
  );
}
