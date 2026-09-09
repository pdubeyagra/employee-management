import type { TemplateResult } from "lit";

/**
 * Everything the shell needs to list a widget, address it by URL and render
 * it. Adding a widget to the app means writing one of these and registering
 * it in the catalog -- the shell itself never learns any widget's name.
 */
export interface WidgetDefinition {
  /** URL host for the widget, e.g. "employees" for app://employees. */
  id: string;

  /** Shown on the tab and in the address bar suggestions. */
  title: string;

  /** One line describing the widget on the new tab page. */
  description: string;

  /** Inline <svg> used as the tab favicon and launcher tile icon. */
  icon: TemplateResult;

  /** Builds the widget's element. Called once per tab showing the widget. */
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

/** Registration order, which is the order the launcher and shell present. */
export function listWidgets(): WidgetDefinition[] {
  return Array.from(widgets.values());
}

/** Test seam: empties the registry. */
export function clearWidgets(): void {
  widgets.clear();
}
