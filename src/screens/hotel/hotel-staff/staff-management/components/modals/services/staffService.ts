import { supabase } from "../../../../../../../services/supabase";

interface CreateStaffParams {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  phone?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  address?: string;
  dateOfBirth?: string;
  hotelId: string;
}

interface CreateStaffResponse {
  success: boolean;
  userId?: string;
  employeeId?: string;
  email?: string;
  temporaryPassword?: string;
  message?: string;
  error?: string;
}

export async function createStaffMember(
  params: CreateStaffParams
): Promise<CreateStaffResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "create-staff-hotel",
      {
        body: params,
      }
    );

    if (error) {
      console.error("Edge function error:", error);
      throw new Error(error.message || "Failed to create staff member");
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    return data as CreateStaffResponse;
  } catch (error) {
    console.error("Error creating staff member:", error);
    throw error;
  }
}

interface UpdateStaffParams {
  staffId: string;
  position?: string;
  department?: string;
  status?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  address?: string;
  dateOfBirth?: string;
}

export async function updateStaffMember(params: UpdateStaffParams) {
  try {
    const { staffId, ...updateData } = params;

    // Update hotel_staff table
    if (updateData.position || updateData.department || updateData.status) {
      const staffUpdate: Record<string, string> = {};
      if (updateData.position) staffUpdate.position = updateData.position;
      if (updateData.department) staffUpdate.department = updateData.department;
      if (updateData.status) staffUpdate.status = updateData.status;

      const { error: staffError } = await supabase
        .from("hotel_staff")
        .update(staffUpdate)
        .eq("id", staffId);

      if (staffError) {
        console.error("Error updating staff:", staffError);
        throw staffError;
      }
    }

    // Update hotel_staff_personal_data table
    const personalDataUpdate: Record<string, string | null> = {};
    if (updateData.firstName !== undefined)
      personalDataUpdate.first_name = updateData.firstName;
    if (updateData.lastName !== undefined)
      personalDataUpdate.last_name = updateData.lastName;
    if (updateData.phone !== undefined)
      personalDataUpdate.phone_number = updateData.phone || null;
    if (updateData.city !== undefined)
      personalDataUpdate.city = updateData.city || null;
    if (updateData.zipCode !== undefined)
      personalDataUpdate.zip_code = updateData.zipCode || null;
    if (updateData.country !== undefined)
      personalDataUpdate.country = updateData.country || null;
    if (updateData.address !== undefined)
      personalDataUpdate.address = updateData.address || null;
    if (updateData.dateOfBirth !== undefined)
      personalDataUpdate.date_of_birth = updateData.dateOfBirth || null;

    if (Object.keys(personalDataUpdate).length > 0) {
      const { error: personalError } = await supabase
        .from("hotel_staff_personal_data")
        .update(personalDataUpdate)
        .eq("staff_id", staffId);

      if (personalError) {
        console.error("Error updating personal data:", personalError);
        throw personalError;
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating staff member:", error);
    throw error;
  }
}
