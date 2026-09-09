import type { Employee, NewEmployee } from "../../types/employee-types.ts";

export type EmployeeStoreListener = (employees: Employee[]) => void;

export type Unsubscribe = () => void;

/**
 * The roster lives here rather than inside the widget so that every open tab
 * showing the employee widget reads and writes the same list. Two tabs on the
 * same widget behave like two views of one dataset, not two datasets.
 */
export class EmployeeStore {
  private employees: Employee[] = [];

  private readonly listeners = new Set<EmployeeStoreListener>();

  getAll(): Employee[] {
    return this.employees;
  }

  subscribe(listener: EmployeeStoreListener): Unsubscribe {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  add(employee: NewEmployee): Employee {
    const created: Employee = { id: crypto.randomUUID(), ...employee };

    this.commit([...this.employees, created]);

    return created;
  }

  /**
   * Returns false when the id is unknown, so callers can tell a real update
   * apart from a write against an employee another tab already removed.
   */
  update(employee: Employee): boolean {
    if (!this.employees.some((current) => current.id === employee.id)) {
      return false;
    }

    this.commit(
      this.employees.map((current) =>
        current.id === employee.id ? employee : current,
      ),
    );

    return true;
  }

  remove(id: string): boolean {
    const remaining = this.employees.filter((current) => current.id !== id);

    if (remaining.length === this.employees.length) {
      return false;
    }

    this.commit(remaining);

    return true;
  }

  /** Test seam: drops every employee and notifies subscribers. */
  reset() {
    this.commit([]);
  }

  private commit(employees: Employee[]) {
    this.employees = employees;

    for (const listener of this.listeners) {
      listener(employees);
    }
  }
}

export const employeeStore = new EmployeeStore();
