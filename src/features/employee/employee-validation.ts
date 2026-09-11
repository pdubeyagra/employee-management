import type {
  EmployeeErrors,
  EmployeeField,
  EmployeeFormData,
} from "./employee-types.js";
import {
  validateFieldValue,
  type FieldRules,
} from "@/components/ui/ui-input.js";

export const EMPLOYEE_FIELD_RULES: Record<EmployeeField, FieldRules> = {
  name: {
    label: "Name",
    required: true,
    maxlength: 100,
  },
  department: {
    label: "Department",
    required: true,
    maxlength: 100,
  },
  designation: {
    label: "Designation",
    required: true,
    maxlength: 100,
  },
  email: {
    label: "Email",
    required: true,
    maxlength: 254,
    type: "email",
  },
};

export const EMPLOYEE_FIELDS = Object.keys(
  EMPLOYEE_FIELD_RULES,
) as EmployeeField[];

export const FIELD_MAX_LENGTHS: Record<EmployeeField, number> =
  Object.fromEntries(
    EMPLOYEE_FIELDS.map((field) => [
      field,
      EMPLOYEE_FIELD_RULES[field].maxlength ?? 0,
    ]),
  ) as Record<EmployeeField, number>;

export function validateEmployeeField(
  field: EmployeeField,
  value: string,
): string {
  return validateFieldValue(value, EMPLOYEE_FIELD_RULES[field]);
}

export function validateEmployeeForm(data: EmployeeFormData): EmployeeErrors {
  return Object.fromEntries(
    EMPLOYEE_FIELDS.map((field) => [
      field,
      validateEmployeeField(field, data[field]),
    ]),
  ) as EmployeeErrors;
}

export function isEmployeeFormValid(errors: EmployeeErrors): boolean {
  return Object.values(errors).every((error) => !error);
}
