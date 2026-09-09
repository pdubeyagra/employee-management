import { LitElement, css, html, unsafeCSS, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import { generateThemeCSSVariables } from "../theme/colors.js";
import { LAYOUT_CONFIG, generateLayoutCSSVariables } from "../theme/layout.js";
import type { WidgetDefinition } from "../widgets/widget-registry.ts";

@customElement("shell-new-tab")
export class ShellNewTab extends LitElement {
  @property({ type: Array })
  widgets: WidgetDefinition[] = [];

  @property({ type: String })
  heading = "Open a widget";

  @property({ type: String })
  message = "Pick a widget to open it in this tab.";

  static styles = css`
    :host {
      display: block;
      width: 100%;
      min-height: 100%;
      min-width: 0;
      box-sizing: border-box;
      ${unsafeCSS(generateThemeCSSVariables())}
      ${unsafeCSS(generateLayoutCSSVariables())}
      background: var(--color-background-secondary);
      color: var(--color-text-primary);
      font-family: ${unsafeCSS(LAYOUT_CONFIG.fontFamily)};
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .launcher {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2xl);

      width: 100%;
      max-width: 900px;

      margin: 0 auto;

      padding: clamp(var(--spacing-2xl), 6vw, 64px) var(--spacing-xl);
    }

    .launcher-heading {
      margin: 0;

      font-size: clamp(var(--font-size-xl), 4vw, var(--font-size-3xl));
      line-height: var(--line-height-tight);
      font-weight: 700;
    }

    .launcher-message {
      margin: var(--spacing-sm) 0 0;

      color: var(--color-text-tertiary);

      font-size: var(--font-size-md);
      line-height: var(--line-height-relaxed);
    }

    .widget-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: var(--spacing-lg);

      margin: 0;
      padding: 0;

      list-style: none;
    }

    .widget-tile {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-sm);

      width: 100%;
      height: 100%;

      padding: var(--spacing-xl);

      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);

      background: var(--color-background);
      color: inherit;

      font-family: inherit;
      text-align: left;

      cursor: pointer;

      transition:
        border-color var(--transition-fast) ease,
        box-shadow var(--transition-fast) ease,
        transform var(--transition-fast) ease;
    }

    .widget-tile:hover {
      border-color: var(--color-primary);
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .widget-tile:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    .tile-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      width: 40px;
      height: 40px;

      border-radius: var(--radius-md);

      background: var(--color-primary-light);
      color: var(--color-primary);
    }

    .tile-icon svg {
      width: 22px;
      height: 22px;
    }

    .tile-title {
      font-size: var(--font-size-lg);
      font-weight: 600;
    }

    .tile-description {
      color: var(--color-text-tertiary);

      font-size: var(--font-size-sm);
      line-height: var(--line-height-relaxed);
    }

    .tile-url {
      margin-top: auto;

      padding-top: var(--spacing-sm);

      color: var(--color-text-tertiary);

      font-family: ui-monospace, "SFMono-Regular", "Consolas", monospace;
      font-size: var(--font-size-xs);
    }

    .empty {
      padding: var(--spacing-2xl);

      border: 1px dashed var(--color-border-secondary);
      border-radius: var(--radius-lg);

      color: var(--color-text-tertiary);

      font-size: var(--font-size-sm);
      text-align: center;
    }

    @media (prefers-reduced-motion: reduce) {
      .widget-tile {
        transition: none;
      }

      .widget-tile:hover {
        transform: none;
      }
    }
  `;

  private handleOpen(widgetId: string) {
    this.dispatchEvent(
      new CustomEvent("open-widget", {
        detail: widgetId,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private renderTile(widget: WidgetDefinition): TemplateResult {
    return html`
      <li>
        <button
          type="button"
          class="widget-tile"
          @click=${() => this.handleOpen(widget.id)}
        >
          <span class="tile-icon" aria-hidden="true">${widget.icon}</span>

          <span class="tile-title">${widget.title}</span>
          <span class="tile-description">${widget.description}</span>
          <span class="tile-url">app://${widget.id}</span>
        </button>
      </li>
    `;
  }

  render() {
    return html`
      <div class="launcher">
        <header>
          <h1 class="launcher-heading">${this.heading}</h1>
          <p class="launcher-message">${this.message}</p>
        </header>

        ${this.widgets.length === 0
          ? html`
              <p class="empty">
                No widgets are registered yet. Add one to the widget catalog to
                see it here.
              </p>
            `
          : html`
              <ul class="widget-grid">
                ${this.widgets.map((widget) => this.renderTile(widget))}
              </ul>
            `}
      </div>
    `;
  }
}
