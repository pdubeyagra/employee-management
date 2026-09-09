export const APP_PROTOCOL = "app://";

export const NEW_TAB_ID = "new-tab";

export const NEW_TAB_URL = `${APP_PROTOCOL}${NEW_TAB_ID}`;

export function widgetUrl(widgetId: string): string {
  return `${APP_PROTOCOL}${widgetId}`;
}

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
