import type { SelectOption } from "@/components/ui/ui-select.ts";

const asOptions = (labels: readonly string[]): SelectOption[] =>
  labels.map((label) => ({ value: label, label }));

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
