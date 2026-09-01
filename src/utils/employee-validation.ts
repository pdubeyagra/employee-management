export type EmployeeField = "name" | "department" | "designation" | "email";

export interface EmployeeFormData {
  name: string;
  department: string;
  designation: string;
  email: string;
}

export type EmployeeErrors = Record<EmployeeField, string>;

export function validateEmployeeField(
  field: EmployeeField,
  value: string,
): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    switch (field) {
      case "name":
        return "Name is required.";

      case "department":
        return "Department is required.";

      case "designation":
        return "Designation is required.";

      case "email":
        return "Email is required.";
    }
  }

  if (field === "email") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedValue)) {
      return "Please enter a valid email address.";
    }
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
