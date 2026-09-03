export type EmployeeField = "name" | "department" | "designation" | "email";

export interface EmployeeFormData {
  name: string;
  department: string;
  designation: string;
  email: string;
}

export type EmployeeErrors = Record<EmployeeField, string>;

export const FIELD_MAX_LENGTHS: Record<EmployeeField, number> = {
  name: 100,
  department: 100,
  designation: 100,
  email: 254,
};

const FIELD_LABELS: Record<EmployeeField, string> = {
  name: "Name",
  department: "Department",
  designation: "Designation",
  email: "Email",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

export function validateEmployeeField(
  field: EmployeeField,
  value: string,
): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return `${FIELD_LABELS[field]} is required.`;
  }

  const maxLength = FIELD_MAX_LENGTHS[field];

  if (trimmedValue.length > maxLength) {
    return `${FIELD_LABELS[field]} must be ${maxLength} characters or fewer.`;
  }

  if (field === "email" && !EMAIL_PATTERN.test(trimmedValue)) {
    return "Please enter a valid email address.";
  }

  return "";
}

export function validateEmployeeForm(data: EmployeeFormData): EmployeeErrors {
  return {
    name: validateEmployeeField("name", data.name),
    department: validateEmployeeField("department", data.department),
    designation: validateEmployeeField("designation", data.designation),
    email: validateEmployeeField("email", data.email),
  };
}

export function isEmployeeFormValid(errors: EmployeeErrors): boolean {
  return Object.values(errors).every((error) => !error);
}
