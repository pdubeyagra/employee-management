import { LitElement, css, html, nothing, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { generateThemeCSSVariables } from "@/theme/colors.js";
import {
  LAYOUT_CONFIG,
  generateLayoutCSSVariables,
} from "@/theme/layout.js";

import "@/components/shared/app-loading.ts";

export type CardVariant = "elevated" | "outlined" | "filled" | "ghost";

export type CardPadding = "none" | "small" | "medium" | "large";

export type CardOrientation = "vertical" | "horizontal";

export type CardTone = "default" | "primary" | "success" | "danger" | "warning";

export interface CardClickDetail {
  originalEvent: Event;
}

@customElement("ui-card")
export class UiCard extends LitElement {
  @property()
  heading = "";

  @property()
  subheading = "";

  @property()
  badge = "";

  @property({ type: String, reflect: true })
  variant: CardVariant = "elevated";

  @property({ type: String, reflect: true })
  padding: CardPadding = "medium";

  @property({ type: String, reflect: true })
  orientation: CardOrientation = "vertical";

  @property({ type: String, reflect: true })
  tone: CardTone = "default";

  @property({ type: Boolean })
  clickable = false;

  @property()
  href = "";

  @property()
  target = "";

  @property({ type: Boolean })
  selected = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  loading = false;

  @property({ type: String, attribute: "loading-label" })
  loadingLabel = "Loading";

  @property({ type: Boolean })
  dividers = false;

  @property({ type: Boolean, attribute: "full-height", reflect: true })
  fullHeight = false;

  static styles = css`
    :host {
      display: block;
      min-width: 0;
      box-sizing: border-box;
      ${unsafeCSS(generateThemeCSSVariables())}
      ${unsafeCSS(generateLayoutCSSVariables())}
      font-family: ${unsafeCSS(LAYOUT_CONFIG.fontFamily)};

      --card-padding: var(--spacing-xl);
      --card-radius: var(--radius-lg);
      --card-surface: var(--color-background);
      --card-border: var(--color-border);
      --card-shadow: var(--shadow-md);
      --card-accent: var(--color-primary);
      --card-icon-size: 40px;
      --card-icon-radius: var(--radius-md);
      --card-icon-background: color-mix(
        in srgb,
        var(--card-accent) 12%,
        transparent
      );
    }

    :host([hidden]) {
      display: none;
    }

    :host([full-height]) {
      height: 100%;
    }

    :host([padding="none"]) {
      --card-padding: 0px;
    }

    :host([padding="small"]) {
      --card-padding: var(--spacing-md);
    }

    :host([padding="large"]) {
      --card-padding: var(--spacing-3xl);
    }

    :host([tone="primary"]) {
      --card-accent: var(--color-primary);
    }

    :host([tone="success"]) {
      --card-accent: var(--color-success);
    }

    :host([tone="danger"]) {
      --card-accent: var(--color-danger);
    }

    :host([tone="warning"]) {
      --card-accent: var(--color-warning);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .card {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
      width: 100%;
      height: 100%;
      min-width: 0;
      padding: var(--card-padding);
      color: var(--color-text-primary);
      background: var(--card-surface);
      border: 1px solid var(--card-border);
      border-radius: var(--card-radius);
      box-shadow: var(--card-shadow);
      text-align: left;
      text-decoration: none;
      overflow: hidden;
      transition:
        border-color var(--transition-base) ease,
        box-shadow var(--transition-base) ease,
        transform var(--transition-fast) ease,
        background-color var(--transition-base) ease;
    }

    .card.outlined {
      box-shadow: none;
    }

    .card.filled {
      background: var(--color-background-secondary);
      box-shadow: none;
    }

    .card.ghost {
      background: transparent;
      border-color: transparent;
      box-shadow: none;
    }

    .card.horizontal {
      flex-direction: row;
      align-items: flex-start;
      gap: var(--spacing-xl);
    }

    .card.dividers .body {
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--card-border);
    }

    .card.dividers .footer {
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--card-border);
    }

    .card.interactive {
      cursor: pointer;
      appearance: none;
      font: inherit;
    }

    .card.interactive:hover:not(.disabled) {
      border-color: var(--card-accent);
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }

    .card.interactive:active:not(.disabled) {
      transform: translateY(0);
    }

    .card.interactive:focus-visible {
      outline: 3px solid
        color-mix(in srgb, var(--card-accent) 35%, transparent);
      outline-offset: 2px;
    }

    .card.selected {
      border-color: var(--card-accent);
      box-shadow: 0 0 0 1px var(--card-accent);
    }

    .card.disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    .card.loading {
      pointer-events: none;
    }

    :host([tone]:not([tone="default"])) .card::before {
      content: "";
      position: absolute;
      inset: 0 auto 0 0;
      width: 3px;
      background: var(--card-accent);
    }

    .header {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-md);
      min-width: 0;
    }

    .icon-wrap {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: var(--card-icon-size);
      height: var(--card-icon-size);
      color: var(--card-accent);
      background: var(--card-icon-background);
      border-radius: var(--card-icon-radius);
    }

    .heading-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
      min-width: 0;
      flex: 1 1 auto;
    }

    .heading {
      margin: 0;
      color: var(--color-text-primary);
      font-size: var(--font-size-lg);
      line-height: var(--line-height-tight);
      font-weight: 700;
      overflow-wrap: anywhere;
    }

    .subheading {
      margin: 0;
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-relaxed);
      overflow-wrap: anywhere;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      padding: var(--spacing-xs) var(--spacing-md);
      color: var(--card-accent);
      background: color-mix(in srgb, var(--card-accent) 14%, transparent);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      line-height: 1.6;
      font-weight: 700;
      white-space: nowrap;
    }

    .media {
      display: block;
      margin: calc(var(--card-padding) * -1) calc(var(--card-padding) * -1) 0;
    }

    .card.horizontal .media {
      margin: calc(var(--card-padding) * -1) 0 calc(var(--card-padding) * -1)
        calc(var(--card-padding) * -1);
      flex-shrink: 0;
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
      min-width: 0;
      flex: 1 1 auto;
    }

    .body {
      color: var(--color-text-secondary);
      font-size: var(--font-size-base);
      line-height: var(--line-height-relaxed);
      min-width: 0;
    }

    .footer {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--spacing-md);
      min-width: 0;
    }

    .loading-layer {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      background: color-mix(in srgb, var(--card-surface) 70%, transparent);
      backdrop-filter: blur(1px);
      z-index: var(--z-dropdown);
    }

    ::slotted([slot="media"]) {
      display: block;
      width: 100%;
      height: auto;
      object-fit: cover;
    }

    ::slotted([slot="icon"]) {
      width: 20px;
      height: 20px;
    }

    @media (prefers-reduced-motion: reduce) {
      .card {
        transition: none;
      }

      .card.interactive:hover:not(.disabled) {
        transform: none;
      }
    }
  `;

  private hasIcon = false;
  private hasMedia = false;
  private hasFooter = false;

  private slotWatcher(key: "hasIcon" | "hasMedia" | "hasFooter") {
    return (event: Event) => {
      const slot = event.target as HTMLSlotElement;
      const filled = slot.assignedNodes({ flatten: true }).some((node) =>
        node.nodeType === Node.TEXT_NODE
          ? Boolean(node.textContent?.trim())
          : true,
      );

      if (this[key] !== filled) {
        this[key] = filled;
        this.requestUpdate();
      }
    };
  }

  get interactive(): boolean {
    return (this.clickable || Boolean(this.href)) && !this.disabled;
  }

  private handleActivate(event: Event) {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (!this.clickable && !this.href) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent<CardClickDetail>("card-click", {
        detail: { originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleKeydown(event: KeyboardEvent) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    if (this.href) {
      return;
    }

    event.preventDefault();
    this.handleActivate(event);
  }

  private get cardClasses(): string {
    return [
      "card",
      this.variant,
      this.orientation,
      this.interactive ? "interactive" : "",
      this.selected ? "selected" : "",
      this.disabled ? "disabled" : "",
      this.loading ? "loading" : "",
      this.dividers ? "dividers" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  private get headerTemplate() {
    const showHeader =
      this.hasIcon || this.heading || this.subheading || this.badge;

    return html`
      <div class="header" ?hidden=${!showHeader}>
        <span class="icon-wrap" ?hidden=${!this.hasIcon}>
          <slot name="icon" @slotchange=${this.slotWatcher("hasIcon")}></slot>
        </span>

        <div class="heading-group">
          ${this.heading
            ? html`<h3 class="heading">${this.heading}</h3>`
            : nothing}
          ${this.subheading
            ? html`<p class="subheading">${this.subheading}</p>`
            : nothing}
          <slot name="heading"></slot>
        </div>

        ${this.badge ? html`<span class="badge">${this.badge}</span>` : nothing}
      </div>
    `;
  }

  private get innerTemplate() {
    return html`
      <div class="media" ?hidden=${!this.hasMedia}>
        <slot name="media" @slotchange=${this.slotWatcher("hasMedia")}></slot>
      </div>

      <div class="content">
        ${this.headerTemplate}

        <div class="body">
          <slot></slot>
        </div>

        <div class="footer" ?hidden=${!this.hasFooter}>
          <slot name="footer" @slotchange=${this.slotWatcher("hasFooter")}></slot>
        </div>
      </div>

      ${this.loading
        ? html`
            <div class="loading-layer">
              <app-loading
                size="small"
                .label=${this.loadingLabel}
              ></app-loading>
            </div>
          `
        : nothing}
    `;
  }

  render() {
    if (this.href && !this.disabled) {
      return html`
        <a
          class=${this.cardClasses}
          href=${this.href}
          target=${this.target || nothing}
          rel=${this.target === "_blank" ? "noopener noreferrer" : nothing}
          aria-busy=${this.loading ? "true" : nothing}
          @click=${this.handleActivate}
        >
          ${this.innerTemplate}
        </a>
      `;
    }

    if (this.clickable) {
      return html`
        <div
          class=${this.cardClasses}
          role="button"
          tabindex=${this.disabled ? -1 : 0}
          aria-disabled=${this.disabled ? "true" : "false"}
          aria-pressed=${this.selected ? "true" : nothing}
          aria-busy=${this.loading ? "true" : nothing}
          @click=${this.handleActivate}
          @keydown=${this.handleKeydown}
        >
          ${this.innerTemplate}
        </div>
      `;
    }

    return html`
      <div
        class=${this.cardClasses}
        aria-busy=${this.loading ? "true" : nothing}
      >
        ${this.innerTemplate}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-card": UiCard;
  }
}
