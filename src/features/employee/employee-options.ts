import type { SelectOption } from "@/components/ui/ui-select.ts";

const asOptions = (labels: readonly string[]): SelectOption[] =>
  labels.map((label) => ({ value: label, label }));

export const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Product",
  "Research",
  "Sales",
  "Marketing",
  "Finance",
  "Human Resources",
  "Operations",
  "Support",
  "Legal",
] as const;

export const DESIGNATIONS = [
  "Intern",
  "Associate",
  "Software Engineer",
  "Senior Software Engineer",
  "Staff Engineer",
  "Principal Engineer",
  "Engineering Manager",
  "Director",
  "VP Engineering",
  "Chief Technology Officer",
] as const;

export const DEPARTMENT_OPTIONS = asOptions(DEPARTMENTS);

export const DESIGNATION_OPTIONS = asOptions(DESIGNATIONS);

/**
 * Appends `value` to `options` when it is not already one of them.
 *
 * Employees stored before a list changed can hold a value that is no longer
 * offered. Without this the select would fall back to its placeholder and the
 * next save would quietly wipe the field, so the stored value stays selectable
 * until someone deliberately picks a different one.
 */
export function withCurrentValue(
  options: SelectOption[],
  value: string,
): SelectOption[] {
  const current = value.trim();

  if (!current || options.some((option) => option.value === current)) {
    return options;
  }

  return [...options, { value: current, label: current }];
}
