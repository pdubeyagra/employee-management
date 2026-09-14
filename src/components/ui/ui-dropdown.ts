import { LitElement, css, html, nothing, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { generateThemeCSSVariables } from "@/theme/colors.js";
import {
  LAYOUT_CONFIG,
  generateLayoutCSSVariables,
} from "@/theme/layout.js";

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface DropdownChangeDetail {
  value: string;
  option: DropdownOption;
}

export type DropdownPlacement = "bottom" | "top";

export type DropdownTone = "default" | "inverse";

let instanceCount = 0;

@customElement("ui-dropdown")
export class UiDropdown extends LitElement {
  @property()
  label = "";

  @property()
  value = "";

  @property()
  placeholder = "Select an option";

  @property({ attribute: false })
  options: DropdownOption[] = [];

  @property()
  error = "";

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  invalid = false;

  @property({ type: Boolean, reflect: true })
  compact = false;

  @property({ type: String, reflect: true })
  tone: DropdownTone = "default";

  @property({ type: String, reflect: true })
  placement: DropdownPlacement = "bottom";

  @property({ type: Number, attribute: "max-visible" })
  maxVisible = 6;

  @state()
  private open = false;

  @state()
  private activeIndex = -1;

  @state()
  private selfError = "";

  private readonly uid = `ui-dropdown-${++instanceCount}`;

  private typeahead = "";
  private typeaheadTimer?: ReturnType<typeof setTimeout>;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      ${unsafeCSS(generateThemeCSSVariables())}
      ${unsafeCSS(generateLayoutCSSVariables())}
      font-family: ${unsafeCSS(LAYOUT_CONFIG.fontFamily)};

      --dropdown-height: 44px;
      --dropdown-surface: var(--color-background);
      --dropdown-border: var(--color-border);
      --dropdown-text: var(--color-text-primary);
      --dropdown-muted: var(--color-text-tertiary);
      --dropdown-accent: var(--color-primary);
      --dropdown-menu-surface: var(--color-background);
      --dropdown-menu-text: var(--color-text-primary);
      --dropdown-hover: var(--color-background-secondary);
    }

    :host([hidden]) {
      display: none;
    }

    :host([compact]) {
      display: inline-block;
      width: auto;
      --dropdown-height: 32px;
    }

    :host([tone="inverse"]) {
      --dropdown-surface: rgba(255, 255, 255, 0.16);
      --dropdown-border: rgba(255, 255, 255, 0.45);
      --dropdown-text: #ffffff;
      --dropdown-muted: rgba(255, 255, 255, 0.75);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      width: 100%;
      min-width: 0;
    }

    :host([compact]) .field {
      gap: 0;
    }

    .label {
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
      font-weight: 600;
    }

    .required-mark {
      margin-left: var(--spacing-xs);
      color: var(--color-danger);
    }

    .anchor {
      position: relative;
      width: 100%;
      min-width: 0;
    }

    .trigger {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      width: 100%;
      min-width: 0;
      height: var(--dropdown-height);
      padding: 0 var(--spacing-md);
      color: var(--dropdown-text);
      background: var(--dropdown-surface);
      border: 1px solid var(--dropdown-border);
      border-radius: var(--radius-md);
      outline: none;
      font-family: inherit;
      font-size: var(--font-size-md);
      text-align: left;
      cursor: pointer;
      transition:
        border-color var(--transition-base) ease,
        box-shadow var(--transition-base) ease;
    }

    :host([compact]) .trigger {
      font-size: var(--font-size-sm);
      padding: 0 var(--spacing-sm);
    }

    .trigger:hover:not(:disabled) {
      border-color: var(--dropdown-accent);
    }

    .trigger:focus-visible {
      border-color: var(--dropdown-accent);
      box-shadow: 0 0 0 3px
        color-mix(in srgb, var(--dropdown-accent) 28%, transparent);
    }

    .trigger[aria-expanded="true"] {
      border-color: var(--dropdown-accent);
    }

    .trigger:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    :host([invalid]) .trigger,
    .trigger.invalid {
      border-color: var(--color-danger);
    }

    .trigger-text {
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .trigger-text.placeholder {
      color: var(--dropdown-muted);
    }

    .chevron {
      flex-shrink: 0;
      width: 12px;
      height: 12px;
      color: var(--dropdown-muted);
      transition: transform var(--transition-fast) ease;
    }

    .trigger[aria-expanded="true"] .chevron {
      transform: rotate(180deg);
    }

    .menu {
      position: fixed;
      top: 0;
      left: 0;
      z-index: var(--z-modal);
      margin: 0;
      padding: var(--spacing-xs);
      list-style: none;
      width: max-content;
      max-width: min(90vw, 420px);
      max-height: calc(var(--dropdown-height) * var(--dropdown-max-visible, 6));
      overflow-y: auto;
      overscroll-behavior: contain;
      color: var(--dropdown-menu-text);
      background: var(--dropdown-menu-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
    }

    .option {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-sm);
      color: var(--color-text-primary);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-relaxed);
      cursor: pointer;
      white-space: nowrap;
    }

    .option[aria-selected="true"] {
      color: var(--dropdown-accent);
      font-weight: 600;
    }

    .option.active {
      background: var(--dropdown-hover);
    }

    .option[aria-disabled="true"] {
      color: var(--color-text-tertiary);
      cursor: not-allowed;
    }

    .option-body {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1 1 auto;
    }

    .option-description {
      color: var(--color-text-tertiary);
      font-size: var(--font-size-xs);
      font-weight: 400;
    }

    .check {
      flex-shrink: 0;
      width: 14px;
      height: 14px;
      color: var(--dropdown-accent);
    }

    .check.hidden {
      visibility: hidden;
    }

    .empty {
      padding: var(--spacing-sm) var(--spacing-md);
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
    }

    .error-message {
      min-height: 18px;
      color: var(--color-danger);
      font-size: var(--font-size-xs);
      line-height: var(--line-height-normal);
    }

    @media (prefers-reduced-motion: reduce) {
      .trigger,
      .chevron {
        transition: none;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("pointerdown", this.handleDocumentPointerDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("pointerdown", this.handleDocumentPointerDown);
    this.watchViewport(false);

    if (this.typeaheadTimer !== undefined) {
      clearTimeout(this.typeaheadTimer);
    }
  }

  private handleDocumentPointerDown = (event: Event) => {
    if (!this.open) {
      return;
    }

    if (event.composedPath().includes(this)) {
      return;
    }

    this.closeMenu();
  };

  get selectedOption(): DropdownOption | null {
    return this.options.find((option) => option.value === this.value) ?? null;
  }

  get isOpen(): boolean {
    return this.open;
  }

  get validationMessage(): string {
    return this.error || this.selfError;
  }

  validate(): string {
    const name = this.label || "This field";

    this.selfError =
      this.required && !this.value.trim() ? `${name} is required.` : "";

    return this.selfError;
  }

  private get selectableIndexes(): number[] {
    return this.options
      .map((option, index) => (option.disabled ? -1 : index))
      .filter((index) => index >= 0);
  }

  openMenu() {
    if (this.disabled || this.open) {
      return;
    }

    this.open = true;

    const selectedIndex = this.options.findIndex(
      (option) => option.value === this.value && !option.disabled,
    );

    this.activeIndex =
      selectedIndex >= 0 ? selectedIndex : (this.selectableIndexes[0] ?? -1);

    this.dispatchEvent(
      new CustomEvent("dropdown-open", { bubbles: true, composed: true }),
    );
  }

  closeMenu() {
    if (!this.open) {
      return;
    }

    this.open = false;
    this.activeIndex = -1;

    this.dispatchEvent(
      new CustomEvent("dropdown-close", { bubbles: true, composed: true }),
    );
  }

  private toggleMenu() {
    if (this.open) {
      this.closeMenu();
      return;
    }

    this.openMenu();
  }

  private selectIndex(index: number) {
    const option = this.options[index];

    if (!option || option.disabled) {
      return;
    }

    this.closeMenu();

    if (option.value === this.value) {
      return;
    }

    this.value = option.value;
    this.validate();

    this.dispatchEvent(
      new CustomEvent<DropdownChangeDetail>("dropdown-change", {
        detail: { value: option.value, option },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private moveActive(step: number) {
    const selectable = this.selectableIndexes;

    if (selectable.length === 0) {
      return;
    }

    const current = selectable.indexOf(this.activeIndex);
    const next = current === -1 ? 0 : current + step;
    const clamped = Math.min(Math.max(next, 0), selectable.length - 1);

    this.activeIndex = selectable[clamped]!;
  }

  private runTypeahead(key: string) {
    this.typeahead += key.toLowerCase();

    if (this.typeaheadTimer !== undefined) {
      clearTimeout(this.typeaheadTimer);
    }

    this.typeaheadTimer = setTimeout(() => {
      this.typeahead = "";
    }, 600);

    const match = this.options.findIndex(
      (option) =>
        !option.disabled &&
        option.label.toLowerCase().startsWith(this.typeahead),
    );

    if (match === -1) {
      return;
    }

    if (this.open) {
      this.activeIndex = match;
      return;
    }

    this.selectIndex(match);
  }

  private handleKeydown(event: KeyboardEvent) {
    if (this.disabled) {
      return;
    }

    const { key } = event;

    if (key === "Escape") {
      if (this.open) {
        event.preventDefault();
        this.closeMenu();
      }

      return;
    }

    if (key === "Tab") {
      this.closeMenu();
      return;
    }

    if (key === "ArrowDown" || key === "ArrowUp") {
      event.preventDefault();

      if (!this.open) {
        this.openMenu();
        return;
      }

      this.moveActive(key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (key === "Home" || key === "End") {
      if (!this.open) {
        return;
      }

      event.preventDefault();

      const selectable = this.selectableIndexes;

      this.activeIndex =
        (key === "Home" ? selectable[0] : selectable[selectable.length - 1]) ??
        -1;

      return;
    }

    if (key === "Enter" || key === " ") {
      event.preventDefault();

      if (!this.open) {
        this.openMenu();
        return;
      }

      this.selectIndex(this.activeIndex);
      return;
    }

    if (key.length === 1 && /\S/.test(key)) {
      this.runTypeahead(key);
    }
  }

  private handleReposition = () => {
    this.positionMenu();
  };

  private watchViewport(active: boolean) {
    const method = active ? "addEventListener" : "removeEventListener";

    window[method]("resize", this.handleReposition);
    window[method]("scroll", this.handleReposition, true);
  }

  private positionMenu() {
    const trigger = this.renderRoot.querySelector<HTMLElement>(".trigger");
    const menu = this.renderRoot.querySelector<HTMLElement>(".menu");

    if (!trigger || !menu || !this.open) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 0;
    const viewportWidth = window.innerWidth || 0;
    const gap = 4;

    if (this.compact) {
      menu.style.minWidth = `${rect.width}px`;
    } else {
      menu.style.width = `${rect.width}px`;
    }

    menu.style.maxHeight = "";

    const naturalHeight = menu.offsetHeight;
    const spaceBelow = viewportHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;

    const flip =
      this.placement === "top" ||
      (naturalHeight > spaceBelow && spaceAbove > spaceBelow);

    const room = Math.max(0, flip ? spaceAbove : spaceBelow);

    menu.style.maxHeight = `${room}px`;

    const height = Math.min(naturalHeight, room);

    menu.style.top = flip ? `${rect.top - gap - height}px` : `${rect.bottom + gap}px`;

    const width = menu.offsetWidth || rect.width;
    const overflowRight = rect.left + width - viewportWidth + gap;

    menu.style.left = `${Math.max(gap, rect.left - Math.max(0, overflowRight))}px`;
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has("open")) {
      this.watchViewport(this.open);
    }

    if (!this.open) {
      return;
    }

    this.positionMenu();

    const active = this.renderRoot.querySelector(".option.active");

    active?.scrollIntoView?.({ block: "nearest" });
  }

  private get triggerLabel() {
    const selected = this.selectedOption;

    return selected ? selected.label : this.placeholder;
  }

  private renderOption(option: DropdownOption, index: number) {
    const selected = option.value === this.value;

    return html`
      <li
        id="${this.uid}-option-${index}"
        class="option ${index === this.activeIndex ? "active" : ""}"
        role="option"
        aria-selected=${selected ? "true" : "false"}
        aria-disabled=${option.disabled ? "true" : nothing}
        @click=${() => this.selectIndex(index)}
        @pointermove=${() => {
          if (!option.disabled) {
            this.activeIndex = index;
          }
        }}
      >
        <svg
          class="check ${selected ? "" : "hidden"}"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m5 13 4 4L19 7" />
        </svg>

        <span class="option-body">
          <span>${option.label}</span>
          ${option.description
            ? html`<span class="option-description">${option.description}</span>`
            : nothing}
        </span>
      </li>
    `;
  }

  render() {
    const message = this.validationMessage;
    const isInvalid = this.invalid || Boolean(message);
    const listboxId = `${this.uid}-listbox`;
    const hasSelection = this.selectedOption !== null;

    return html`
      <div class="field">
        ${this.compact
          ? nothing
          : html`
              <span class="label" id="${this.uid}-label">
                ${this.label}
                ${this.required
                  ? html`<span class="required-mark">*</span>`
                  : nothing}
              </span>
            `}

        <div class="anchor">
          <button
            type="button"
            class="trigger ${isInvalid ? "invalid" : ""}"
            ?disabled=${this.disabled}
            aria-haspopup="listbox"
            aria-expanded=${this.open ? "true" : "false"}
            aria-controls=${listboxId}
            aria-label=${this.compact && this.label ? this.label : nothing}
            aria-labelledby=${this.compact || !this.label
              ? nothing
              : `${this.uid}-label`}
            aria-invalid=${isInvalid ? "true" : "false"}
            aria-activedescendant=${this.open && this.activeIndex >= 0
              ? `${this.uid}-option-${this.activeIndex}`
              : nothing}
            @click=${this.toggleMenu}
            @keydown=${this.handleKeydown}
          >
            <span class="trigger-text ${hasSelection ? "" : "placeholder"}">
              ${this.triggerLabel}
            </span>

            <svg
              class="chevron"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <ul
            class="menu"
            id=${listboxId}
            role="listbox"
            aria-label=${this.label || this.placeholder}
            style="--dropdown-max-visible: ${this.maxVisible}"
            ?hidden=${!this.open}
          >
            ${this.options.length === 0
              ? html`<li class="empty">No options</li>`
              : this.options.map((option, index) =>
                  this.renderOption(option, index),
                )}
          </ul>
        </div>

        ${this.compact
          ? nothing
          : html`<div class="error-message" role="alert">${message}</div>`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-dropdown": UiDropdown;
  }
}
