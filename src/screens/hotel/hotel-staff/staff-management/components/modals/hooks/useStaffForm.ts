import { useState, useEffect } from "react";

export interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  status: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface StaffFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  position?: string;
  department?: string;
}

interface StaffData {
  id: string;
  position: string;
  department: string;
  status: string;
  hotel_staff_personal_data?: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string | null;
    date_of_birth?: string | null;
    address?: string | null;
    city?: string | null;
    zip_code?: string | null;
    country?: string | null;
  };
}

export function useStaffForm(editData: StaffData | null) {
  const [formData, setFormData] = useState<StaffFormData>({
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    department: "",
    status: "active",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
  });

  const [errors, setErrors] = useState<StaffFormErrors>({});

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      const personalData = editData.hotel_staff_personal_data;
      setFormData({
        firstName: personalData?.first_name || "",
        lastName: personalData?.last_name || "",
        email: personalData?.email || "",
        position: editData.position || "",
        department: editData.department || "",
        status: editData.status || "active",
        phone: personalData?.phone_number || "",
        dateOfBirth: personalData?.date_of_birth || "",
        address: personalData?.address || "",
        city: personalData?.city || "",
        zipCode: personalData?.zip_code || "",
        country: personalData?.country || "",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        position: "",
        department: "",
        status: "active",
        phone: "",
        dateOfBirth: "",
        address: "",
        city: "",
        zipCode: "",
        country: "",
      });
    }
  }, [editData]);

  const validateForm = (): boolean => {
    const newErrors: StaffFormErrors = {};
    let isValid = true;

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate position
    if (!formData.position) {
      newErrors.position = "Position is required";
      isValid = false;
    }

    // Validate department
    if (!formData.department) {
      newErrors.department = "Department is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      position: "",
      department: "",
      status: "active",
      phone: "",
      dateOfBirth: "",
      address: "",
      city: "",
      zipCode: "",
      country: "",
    });
    setErrors({});
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    validateForm,
    resetForm,
  };
}
