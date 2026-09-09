import { LitElement, css, html, unsafeCSS, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";

import "../../components/ui/ui-button.ts";
import "../../components/gallery/gallery-page.ts";
import "../../components/gallery/gallery-demo.ts";
import "../../components/gallery/gallery-log.ts";

import type {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "../../components/ui/ui-button.ts";
import type { WidgetDefinition } from "../widget-registry.ts";
import { generateThemeCSSVariables } from "../../theme/colors.js";
import {
  LAYOUT_CONFIG,
  generateLayoutCSSVariables,
} from "../../theme/layout.js";

const VARIANTS: ButtonVariant[] = [
  "primary",
  "secondary",
  "danger",
  "success",
  "ghost",
];

const SIZES: ButtonSize[] = ["small", "medium", "large"];

const SHAPES: ButtonShape[] = ["rounded", "pill", "square"];

const MAX_LOG_ENTRIES = 6;

/**
 * ui-button sizes its icons with ::slotted(svg), which only matches the
 * assigned element itself -- so the svg carries the slot, never a wrapper.
 */
const pencilIcon = (slot: string) => html`
  <svg
    slot=${slot}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
`;

@customElement("button-widget")
export class ButtonWidget extends LitElement {
  @state()
  private log: string[] = [];

  static styles = css`
    :host {
      display: block;
      width: 100%;
      min-height: 100%;
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

    .full-width-example {
      width: 100%;
      min-width: 0;
    }
  `;

  /**
   * ui-button dispatches button-click with bubbles and composed set, so one
   * listener on the page catches every example -- and stopping it here keeps
   * the widget's noise out of the shell.
   */
  private handleButtonClick(event: Event) {
    event.stopPropagation();

    const label = (event.target as HTMLElement).textContent?.trim() || "icon";

    this.log = [
      `button-click from "${label}"`,
      ...this.log.slice(0, MAX_LOG_ENTRIES - 1),
    ];
  }

  private renderButton(
    label: string,
    options: {
      variant?: ButtonVariant;
      size?: ButtonSize;
      shape?: ButtonShape;
      disabled?: boolean;
      loading?: boolean;
    } = {},
  ): TemplateResult {
    return html`
      <ui-button
        .variant=${options.variant ?? "primary"}
        .size=${options.size ?? "medium"}
        .shape=${options.shape ?? "rounded"}
        ?disabled=${options.disabled ?? false}
        ?loading=${options.loading ?? false}
        type="button"
      >
        ${label}
      </ui-button>
    `;
  }

  private get variantsTemplate(): TemplateResult {
    return html`
      <gallery-demo
        label="Variants"
        hint="The colour role of the button."
        code=${'<ui-button variant="danger">Delete</ui-button>'}
      >
        ${VARIANTS.map((variant) =>
          this.renderButton(variant, { variant }),
        )}
      </gallery-demo>
    `;
  }

  private get sizesTemplate(): TemplateResult {
    return html`
      <gallery-demo
        label="Sizes"
        hint="Sets the height, padding and font size."
        code=${'<ui-button size="large">Continue</ui-button>'}
      >
        ${SIZES.map((size) => this.renderButton(size, { size }))}
      </gallery-demo>
    `;
  }

  private get shapesTemplate(): TemplateResult {
    return html`
      <gallery-demo
        label="Shapes"
        hint="Controls the corner radius."
        code=${'<ui-button shape="pill">Follow</ui-button>'}
      >
        ${SHAPES.map((shape) => this.renderButton(shape, { shape }))}
      </gallery-demo>
    `;
  }

  private get statesTemplate(): TemplateResult {
    return html`
      <gallery-demo
        label="States"
        hint="Both disabled and loading swallow the click, so no event fires."
        code=${"<ui-button ?loading=${this.saving}>Save</ui-button>"}
      >
        ${this.renderButton("Enabled")}
        ${this.renderButton("Disabled", { disabled: true })}
        ${this.renderButton("Loading", { loading: true })}
      </gallery-demo>
    `;
  }

  private get iconsTemplate(): TemplateResult {
    return html`
      <gallery-demo
        label="Icons"
        hint="An icon slot for a leading icon, icon-only for a square button."
        code=${'<ui-button .iconOnly=${true} aria-label="Edit">\n  <svg slot="icon-only">...</svg>\n</ui-button>'}
      >
        <ui-button variant="primary" size="medium" type="button">
          ${pencilIcon("icon")} With icon
        </ui-button>

        <ui-button
          variant="primary"
          size="medium"
          .iconOnly=${true}
          type="button"
          aria-label="Edit"
        >
          ${pencilIcon("icon-only")}
        </ui-button>

        <ui-button
          variant="danger"
          size="small"
          .iconOnly=${true}
          type="button"
          aria-label="Edit in small"
        >
          ${pencilIcon("icon-only")}
        </ui-button>
      </gallery-demo>
    `;
  }

  private get fullWidthTemplate(): TemplateResult {
    return html`
      <gallery-demo
        label="Full width"
        layout="stack"
        hint="Stretches the button to fill its container. ui-button styles this from the full-width attribute, so set the attribute rather than the property."
        code=${'<ui-button full-width>Submit</ui-button>'}
      >
        <ui-button
          class="full-width-example"
          variant="primary"
          size="medium"
          full-width
          type="button"
        >
          Full width
        </ui-button>
      </gallery-demo>
    `;
  }

  private get eventsTemplate(): TemplateResult {
    return html`
      <gallery-demo
        label="Events"
        layout="stack"
        hint="ui-button emits button-click, not click. It bubbles and crosses shadow boundaries."
        code=${"<ui-button @button-click=${this.handleSave}>Save</ui-button>"}
      >
        <gallery-log
          .entries=${this.log}
          emptyMessage="No clicks yet. Press any button on this page."
        ></gallery-log>
      </gallery-demo>
    `;
  }

  render() {
    return html`
      <gallery-page
        heading="Button"
        address="app://button"
        description="ui-button is the shared button. Every example on this page is live, and each click is recorded in the event log at the bottom."
        @button-click=${this.handleButtonClick}
      >
        ${this.variantsTemplate} ${this.sizesTemplate} ${this.shapesTemplate}
        ${this.statesTemplate} ${this.iconsTemplate} ${this.fullWidthTemplate}
        ${this.eventsTemplate}
      </gallery-page>
    `;
  }
}

export const buttonWidgetDefinition: WidgetDefinition = {
  id: "button",
  title: "Button",
  description: "Every variant, size, shape and state of the shared ui-button.",
  icon: html`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="8" width="20" height="8" rx="4" />
      <path d="M13 12h4" />
    </svg>
  `,
  render: () => html`<button-widget></button-widget>`,
};
