import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import "./employee-form.ts";
import "./employee-details.ts";

import type { Employee } from "./components/employee-table.ts";

@customElement("employee-page")
export class EmployeePage extends LitElement {
  @state()
  private employees: Employee[] = [];

  static styles = css`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      box-sizing: border-box;

      background: #f8fafc;
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

    .page {
      width: 100%;
      min-height: 100vh;
      padding: 32px;
    }

    .page-container {
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* =========================
       Page Header
       ========================= */

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 20px;
      margin-bottom: 24px;
    }

    .page-title {
      min-width: 0;
    }

    h1 {
      margin: 0;

      color: #111827;

      font-size: 30px;
      line-height: 1.2;
      font-weight: 700;
    }

    .page-description {
      margin: 8px 0 0;

      color: #6b7280;

      font-size: 15px;
      line-height: 1.5;
    }

    /* =========================
       Content
       ========================= */

    .page-content {
      display: flex;
      flex-direction: column;

      width: 100%;
      gap: 24px;
    }

    employee-form,
    employee-details {
      display: block;
      width: 100%;
    }

    /* =========================
       Tablet
       ========================= */

    @media (max-width: 900px) {
      .page {
        padding: 24px;
      }

      .page-header {
        margin-bottom: 20px;
      }

      .page-content {
        gap: 20px;
      }

      h1 {
        font-size: 26px;
      }
    }

    /* =========================
       Mobile
       ========================= */

    @media (max-width: 600px) {
      .page {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;

        gap: 8px;
        margin-bottom: 16px;
      }

      .page-content {
        gap: 16px;
      }

      h1 {
        font-size: 23px;
      }

      .page-description {
        margin-top: 5px;
        font-size: 14px;
      }
    }

    /* =========================
       Small phones
       ========================= */

    @media (max-width: 380px) {
      .page {
        padding: 10px;
      }

      .page-content {
        gap: 12px;
      }

      h1 {
        font-size: 21px;
      }

      .page-description {
        font-size: 13px;
      }
    }
  `;

  private handleEmployeeAdded(event: CustomEvent<Employee>) {
    this.employees = [...this.employees, event.detail];
  }

  render() {
    return html`
      <main class="page">
        <div class="page-container">
          <header class="page-header">
            <div class="page-title">
              <h1>Employees</h1>

              <p class="page-description">Add and manage your employees.</p>
            </div>
          </header>

          <section class="page-content">
            <employee-form
              @employee-added=${this.handleEmployeeAdded}
            ></employee-form>

            <employee-details .employees=${this.employees}></employee-details>
          </section>
        </div>
      </main>
    `;
  }
}
