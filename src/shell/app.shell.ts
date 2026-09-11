import { LitElement, css, html, unsafeCSS, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

import "@/features/employee/index.ts";

import { generateThemeCSSVariables } from "@/theme/colors.js";
import { LAYOUT_CONFIG, generateLayoutCSSVariables } from "@/theme/layout.js";

@customElement("app-shell")
export class AppShell extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100svh;
      ${unsafeCSS(generateThemeCSSVariables())}
      ${unsafeCSS(generateLayoutCSSVariables())}
      background: var(--color-background-secondary);
      color: var(--color-text-primary);
      font-family: ${unsafeCSS(LAYOUT_CONFIG.fontFamily)};
      font-size: var(--font-size-base);
      line-height: var(--line-height-relaxed);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .nav {
      position: sticky;
      top: 0;
      z-index: var(--z-sticky);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-lg);
      padding: var(--spacing-md)
        clamp(var(--spacing-lg), 5vw, var(--spacing-3xl));
      border-bottom: 1px solid var(--color-border);
      background: var(--color-background);
      box-shadow: var(--shadow-sm);
    }

    .nav-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-lg);
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      min-width: 0;
    }

    .brand-mark {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      background: var(--color-primary);
      color: var(--color-text-inverse);
      font-size: var(--font-size-sm);
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .brand-name {
      overflow: hidden;
      color: var(--color-text-primary);
      font-size: var(--font-size-lg);
      font-weight: 700;
      line-height: var(--line-height-tight);
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .tagline {
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-tight);
      white-space: nowrap;
    }

    main {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      min-height: 0;
      width: 100%;
    }

    employee-widget {
      display: block;
      flex: 1 1 auto;
      min-height: 0;
      width: 100%;
    }

    @media (max-width: ${unsafeCSS(LAYOUT_CONFIG.breakpoints.sm)}px) {
      .tagline {
        display: none;
      }
    }
  `;

  private get navTemplate(): TemplateResult {
    return html`
      <header class="nav">
        <div class="nav-container">
          <div class="brand">
            <span class="brand-mark" aria-hidden="true">EM</span>
            <span class="brand-name">Employee Management</span>
          </div>

          <span class="tagline">Manage your organization employees.</span>
        </div>
      </header>
    `;
  }

  private get template(): TemplateResult {
    return html`
      ${this.navTemplate}

      <main>
        <employee-widget></employee-widget>
      </main>
    `;
  }

  render() {
    return this.template;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-shell": AppShell;
  }
}
