import { LitElement, css, html, unsafeCSS, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { generateThemeCSSVariables } from "../theme/colors.js";
import { LAYOUT_CONFIG, generateLayoutCSSVariables } from "../theme/layout.js";

@customElement("shell-toolbar")
export class ShellToolbar extends LitElement {
  @property({ type: String })
  url = "";

  @property({ type: Boolean, attribute: "can-go-back" })
  canGoBack = false;

  @property({ type: Boolean, attribute: "can-go-forward" })
  canGoForward = false;

  @property({ type: Boolean })
  resolved = true;

  @state()
  private draft = "";

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

    .toolbar {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);

      width: 100%;
      min-width: 0;

      padding: var(--spacing-sm) var(--spacing-md);
    }

    .nav-button {
      display: flex;
      align-items: center;
      justify-content: center;

      flex: 0 0 auto;

      width: 32px;
      height: 32px;

      padding: 0;

      border: none;
      border-radius: var(--radius-full);

      background: transparent;
      color: var(--color-text-secondary);

      cursor: pointer;

      transition:
        background-color var(--transition-fast) ease,
        opacity var(--transition-fast) ease;
    }

    .nav-button:hover:not(:disabled) {
      background: var(--color-secondary);
      color: var(--color-text-primary);
    }

    .nav-button:disabled {
      opacity: 0.35;
      cursor: default;
    }

    .nav-button:focus-visible,
    .address-input:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    .nav-button svg {
      width: 18px;
      height: 18px;

      fill: none;
      stroke: currentColor;

      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .address {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);

      flex: 1 1 auto;
      min-width: 0;

      height: 34px;

      padding: 0 var(--spacing-md);

      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);

      background: var(--color-background);

      transition: border-color var(--transition-fast) ease;
    }

    .address:focus-within {
      border-color: var(--color-primary);
    }

    .address-status {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      flex: 0 0 auto;

      width: 16px;
      height: 16px;

      color: var(--color-success);
    }

    .address-status.unresolved {
      color: var(--color-warning);
    }

    .address-status svg {
      width: 14px;
      height: 14px;

      fill: none;
      stroke: currentColor;

      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .address-input {
      flex: 1 1 auto;
      min-width: 0;

      border: none;
      outline: none;

      background: transparent;
      color: var(--color-text-primary);

      font-family: inherit;
      font-size: var(--font-size-sm);
    }

    @media (max-width: ${unsafeCSS(LAYOUT_CONFIG.breakpoints.sm)}px) {
      .toolbar {
        gap: var(--spacing-xs);
        padding: var(--spacing-sm);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .nav-button,
      .address {
        transition: none;
      }
    }
  `;

  willUpdate(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("url")) {
      this.draft = this.url;
    }
  }

  private emit(type: string, detail?: unknown) {
    this.dispatchEvent(
      new CustomEvent(type, { detail, bubbles: true, composed: true }),
    );
  }

  private handleInput(event: Event) {
    this.draft = (event.target as HTMLInputElement).value;
  }

  private handleSubmit(event: Event) {
    event.preventDefault();

    this.emit("navigate", this.draft);
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key !== "Escape") {
      return;
    }

    event.stopPropagation();

    this.draft = this.url;
  }

  private handleFocus(event: FocusEvent) {
    (event.target as HTMLInputElement).select();
  }

  private get statusIconTemplate(): TemplateResult {
    return this.resolved
      ? html`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
        `
      : html`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5" />
            <path d="M12 16h.01" />
          </svg>
        `;
  }

  render() {
    return html`
      <div class="toolbar">
        <button
          type="button"
          class="nav-button"
          aria-label="Back"
          title="Back"
          ?disabled=${!this.canGoBack}
          @click=${() => this.emit("navigate-back")}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          type="button"
          class="nav-button"
          aria-label="Forward"
          title="Forward"
          ?disabled=${!this.canGoForward}
          @click=${() => this.emit("navigate-forward")}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <button
          type="button"
          class="nav-button"
          aria-label="Reload"
          title="Reload"
          @click=${() => this.emit("reload")}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
          </svg>
        </button>

        <form class="address" role="search" @submit=${this.handleSubmit}>
          <span
            class="address-status ${this.resolved ? "" : "unresolved"}"
            title=${this.resolved ? "Registered widget" : "Unknown address"}
          >
            ${this.statusIconTemplate}
          </span>

          <input
            class="address-input"
            type="text"
            aria-label="Address"
            placeholder="app://employees"
            spellcheck="false"
            autocomplete="off"
            .value=${this.draft}
            @input=${this.handleInput}
            @keydown=${this.handleKeyDown}
            @focus=${this.handleFocus}
          />
        </form>
      </div>
    `;
  }
}
