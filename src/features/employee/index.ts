/**
 * Public surface of the employee feature.
 *
 * Everything outside `features/employee/` imports from this file and nothing
 * else, so the feature's internals stay free to move. Importing it registers
 * <employee-widget>, which is the only element the feature exposes; the form,
 * details and table elements it composes are private to the feature.
 */
export { EmployeeWidget } from "./employee-widget.ts";

export type {
  Employee,
  NewEmployee,
  EmployeeField,
  EmployeeFormData,
  EmployeeErrors,
} from "./employee-types.ts";

export {
  DEPARTMENTS,
  DESIGNATIONS,
  DEPARTMENT_OPTIONS,
  DESIGNATION_OPTIONS,
  withCurrentValue,
} from "./employee-options.ts";

export {
  EMPLOYEE_FIELD_RULES,
  EMPLOYEE_FIELDS,
  FIELD_MAX_LENGTHS,
  validateEmployeeField,
  validateEmployeeForm,
  isEmployeeFormValid,
} from "./employee-validation.ts";
