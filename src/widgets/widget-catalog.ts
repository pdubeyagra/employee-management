import { registerWidgets, type WidgetDefinition } from "./widget-registry.ts";
import { employeeWidgetDefinition } from "./employee/employee-widget.ts";
import { buttonWidgetDefinition } from "./button/button-widget.ts";
import { dialogWidgetDefinition } from "./dialog/dialog-widget.ts";
import { confirmDialogWidgetDefinition } from "./confirm-dialog/confirm-dialog-widget.ts";

/**
 * Every widget the shell can open, in the order the launcher presents them.
 * The first one is what a fresh shell opens on.
 *
 * To add one: create src/widgets/<name>/, export a WidgetDefinition from it,
 * and list it here. The shell picks it up from the registry -- no shell file
 * needs to change.
 */
export const WIDGET_CATALOG: readonly WidgetDefinition[] = [
  employeeWidgetDefinition,
  buttonWidgetDefinition,
  dialogWidgetDefinition,
  confirmDialogWidgetDefinition,
];

registerWidgets(WIDGET_CATALOG);
