import {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeStatus,
} from "../models/employee.model";

const employees: Employee[] = [];

export const createEmployee = (data: CreateEmployeeRequest): Employee => {
  const employee: Employee = {
    id: crypto.randomUUID(),
    ...data,
    status: EmployeeStatus.ACTIVE,
  };

  employees.push(employee);

  return employee;
};

export const getActiveEmployees = (): Employee[] => {
  return employees.filter(
    (employee) => employee.status === EmployeeStatus.ACTIVE,
  );
};

export const updateEmployee = (
  id: string,
  data: UpdateEmployeeRequest,
): Employee | null => {
  const employee = employees.find(
    (employee) =>
      employee.id === id && employee.status === EmployeeStatus.ACTIVE,
  );

  if (!employee) {
    return null;
  }

  Object.assign(employee, data);

  return employee;
};

export const deleteEmployee = (id: string): Employee | null => {
  const employee = employees.find(
    (employee) =>
      employee.id === id && employee.status === EmployeeStatus.ACTIVE,
  );

  if (!employee) {
    return null;
  }

  employee.status = EmployeeStatus.TRASH;

  return employee;
};
