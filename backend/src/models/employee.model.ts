export const EmployeeStatus = {
  ACTIVE: 1,
  TRASH: 2,
} as const;

export type EmployeeStatus =
  (typeof EmployeeStatus)[keyof typeof EmployeeStatus];

export interface Employee {
  id: string;
  fullName: string;
  designation: string;
  department: string;
  email: string;
  status: EmployeeStatus;
}

export interface CreateEmployeeRequest {
  fullName: string;
  designation: string;
  department: string;
  email: string;
}

export interface UpdateEmployeeRequest {
  fullName?: string;
  designation?: string;
  department?: string;
  email?: string;
}
