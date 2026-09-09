import type { TemplateResult } from "lit";
export interface WidgetDefinition {
  id: string;
  title: string;
  description: string;
  icon: TemplateResult;
  render: () => TemplateResult;
}

const WIDGET_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const widgets = new Map<string, WidgetDefinition>();

export function registerWidget(definition: WidgetDefinition): WidgetDefinition {
  if (!WIDGET_ID_PATTERN.test(definition.id)) {
    throw new Error(
      `Widget id "${definition.id}" must be lowercase, digits and dashes, so it can be used as a URL host.`,
    );
  }

  if (widgets.has(definition.id)) {
    throw new Error(`Widget "${definition.id}" is already registered.`);
  }

  widgets.set(definition.id, definition);

  return definition;
}

export function registerWidgets(
  definitions: readonly WidgetDefinition[],
): void {
  for (const definition of definitions) {
    registerWidget(definition);
  }
}

export function getWidget(id: string): WidgetDefinition | undefined {
  return widgets.get(id);
}

export function hasWidget(id: string): boolean {
  return widgets.has(id);
}

export function listWidgets(): WidgetDefinition[] {
  return Array.from(widgets.values());
}

export function clearWidgets(): void {
  widgets.clear();
}
