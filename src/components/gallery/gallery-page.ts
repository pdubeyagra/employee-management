import { LitElement, css, html, nothing, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import { generateThemeCSSVariables } from "../../theme/colors.js";
import {
  LAYOUT_CONFIG,
  generateLayoutCSSVariables,
} from "../../theme/layout.js";

/**
 * The page frame every component gallery widget sits in: a heading, the
 * address it answers on, and a column for the demo cards.
 */
@customElement("gallery-page")
export class GalleryPage extends LitElement {
  @property()
  heading = "";

  @property()
  description = "";

  /** Shown as a chip, so the page states the address it is reachable at. */
  @property()
  address = "";

  static styles = css`
    :host {
      display: block;
      width: 100%;
      min-height: 100%;
      min-width: 0;
      box-sizing: border-box;
      ${unsafeCSS(generateThemeCSSVariables())}
      ${unsafeCSS(generateLayoutCSSVariables())}
      background: var(--color-background-secondary);
      color: var(--color-text-primary);
      font-family: ${unsafeCSS(LAYOUT_CONFIG.fontFamily)};
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .page {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2xl);

      width: 100%;
      max-width: 1000px;

      margin: 0 auto;

      padding: clamp(var(--spacing-xl), 4vw, var(--spacing-3xl));
    }

    .page-header {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .heading-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--spacing-md);
    }

    .heading {
      margin: 0;

      font-size: clamp(var(--font-size-xl), 4vw, var(--font-size-3xl));
      line-height: var(--line-height-tight);
      font-weight: 700;
    }

    .address {
      padding: var(--spacing-xs) var(--spacing-md);

      border-radius: var(--radius-full);

      background: var(--color-primary-light);
      color: var(--color-primary);

      font-family: ui-monospace, "SFMono-Regular", "Consolas", monospace;
      font-size: var(--font-size-xs);
      font-weight: 600;
    }

    .description {
      margin: 0;

      max-width: 70ch;

      color: var(--color-text-tertiary);

      font-size: var(--font-size-md);
      line-height: var(--line-height-relaxed);
    }

    .sections {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xl);
    }
  `;

  render() {
    return html`
      <div class="page">
        <header class="page-header">
          <div class="heading-row">
            <h1 class="heading">${this.heading}</h1>

            ${this.address
              ? html`<span class="address">${this.address}</span>`
              : nothing}
          </div>

          ${this.description
            ? html`<p class="description">${this.description}</p>`
            : nothing}
        </header>

        <div class="sections"><slot></slot></div>
      </div>
    `;
  }
}
