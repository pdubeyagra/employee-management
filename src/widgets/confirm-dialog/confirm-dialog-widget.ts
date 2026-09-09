import { LitElement, css, html, unsafeCSS, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";

import "../../components/ui/ui-button.ts";
import "../../components/shared/confirm-dialog.ts";
import "../../components/gallery/gallery-page.ts";
import "../../components/gallery/gallery-demo.ts";
import "../../components/gallery/gallery-log.ts";

import type { ButtonVariant } from "../../components/ui/ui-button.ts";
import type { WidgetDefinition } from "../widget-registry.ts";
import { generateThemeCSSVariables } from "../../theme/colors.js";
import {
  LAYOUT_CONFIG,
  generateLayoutCSSVariables,
} from "../../theme/layout.js";

interface ConfirmScenario {
  key: string;
  trigger: string;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  confirmVariant: ButtonVariant;
}

const SCENARIOS: ConfirmScenario[] = [
  {
    key: "delete",
    trigger: "Delete something",
    title: "Delete employee",
    message:
      "Are you sure you want to delete Ada Lovelace? This action cannot be undone.",
    confirmText: "Delete",
    cancelText: "Cancel",
    confirmVariant: "danger",
  },
  {
    key: "publish",
    trigger: "Publish something",
    title: "Publish changes",
    message: "Your changes will be visible to everyone in the organisation.",
    confirmText: "Publish",
    cancelText: "Not yet",
    confirmVariant: "success",
  },
  {
    key: "leave",
    trigger: "Leave with unsaved work",
    title: "Discard your edits?",
    message: "You have unsaved changes. Leaving now will lose them.",
    confirmText: "Discard",
    cancelText: "Keep editing",
    confirmVariant: "primary",
  },
];

const MAX_LOG_ENTRIES = 6;

@customElement("confirm-dialog-widget")
export class ConfirmDialogWidget extends LitElement {
  /** Null means no dialog is open; confirm-dialog is driven off this. */
  @state()
  private activeScenario: ConfirmScenario | null = null;

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
  `;

  private record(entry: string) {
    this.log = [entry, ...this.log.slice(0, MAX_LOG_ENTRIES - 1)];
  }

  private openScenario(scenario: ConfirmScenario) {
    this.activeScenario = scenario;
  }

  private handleConfirm(event: Event) {
    event.stopPropagation();

    this.record(`confirm from "${this.activeScenario?.key ?? "unknown"}"`);
    this.activeScenario = null;
  }

  private handleCancel(event: Event) {
    event.stopPropagation();

    this.record(`cancel from "${this.activeScenario?.key ?? "unknown"}"`);
    this.activeScenario = null;
  }

  private handleButtonClick(event: Event) {
    event.stopPropagation();
  }

  private get scenariosTemplate(): TemplateResult {
    return html`
      <gallery-demo
        label="Scenarios"
        hint="One confirm-dialog instance, driven by whichever scenario is active."
        code=${'<confirm-dialog\n  .open=${this.target !== null}\n  title="Delete employee"\n  .message=${this.message}\n  confirmText="Delete"\n  confirm-variant="danger"\n  @confirm=${this.handleConfirm}\n  @cancel=${this.handleCancel}\n></confirm-dialog>'}
      >
        ${SCENARIOS.map(
          (scenario) => html`
            <ui-button
              .variant=${scenario.confirmVariant}
              size="medium"
              type="button"
              @button-click=${() => this.openScenario(scenario)}
            >
              ${scenario.trigger}
            </ui-button>
          `,
        )}
      </gallery-demo>
    `;
  }

  private get eventsTemplate(): TemplateResult {
    return html`
      <gallery-demo
        label="Events"
        layout="stack"
        hint="confirm and cancel are dispatched without bubbles or composed, so they must be bound on the confirm-dialog element itself. Closing the dialog any other way (close button or overlay) also reports cancel."
        code=${"@confirm=${this.handleConfirm}\n@cancel=${this.handleCancel}"}
      >
        <gallery-log
          .entries=${this.log}
          emptyMessage="No decisions yet. Open one of the confirmations above."
        ></gallery-log>
      </gallery-demo>
    `;
  }

  private get ownershipTemplate(): TemplateResult {
    return html`
      <gallery-demo
        label="Who owns the open state"
        layout="stack"
        hint="confirm-dialog never closes itself. It reports the choice and the owner clears its own state, which is what lets you keep the dialog open while an async delete is still running."
        code=${"private handleConfirm() {\n  this.record(...);\n  this.activeScenario = null;\n}"}
      ></gallery-demo>
    `;
  }

  private get confirmDialogTemplate(): TemplateResult {
    const scenario = this.activeScenario;

    return html`
      <confirm-dialog
        .open=${scenario !== null}
        .title=${scenario?.title ?? "Confirm"}
        .message=${scenario?.message ?? "Are you sure?"}
        .confirmText=${scenario?.confirmText ?? "Confirm"}
        .cancelText=${scenario?.cancelText ?? "Cancel"}
        .confirmVariant=${scenario?.confirmVariant ?? "danger"}
        @confirm=${this.handleConfirm}
        @cancel=${this.handleCancel}
      ></confirm-dialog>
    `;
  }

  render() {
    return html`
      <gallery-page
        heading="Confirm dialog"
        address="app://confirm-dialog"
        description="confirm-dialog wraps ui-dialog and two ui-buttons into a yes/no prompt. Reach for it instead of ui-dialog whenever the dialog only asks a question."
        @button-click=${this.handleButtonClick}
      >
        ${this.scenariosTemplate} ${this.eventsTemplate}
        ${this.ownershipTemplate}
      </gallery-page>

      ${this.confirmDialogTemplate}
    `;
  }
}

export const confirmDialogWidgetDefinition: WidgetDefinition = {
  id: "confirm-dialog",
  title: "Confirm dialog",
  description: "The yes/no prompt built on ui-dialog, and how to drive it.",
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
      <path d="m8 13 2.5 2.5L16 10" />
    </svg>
  `,
  render: () => html`<confirm-dialog-widget></confirm-dialog-widget>`,
};
