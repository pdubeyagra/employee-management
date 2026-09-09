import { LitElement, css, html, nothing, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import { generateThemeCSSVariables } from "../../theme/colors.js";
import {
  LAYOUT_CONFIG,
  generateLayoutCSSVariables,
} from "../../theme/layout.js";

export type GalleryDemoLayout = "row" | "stack";

@customElement("gallery-demo")
export class GalleryDemo extends LitElement {
  @property()
  label = "";

  @property()
  hint = "";

  @property()
  code = "";

  @property({ type: String })
  layout: GalleryDemoLayout = "row";

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

    .demo {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);

      width: 100%;
      min-width: 0;

      padding: var(--spacing-xl);

      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);

      background: var(--color-background);
      box-shadow: var(--shadow-sm);
    }

    .demo-label {
      margin: 0;

      font-size: var(--font-size-lg);
      font-weight: 600;
    }

    .demo-hint {
      margin: var(--spacing-xs) 0 0;

      color: var(--color-text-tertiary);

      font-size: var(--font-size-sm);
      line-height: var(--line-height-relaxed);
    }

    .demo-examples {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--spacing-md);

      min-width: 0;
    }

    :host([layout="stack"]) .demo-examples {
      flex-direction: column;
      align-items: stretch;
    }

    .demo-code {
      margin: 0;

      padding: var(--spacing-md) var(--spacing-lg);

      border-radius: var(--radius-md);

      background: var(--color-background-secondary);
      color: var(--color-text-secondary);

      font-family: ui-monospace, "SFMono-Regular", "Consolas", monospace;
      font-size: var(--font-size-xs);
      line-height: var(--line-height-loose);

      overflow-x: auto;
      white-space: pre;
    }
  `;

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("layout")) {
      this.setAttribute("layout", this.layout);
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.setAttribute("layout", this.layout);
  }

  render() {
    return html`
      <section class="demo">
        <header>
          <h2 class="demo-label">${this.label}</h2>

          ${this.hint ? html`<p class="demo-hint">${this.hint}</p>` : nothing}
        </header>

        <div class="demo-examples"><slot></slot></div>

        ${this.code
          ? html`<pre class="demo-code"><code>${this.code}</code></pre>`
          : nothing}
      </section>
    `;
  }
}
