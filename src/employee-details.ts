import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./components/employee-table.ts";

import type { Employee } from "./components/employee-table.ts";

@customElement("employee-details")
export class EmployeeDetails extends LitElement {
  @property({ type: Array })
  employees: Employee[] = [];

  static styles = css`
    :host {
      display: block;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;

      color: #1f2937;

      font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .details-container {
      width: 100%;
    }
  `;

  render() {
    return html`
      <div class="details-container">
        <employee-table .employees=${this.employees}></employee-table>
      </div>
    `;
  }
}
