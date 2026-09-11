export interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  email: string;
}

export type NewEmployee = Omit<Employee, "id">;

export type EmployeeField = "name" | "department" | "designation" | "email";

export type EmployeeFormData = Record<EmployeeField, string>;

export type EmployeeErrors = Record<EmployeeField, string>;
