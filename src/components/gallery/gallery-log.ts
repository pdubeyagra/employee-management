import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import { generateThemeCSSVariables } from "../../theme/colors.js";
import {
  LAYOUT_CONFIG,
  generateLayoutCSSVariables,
} from "../../theme/layout.js";

/**
 * Shows the events a demo has fired, newest first, so the gallery proves which
 * event name a component actually dispatches.
 */
@customElement("gallery-log")
export class GalleryLog extends LitElement {
  @property({ type: Array })
  entries: string[] = [];

  @property()
  emptyMessage = "Nothing yet. Interact with the example above.";

  static styles = css`
    :host {
      display: block;
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      ${unsafeCSS(generateThemeCSSVariables())}
      ${unsafeCSS(generateLayoutCSSVariables())}
      font-family: ${unsafeCSS(LAYOUT_CONFIG.fontFamily)};
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .log {
      width: 100%;
      min-width: 0;

      margin: 0;
      padding: 0;

      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);

      background: var(--color-background-secondary);

      list-style: none;

      overflow: hidden;
    }

    .entry {
      padding: var(--spacing-sm) var(--spacing-lg);

      border-bottom: 1px solid var(--color-border);

      color: var(--color-text-secondary);

      font-family: ui-monospace, "SFMono-Regular", "Consolas", monospace;
      font-size: var(--font-size-xs);

      overflow-wrap: anywhere;
    }

    .entry:last-child {
      border-bottom: none;
    }

    .entry.latest {
      background: var(--color-primary-light);
      color: var(--color-primary);
      font-weight: 600;
    }

    .empty {
      padding: var(--spacing-md) var(--spacing-lg);

      color: var(--color-text-tertiary);

      font-size: var(--font-size-sm);
      text-align: center;
    }
  `;

  render() {
    if (this.entries.length === 0) {
      return html`<p class="empty">${this.emptyMessage}</p>`;
    }

    return html`
      <ul class="log" aria-live="polite" aria-label="Event log">
        ${this.entries.map(
          (entry, index) =>
            html`<li class="entry ${index === 0 ? "latest" : ""}">${entry}</li>`,
        )}
      </ul>
    `;
  }
}
