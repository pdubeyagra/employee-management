import { LitElement, css, html, nothing, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { generateThemeCSSVariables } from "@/theme/colors.js";
import {
  LAYOUT_CONFIG,
  generateLayoutCSSVariables,
} from "@/theme/layout.js";

export type LoadingVariant = "spinner" | "dots" | "bar" | "skeleton" | "pulse";

export type LoadingSize = "small" | "medium" | "large";

export type LoadingTone = "primary" | "neutral" | "inverse";

@customElement("app-loading")
export class AppLoading extends LitElement {
  @property({ type: String, reflect: true })
  variant: LoadingVariant = "spinner";

  @property({ type: String, reflect: true })
  size: LoadingSize = "medium";

  @property({ type: String, reflect: true })
  tone: LoadingTone = "primary";

  @property({ type: String })
  label = "Loading";

  @property({ type: Boolean, attribute: "hide-label" })
  hideLabel = true;

  @property({ type: Boolean, reflect: true })
  overlay = false;

  @property({ type: Boolean, reflect: true })
  fullscreen = false;

  @property({ type: Boolean, reflect: true })
  inline = false;

  @property({ type: Number })
  delay = 0;

  @property({ type: Number })
  progress: number | null = null;

  @property({ type: Number })
  lines = 3;

  @property({ type: Boolean })
  active = true;

  @state()
  private waiting = false;

  private delayTimer?: ReturnType<typeof setTimeout>;

  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      ${unsafeCSS(generateThemeCSSVariables())}
      ${unsafeCSS(generateLayoutCSSVariables())}
      font-family: ${unsafeCSS(LAYOUT_CONFIG.fontFamily)};

      --loading-size: 32px;
      --loading-thickness: 3px;
      --loading-color: var(--color-primary);
      --loading-track: color-mix(in srgb, var(--color-primary) 18%, transparent);
      --loading-gap: var(--spacing-md);
    }

    :host([hidden]) {
      display: none;
    }

    :host([inline]) {
      display: inline-flex;
      vertical-align: middle;
    }

    :host([size="small"]) {
      --loading-size: 18px;
      --loading-thickness: 2px;
      --loading-gap: var(--spacing-sm);
    }

    :host([size="large"]) {
      --loading-size: 48px;
      --loading-thickness: 4px;
      --loading-gap: var(--spacing-lg);
    }

    :host([tone="neutral"]) {
      --loading-color: var(--color-text-tertiary);
      --loading-track: var(--color-border);
    }

    :host([tone="inverse"]) {
      --loading-color: var(--color-text-inverse);
      --loading-track: rgba(255, 255, 255, 0.25);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .root {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: var(--loading-gap);
      width: 100%;
      min-width: 0;
    }

    :host([inline]) .root {
      flex-direction: row;
      width: auto;
    }

    :host([overlay]) .root,
    :host([fullscreen]) .root {
      position: absolute;
      inset: 0;
      z-index: var(--z-modal);
      background: color-mix(
        in srgb,
        var(--color-background) 72%,
        transparent
      );
      backdrop-filter: blur(2px);
    }

    :host([fullscreen]) .root {
      position: fixed;
    }

    .spinner {
      width: var(--loading-size);
      height: var(--loading-size);
      flex-shrink: 0;
      border: var(--loading-thickness) solid var(--loading-track);
      border-top-color: var(--loading-color);
      border-radius: var(--radius-full);
      animation: spin 0.75s linear infinite;
    }

    .ring {
      width: var(--loading-size);
      height: var(--loading-size);
      flex-shrink: 0;
      color: var(--loading-color);
      animation: spin 1.4s linear infinite;
    }

    .ring circle {
      fill: none;
      stroke: currentColor;
      stroke-width: var(--loading-thickness);
      stroke-linecap: round;
      stroke-dasharray: 62;
      stroke-dashoffset: 46;
    }

    .dots {
      display: inline-flex;
      align-items: center;
      gap: calc(var(--loading-size) / 5);
    }

    .dot {
      width: calc(var(--loading-size) / 4);
      height: calc(var(--loading-size) / 4);
      background: var(--loading-color);
      border-radius: var(--radius-full);
      animation: bounce 1.1s ease-in-out infinite;
    }

    .dot:nth-child(2) {
      animation-delay: 0.14s;
    }

    .dot:nth-child(3) {
      animation-delay: 0.28s;
    }

    .bar {
      position: relative;
      width: 100%;
      max-width: 320px;
      height: var(--loading-thickness);
      overflow: hidden;
      background: var(--loading-track);
      border-radius: var(--radius-full);
    }

    .bar-fill {
      position: absolute;
      inset: 0 auto 0 0;
      width: 40%;
      background: var(--loading-color);
      border-radius: inherit;
      animation: slide 1.2s ease-in-out infinite;
    }

    .bar-fill.determinate {
      position: relative;
      animation: none;
      transition: width var(--transition-slow) ease;
    }

    .skeleton {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      width: 100%;
    }

    .skeleton-line {
      height: calc(var(--loading-size) / 2.6);
      background: linear-gradient(
        90deg,
        var(--color-background-secondary) 25%,
        var(--color-border) 37%,
        var(--color-background-secondary) 63%
      );
      background-size: 400% 100%;
      border-radius: var(--radius-sm);
      animation: shimmer 1.4s ease infinite;
    }

    .skeleton-line:last-child {
      width: 60%;
    }

    .pulse {
      width: var(--loading-size);
      height: var(--loading-size);
      flex-shrink: 0;
      background: var(--loading-color);
      border-radius: var(--radius-full);
      animation: pulse 1.2s ease-in-out infinite;
    }

    .label {
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
      text-align: center;
    }

    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      white-space: nowrap;
      border: 0;
    }

    ::slotted([slot="icon"]) {
      width: var(--loading-size);
      height: var(--loading-size);
      color: var(--loading-color);
      animation: spin 1.2s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes bounce {
      0%,
      80%,
      100% {
        transform: translateY(0);
        opacity: 0.55;
      }
      40% {
        transform: translateY(calc(var(--loading-size) / -4));
        opacity: 1;
      }
    }

    @keyframes slide {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(350%);
      }
    }

    @keyframes shimmer {
      0% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0 50%;
      }
    }

    @keyframes pulse {
      0%,
      100% {
        transform: scale(0.75);
        opacity: 0.6;
      }
      50% {
        transform: scale(1);
        opacity: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .spinner,
      .ring,
      .dot,
      .bar-fill,
      .skeleton-line,
      .pulse,
      ::slotted([slot="icon"]) {
        animation: none;
      }

      .bar-fill {
        width: 100%;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.startDelay();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.clearDelay();
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has("delay") || changed.has("active")) {
      this.startDelay();
    }
  }

  private clearDelay() {
    if (this.delayTimer !== undefined) {
      clearTimeout(this.delayTimer);
      this.delayTimer = undefined;
    }
  }

  private startDelay() {
    this.clearDelay();

    if (!this.active || this.delay <= 0) {
      this.waiting = false;
      return;
    }

    this.waiting = true;

    this.delayTimer = setTimeout(() => {
      this.waiting = false;
      this.delayTimer = undefined;
    }, this.delay);
  }

  get visible(): boolean {
    return this.active && !this.waiting;
  }

  get clampedProgress(): number | null {
    if (this.progress === null || !Number.isFinite(this.progress)) {
      return null;
    }

    return Math.min(100, Math.max(0, this.progress));
  }

  private hasCustomIcon = false;

  private handleIconSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;

    this.hasCustomIcon = slot.assignedNodes({ flatten: true }).length > 0;
    this.requestUpdate();
  }

  private get indicatorTemplate() {
    if (this.hasCustomIcon) {
      return nothing;
    }

    if (this.variant === "dots") {
      return html`
        <div class="dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      `;
    }

    if (this.variant === "bar") {
      const progress = this.clampedProgress;

      return html`
        <div class="bar">
          <div
            class="bar-fill ${progress === null ? "" : "determinate"}"
            style=${progress === null ? nothing : `width: ${progress}%`}
          ></div>
        </div>
      `;
    }

    if (this.variant === "skeleton") {
      return html`
        <div class="skeleton">
          ${Array.from(
            { length: Math.max(1, this.lines) },
            () => html`<div class="skeleton-line"></div>`,
          )}
        </div>
      `;
    }

    if (this.variant === "pulse") {
      return html`<div class="pulse"></div>`;
    }

    return html`
      <svg class="ring" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
      </svg>
    `;
  }

  render() {
    if (!this.visible) {
      return nothing;
    }

    const progress = this.clampedProgress;

    return html`
      <div
        class="root"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label=${this.hideLabel ? this.label : nothing}
        aria-valuenow=${progress === null ? nothing : progress}
        aria-valuemin=${progress === null ? nothing : 0}
        aria-valuemax=${progress === null ? nothing : 100}
      >
        <slot name="icon" @slotchange=${this.handleIconSlotChange}></slot>

        ${this.indicatorTemplate}
        ${this.hideLabel
          ? html`<span class="visually-hidden">${this.label}</span>`
          : html`<span class="label">${this.label}</span>`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-loading": AppLoading;
  }
}
