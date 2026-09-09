import { registerWidgets, type WidgetDefinition } from "./widget-registry.ts";
import { employeeWidgetDefinition } from "./employee/employee-widget.ts";
import { buttonWidgetDefinition } from "./button/button-widget.ts";
import { dialogWidgetDefinition } from "./dialog/dialog-widget.ts";
import { confirmDialogWidgetDefinition } from "./confirm-dialog/confirm-dialog-widget.ts";

export const WIDGET_CATALOG: readonly WidgetDefinition[] = [
  employeeWidgetDefinition,
  buttonWidgetDefinition,
  dialogWidgetDefinition,
  confirmDialogWidgetDefinition,
];

registerWidgets(WIDGET_CATALOG);
