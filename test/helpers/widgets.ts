import { html } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";

import {
  clearWidgets,
  listWidgets,
  registerWidgets,
  type WidgetDefinition,
} from "../../src/widgets/widget-registry.ts";

function defineStubElement(tagName: string) {
  if (customElements.get(tagName)) {
    return;
  }

  customElements.define(
    tagName,
    class extends HTMLElement {
      connectedCallback() {
        this.setAttribute("data-stub", tagName);
      }
    },
  );
}

export function makeWidget(
  id: string,
  overrides: Partial<WidgetDefinition> = {},
): WidgetDefinition {
  const tagName = `stub-widget-${id}`;

  defineStubElement(tagName);

  const tag = unsafeStatic(tagName);

  return {
    id,
    title: `${id[0]?.toUpperCase() ?? ""}${id.slice(1)}`,
    description: `The ${id} widget.`,
    icon: html`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /></svg>`,
    render: () => staticHtml`<${tag}></${tag}>`,
    ...overrides,
  };
}

export function useWidgets(definitions: readonly WidgetDefinition[]) {
  let snapshot: WidgetDefinition[] = [];

  beforeEach(() => {
    snapshot = listWidgets();

    clearWidgets();
    registerWidgets(definitions);
  });

  afterEach(() => {
    clearWidgets();
    registerWidgets(snapshot);
  });
}
