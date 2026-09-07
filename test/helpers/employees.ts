import type { Employee } from "../../src/types/employee-types.ts";

let sequence = 0;

export function makeEmployee(overrides: Partial<Employee> = {}): Employee {
  sequence += 1;

  return {
    id: `id-${sequence}`,
    name: `Employee ${sequence}`,
    department: "Engineering",
    designation: "Software Engineer",
    email: `employee${sequence}@example.com`,
    ...overrides,
  };
}

export function makeEmployees(count: number): Employee[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `id-${index + 1}`,
    name: `Employee ${index + 1}`,
    department: "Engineering",
    designation: "Software Engineer",
    email: `employee${index + 1}@example.com`,
  }));
}
