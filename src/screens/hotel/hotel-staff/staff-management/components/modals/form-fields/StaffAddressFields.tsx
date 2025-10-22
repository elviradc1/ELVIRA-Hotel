import { Input } from "../../../../../../../components/ui";

interface StaffAddressFieldsProps {
  address: string;
  city: string;
  zipCode: string;
  country: string;
  onAddressChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onZipCodeChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  disabled?: boolean;
}

export function StaffAddressFields({
  address,
  city,
  zipCode,
  country,
  onAddressChange,
  onCityChange,
  onZipCodeChange,
  onCountryChange,
  disabled = false,
}: StaffAddressFieldsProps) {
  return (
    <>
      {/* Address */}
      <Input
        label="Address"
        type="text"
        placeholder="Enter street address"
        value={address}
        onChange={(e) => onAddressChange(e.target.value)}
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        }
      />

      {/* City, Zip Code, Country */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="City"
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          disabled={disabled}
        />

        <Input
          label="Zip Code"
          type="text"
          placeholder="Zip code"
          value={zipCode}
          onChange={(e) => onZipCodeChange(e.target.value)}
          disabled={disabled}
        />

        <Input
          label="Country"
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    </>
  );
}
