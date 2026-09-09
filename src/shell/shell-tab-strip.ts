import {
  LitElement,
  css,
  html,
  nothing,
  unsafeCSS,
  type TemplateResult,
} from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import { generateThemeCSSVariables } from "../theme/colors.js";
import { LAYOUT_CONFIG, generateLayoutCSSVariables } from "../theme/layout.js";

export interface TabView {
  id: string;
  title: string;
  icon: TemplateResult | null;
  active: boolean;
}

@customElement("shell-tab-strip")
export class ShellTabStrip extends LitElement {
  @property({ type: Array })
  tabs: TabView[] = [];

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

    .strip {
      display: flex;
      align-items: flex-end;
      gap: var(--spacing-xs);

      width: 100%;
      min-width: 0;

      padding: var(--spacing-sm) var(--spacing-sm) 0;

      overflow-x: auto;
      overflow-y: hidden;

      scrollbar-width: thin;
    }

    .strip::-webkit-scrollbar {
      height: 6px;
    }

    .strip::-webkit-scrollbar-thumb {
      background: var(--color-border-secondary);
      border-radius: var(--radius-full);
    }

    .tab {
      display: flex;
      align-items: center;

      flex: 0 1 auto;

      min-width: 0;
      max-width: 220px;

      border-radius: var(--radius-md) var(--radius-md) 0 0;

      background: transparent;

      transition: background-color var(--transition-fast) ease;
    }

    .tab:hover {
      background: color-mix(in srgb, var(--color-background) 55%, transparent);
    }

    .tab.active {
      background: var(--color-background);
      box-shadow: 0 -1px 3px var(--color-shadow);
    }

    .tab-button {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);

      flex: 1 1 auto;
      min-width: 0;

      padding: var(--spacing-sm) var(--spacing-xs) var(--spacing-sm)
        var(--spacing-md);

      border: none;
      background: transparent;

      color: var(--color-text-tertiary);

      font-family: inherit;
      font-size: var(--font-size-sm);
      font-weight: 500;

      cursor: pointer;
    }

    .tab.active .tab-button {
      color: var(--color-text-primary);
      font-weight: 600;
    }

    .tab-button:focus-visible,
    .tab-close:focus-visible,
    .new-tab:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: -2px;
      border-radius: var(--radius-sm);
    }

    .tab-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      flex: 0 0 auto;

      width: 16px;
      height: 16px;
    }

    .tab-icon svg {
      width: 16px;
      height: 16px;
    }

    .tab-title {
      min-width: 0;

      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .tab-close {
      display: flex;
      align-items: center;
      justify-content: center;

      flex: 0 0 auto;

      width: 20px;
      height: 20px;

      margin-right: var(--spacing-sm);

      padding: 0;

      border: none;
      border-radius: var(--radius-sm);

      background: transparent;
      color: var(--color-text-tertiary);

      font-size: var(--font-size-lg);
      line-height: 1;

      cursor: pointer;
    }

    .tab-close:hover {
      background: var(--color-secondary-hover);
      color: var(--color-text-primary);
    }

    .new-tab {
      display: flex;
      align-items: center;
      justify-content: center;

      flex: 0 0 auto;

      width: 30px;
      height: 30px;

      margin-bottom: var(--spacing-xs);

      padding: 0;

      border: none;
      border-radius: var(--radius-md);

      background: transparent;
      color: var(--color-text-secondary);

      font-size: var(--font-size-xl);
      line-height: 1;

      cursor: pointer;
    }

    .new-tab:hover {
      background: color-mix(in srgb, var(--color-background) 65%, transparent);
      color: var(--color-text-primary);
    }

    @media (prefers-reduced-motion: reduce) {
      .tab {
        transition: none;
      }
    }
  `;

  private emit(type: string, detail?: unknown) {
    this.dispatchEvent(
      new CustomEvent(type, { detail, bubbles: true, composed: true }),
    );
  }

  private handleSelect(tabId: string) {
    this.emit("tab-select", tabId);
  }

  private handleClose(event: Event, tabId: string) {
    event.stopPropagation();

    this.emit("tab-close", tabId);
  }

  private handleAuxClick(event: MouseEvent, tabId: string) {
    if (event.button !== 1) {
      return;
    }

    event.preventDefault();

    this.emit("tab-close", tabId);
  }

  private handleKeyDown(event: KeyboardEvent) {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;

    if (step === 0) {
      return;
    }

    const index = this.tabs.findIndex((tab) => tab.active);

    if (index === -1) {
      return;
    }

    const next = this.tabs[index + step];

    if (!next) {
      return;
    }

    event.preventDefault();

    this.handleSelect(next.id);
  }

  private renderTab(tab: TabView): TemplateResult {
    return html`
      <div
        class="tab ${tab.active ? "active" : ""}"
        role="presentation"
        @auxclick=${(event: MouseEvent) => this.handleAuxClick(event, tab.id)}
      >
        <button
          type="button"
          class="tab-button"
          role="tab"
          aria-selected=${tab.active ? "true" : "false"}
          tabindex=${tab.active ? "0" : "-1"}
          title=${tab.title}
          @click=${() => this.handleSelect(tab.id)}
        >
          ${tab.icon
            ? html`<span class="tab-icon" aria-hidden="true">${tab.icon}</span>`
            : nothing}

          <span class="tab-title">${tab.title}</span>
        </button>

        <button
          type="button"
          class="tab-close"
          aria-label="Close ${tab.title}"
          @click=${(event: Event) => this.handleClose(event, tab.id)}
        >
          &times;
        </button>
      </div>
    `;
  }

  render() {
    return html`
      <div
        class="strip"
        role="tablist"
        aria-label="Open widgets"
        @keydown=${this.handleKeyDown}
      >
        ${repeat(
          this.tabs,
          (tab) => tab.id,
          (tab) => this.renderTab(tab),
        )}

        <button
          type="button"
          class="new-tab"
          aria-label="New tab"
          title="New tab"
          @click=${() => this.emit("tab-new")}
        >
          +
        </button>
      </div>
    `;
  }
}
