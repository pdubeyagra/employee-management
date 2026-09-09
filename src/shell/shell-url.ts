/**
 * The shell addresses widgets with an app:// URL whose host is the widget id,
 * so "app://employees" is the employee widget. Keeping the parsing here means
 * the address bar, the tab model and the registry all agree on one spelling.
 */
export const APP_PROTOCOL = "app://";

export const NEW_TAB_ID = "new-tab";

export const NEW_TAB_URL = `${APP_PROTOCOL}${NEW_TAB_ID}`;

export function widgetUrl(widgetId: string): string {
  return `${APP_PROTOCOL}${widgetId}`;
}

/**
 * Turns whatever was typed into the address bar into a canonical app:// URL.
 * A bare word is treated as a widget id, so typing "employees" works.
 */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim().toLowerCase();

  if (trimmed.length === 0) {
    return NEW_TAB_URL;
  }

  const withoutProtocol = trimmed.startsWith(APP_PROTOCOL)
    ? trimmed.slice(APP_PROTOCOL.length)
    : trimmed;

  const host = withoutProtocol.replace(/^\/+/, "").replace(/\/+$/, "");

  if (host.length === 0) {
    return NEW_TAB_URL;
  }

  return widgetUrl(host);
}

/** The widget id an app:// URL points at, or null if it is not one of ours. */
export function widgetIdFromUrl(url: string): string | null {
  if (!url.toLowerCase().startsWith(APP_PROTOCOL)) {
    return null;
  }

  const host = url.slice(APP_PROTOCOL.length).replace(/\/+$/, "");

  return host.length > 0 ? host.toLowerCase() : null;
}

export function isNewTabUrl(url: string): boolean {
  return widgetIdFromUrl(url) === NEW_TAB_ID;
}
