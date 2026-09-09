import { LitElement, css, html, unsafeCSS, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";

import "../../components/ui/ui-button.ts";
import "../../components/ui/ui-dialog.ts";
import "../../components/gallery/gallery-page.ts";
import "../../components/gallery/gallery-demo.ts";
import "../../components/gallery/gallery-log.ts";

import type { DialogRole, DialogSize } from "../../components/ui/ui-dialog.ts";
import type { WidgetDefinition } from "../widget-registry.ts";
import { generateThemeCSSVariables } from "../../theme/colors.js";
import {
  LAYOUT_CONFIG,
  generateLayoutCSSVariables,
} from "../../theme/layout.js";

const SIZES: DialogSize[] = ["small", "medium", "large"];

const MAX_LOG_ENTRIES = 6;

@customElement("dialog-widget")
export class DialogWidget extends LitElement {
  @state()
  private open = false;

  @state()
  private size: DialogSize = "medium";

  @state()
  private dialogRole: DialogRole = "dialog";

  @state()
  private hideClose = false;

  @state()
  private disableOverlayClose = false;

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

    .toggle {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm, 8px);

      font-size: 14px;
      cursor: pointer;
    }

    .dialog-body-text {
      margin: 0;

      color: var(--color-text-secondary, #374151);

      font-size: 14px;
      line-height: 1.5;
    }

    .dialog-footer-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  `;

  private record(entry: string) {
    this.log = [entry, ...this.log.slice(0, MAX_LOG_ENTRIES - 1)];
  }

  private openWith(size: DialogSize) {
    this.size = size;
    this.open = true;

    this.record(`opened at size "${size}"`);
  }

  /**
   * ui-dialog reports the user's intent to close but does not close itself,
   * so the owner keeps the open flag. That is what makes "are you sure?"
   * interception possible.
   */
  private handleDialogClose(event: Event) {
    event.stopPropagation();

    this.open = false;

    this.record("dialog-close");
  }

  private handleButtonClick(event: Event) {
    event.stopPropagation();
  }

  private toggle(field: "hideClose" | "disableOverlayClose", event: Event) {
    this[field] = (event.target as HTMLInputElement).checked;
  }

  private get sizesTemplate(): TemplateResult {
    return html`
      <gallery-demo
        label="Sizes"
        hint="Sets the maximum width of the dialog."
        code=${'<ui-dialog .open=${this.open} size="large">'}
      >
        ${SIZES.map(
          (size) => html`
            <ui-button
              variant="primary"
              size="medium"
              type="button"
              @button-click=${() => this.openWith(size)}
            >
              Open ${size}
            </ui-button>
          `,
        )}
      </gallery-demo>
    `;
  }

  private get optionsTemplate(): TemplateResult {
    return html`
      <gallery-demo
        label="Options"
        hint="Change these, then reopen the dialog to see the effect."
        code=${"<ui-dialog hide-close disable-overlay-close dialog-role=\"alertdialog\">"}
      >
        <label class="toggle">
          <input
            type="checkbox"
            .checked=${this.hideClose}
            @change=${(event: Event) => this.toggle("hideClose", event)}
          />
          hide-close
        </label>

        <label class="toggle">
          <input
            type="checkbox"
            .checked=${this.disableOverlayClose}
            @change=${(event: Event) =>
              this.toggle("disableOverlayClose", event)}
          />
          disable-overlay-close
        </label>

        <label class="toggle">
          <input
            type="checkbox"
            .checked=${this.dialogRole === "alertdialog"}
            @change=${(event: Event) => {
              this.dialogRole = (event.target as HTMLInputElement).checked
                ? "alertdialog"
                : "dialog";
            }}
          />
          alertdialog role
        </label>
      </gallery-demo>
    `;
  }

  private get eventsTemplate(): TemplateResult {
    return html`
      <gallery-demo
        label="Events"
        layout="stack"
        hint="dialog-close fires for the close button and for an overlay click (unless disable-overlay-close is set). There is no Escape handler. It does not bubble, so bind it on the element itself."
        code=${"<ui-dialog @dialog-close=${() => (this.open = false)}>"}
      >
        <gallery-log
          .entries=${this.log}
          emptyMessage="No dialog activity yet. Open one above."
        ></gallery-log>
      </gallery-demo>
    `;
  }

  private get dialogTemplate(): TemplateResult {
    return html`
      <ui-dialog
        .open=${this.open}
        .size=${this.size}
        .dialogRole=${this.dialogRole}
        .hideClose=${this.hideClose}
        .disableOverlayClose=${this.disableOverlayClose}
        heading="Dialog example"
        @dialog-close=${this.handleDialogClose}
      >
        <p class="dialog-body-text">
          Anything in the default slot becomes the dialog body. This one is
          size "${this.size}" with the "${this.dialogRole}" role.
        </p>

        <div class="dialog-footer-actions" slot="footer">
          <ui-button
            variant="secondary"
            size="medium"
            type="button"
            @button-click=${() => {
              this.open = false;
              this.record("closed from the footer");
            }}
          >
            Close
          </ui-button>
        </div>
      </ui-dialog>
    `;
  }

  render() {
    return html`
      <gallery-page
        heading="Dialog"
        address="app://dialog"
        description="ui-dialog is the bare modal: a heading, a body slot and a footer slot. You own the open state, so the dialog can never close behind your back."
        @button-click=${this.handleButtonClick}
      >
        ${this.sizesTemplate} ${this.optionsTemplate} ${this.eventsTemplate}
      </gallery-page>

      ${this.dialogTemplate}
    `;
  }
}

export const dialogWidgetDefinition: WidgetDefinition = {
  id: "dialog",
  title: "Dialog",
  description: "The ui-dialog modal, its slots, sizes and close behaviour.",
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
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path d="M8 6.5h.01" />
    </svg>
  `,
  render: () => html`<dialog-widget></dialog-widget>`,
};
