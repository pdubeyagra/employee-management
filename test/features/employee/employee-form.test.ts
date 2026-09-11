import { expect } from "chai";

import "@/features/employee/components/employee-form.ts";
import type { EmployeeForm } from "@/features/employee/components/employee-form.ts";
import type { UiInput } from "@/components/ui/ui-input.ts";
import type { UiSelect } from "@/components/ui/ui-select.ts";
import type { UiButton } from "@/components/ui/ui-button.ts";
import type { AppToast } from "@/components/shared/toast.ts";
import type { Employee, NewEmployee } from "@/features/employee/employee-types.ts";
import { FIELD_MAX_LENGTHS } from "@/features/employee/employee-validation.ts";
import {
  DEPARTMENTS,
  DESIGNATIONS,
} from "@/features/employee/employee-options.ts";
import { makeEmployee } from "../../helpers/employees.ts";
import {
  click,
  mount,
  query,
  queryAll,
  queryRequired,
  recordEvents,
  text,
  typeInto,
  update,
} from "../../helpers/dom.ts";

const FIELD_ORDER = ["name", "department", "designation", "email"] as const;

type FieldName = (typeof FIELD_ORDER)[number];

/** Department and designation are dropdowns; the rest are text inputs. */
const SELECT_FIELDS = ["department", "designation"] as const;

const FIELD_LABELS: Record<FieldName, string> = {
  name: "Name",
  department: "Department",
  designation: "Designation",
  email: "Email",
};

const isSelectField = (field: FieldName) =>
  (SELECT_FIELDS as readonly string[]).includes(field);

/*
 * The public surface a test reads off a field, whichever element backs it.
 * A plain `UiInput & UiSelect` collapses to `never`, because both classes
 * declare a private `selfError`.
 */
type FormField = Element &
  Pick<
    UiInput,
    | "label"
    | "value"
    | "error"
    | "invalid"
    | "required"
    | "maxlength"
    | "type"
    | "inputmode"
    | "autocomplete"
  > &
  Pick<UiSelect, "options">;

function fieldOf(form: EmployeeForm, field: FieldName): FormField {
  const tag = isSelectField(field) ? "ui-select" : "ui-input";

  return queryRequired<FormField>(
    form,
    `${tag}[label="${FIELD_LABELS[field]}"]`,
  );
}

const fields = (form: EmployeeForm) =>
  Object.fromEntries(
    FIELD_ORDER.map((field) => [field, fieldOf(form, field)]),
  ) as Record<FieldName, FormField>;

const controlOf = (form: EmployeeForm, field: FieldName) =>
  queryRequired<HTMLElement>(
    fieldOf(form, field),
    isSelectField(field) ? "select" : "input",
  );

function fill(form: EmployeeForm, field: FieldName, value: string) {
  const control = controlOf(form, field);

  if (isSelectField(field)) {
    (control as HTMLSelectElement).value = value;

    control.dispatchEvent(
      new Event("change", { bubbles: true, composed: true }),
    );

    return;
  }

  typeInto(control as HTMLInputElement, value);
}

function blur(form: EmployeeForm, field: FieldName) {
  controlOf(form, field).dispatchEvent(new FocusEvent("blur"));
}

async function fillAll(
  form: EmployeeForm,
  values: Partial<Record<FieldName, string>>,
) {
  for (const [field, value] of Object.entries(values)) {
    fill(form, field as FieldName, value);
  }

  await form.updateComplete;
}

const actionButtons = (form: EmployeeForm) =>
  queryAll<UiButton>(form, ".actions ui-button");

const submitButton = (form: EmployeeForm) => actionButtons(form)[0]!;
const secondaryButton = (form: EmployeeForm) => actionButtons(form)[1]!;

function pressButton(button: UiButton) {
  click(queryRequired<HTMLButtonElement>(button, "button"));
}

const errorOf = (form: EmployeeForm, field: FieldName) =>
  fields(form)[field].error;

const valueOf = (form: EmployeeForm, field: FieldName) =>
  fields(form)[field].value;

const toastOf = (form: EmployeeForm) =>
  queryRequired<AppToast>(form, "app-toast");

const VALID = {
  name: "Ada Lovelace",
  department: "Engineering",
  designation: "Principal Engineer",
  email: "ada@example.com",
} as const;

describe("<employee-form>", () => {
  describe("rendering", () => {
    it("renders the four required fields with their labels", async () => {
      const form = await mount<EmployeeForm>("employee-form");
      const controls = queryAll<UiInput | UiSelect>(
        form,
        "ui-input, ui-select",
      );

      expect(controls.map((control) => control.label)).to.deep.equal([
        "Name",
        "Department",
        "Designation",
        "Email",
      ]);
      expect(controls.every((control) => control.required)).to.equal(true);
    });

    it("uses dropdowns for department and designation, text for the rest", async () => {
      const form = await mount<EmployeeForm>("employee-form");

      expect(
        queryAll<UiSelect>(form, "ui-select").map((select) => select.label),
      ).to.deep.equal(["Department", "Designation"]);
      expect(
        queryAll<UiInput>(form, "ui-input").map((input) => input.label),
      ).to.deep.equal(["Name", "Email"]);
    });

    it("offers the department and designation lists", async () => {
      const form = await mount<EmployeeForm>("employee-form");

      expect(
        fieldOf(form, "department").options.map((option) => option.value),
      ).to.deep.equal([...DEPARTMENTS]);
      expect(
        fieldOf(form, "designation").options.map((option) => option.value),
      ).to.deep.equal([...DESIGNATIONS]);
    });

    it("configures the email field for email entry", async () => {
      const form = await mount<EmployeeForm>("employee-form");
      const email = fields(form).email;

      expect(email.type).to.equal("email");
      expect(email.inputmode).to.equal("email");
    });

    it("does not autofill the email field", async () => {
      const form = await mount<EmployeeForm>("employee-form");
      expect(fields(form).email.autocomplete).to.equal("off");
    });

    it("caps every typed field at the length the validator enforces", async () => {
      const form = await mount<EmployeeForm>("employee-form");
      const typedFields = FIELD_ORDER.filter((field) => !isSelectField(field));

      for (const field of typedFields) {
        expect(fields(form)[field].maxlength, field).to.equal(
          FIELD_MAX_LENGTHS[field],
        );
        expect(
          queryRequired<HTMLInputElement>(
            fields(form)[field],
            "input",
          ).getAttribute("maxlength"),
          field,
        ).to.equal(String(FIELD_MAX_LENGTHS[field]));
      }
    });

    it("starts empty with no errors showing", async () => {
      const form = await mount<EmployeeForm>("employee-form");

      for (const field of FIELD_ORDER) {
        expect(valueOf(form, field), field).to.equal("");
        expect(errorOf(form, field), field).to.equal("");
        expect(fields(form)[field].invalid, field).to.equal(false);
      }
    });

    it("skips the browser's own validation so its messages are the only ones", async () => {
      const form = await mount<EmployeeForm>("employee-form");

      expect(
        queryRequired<HTMLFormElement>(form, ".employee-form").hasAttribute(
          "novalidate",
        ),
      ).to.equal(true);
    });

    it("labels its actions for adding", async () => {
      const form = await mount<EmployeeForm>("employee-form");

      expect(text(submitButton(form))).to.equal("Save");
      expect(text(secondaryButton(form))).to.equal("Clear");
    });

    it("labels its actions for editing", async () => {
      const form = await mount<EmployeeForm>("employee-form", {
        employeeToEdit: makeEmployee(),
      });

      expect(text(submitButton(form))).to.equal("Update Employee");
      expect(text(secondaryButton(form))).to.equal("Cancel");
    });
  });

  describe("live validation", () => {
    it("clears a field's error as soon as it becomes valid", async () => {
      const form = await mount<EmployeeForm>("employee-form");

      await fillAll(form, { name: "" });
      blur(form, "name");
      await form.updateComplete;

      expect(errorOf(form, "name")).to.equal("Name is required.");

      await fillAll(form, { name: "Ada" });

      expect(errorOf(form, "name")).to.equal("");
      expect(fields(form).name.invalid).to.equal(false);
    });

    it("reports a bad email while it is being typed", async () => {
      const form = await mount<EmployeeForm>("employee-form");

      await fillAll(form, { email: "ada@" });

      expect(errorOf(form, "email")).to.equal(
        "Please enter a valid email address.",
      );
      expect(fields(form).email.invalid).to.equal(true);
    });

    it("validates a field on blur without touching the others", async () => {
      const form = await mount<EmployeeForm>("employee-form");

      blur(form, "department");
      await form.updateComplete;

      expect(errorOf(form, "department")).to.equal("Department is required.");
      expect(errorOf(form, "name")).to.equal("");
      expect(errorOf(form, "email")).to.equal("");
    });
  });

  describe("adding an employee", () => {
    it("refuses to submit an empty form and flags every field", async () => {
      const form = await mount<EmployeeForm>("employee-form");
      const added = recordEvents(form, "employee-added");

      pressButton(submitButton(form));
      await form.updateComplete;

      expect(added).to.have.lengthOf(0);
      expect(FIELD_ORDER.map((field) => errorOf(form, field))).to.deep.equal([
        "Name is required.",
        "Department is required.",
        "Designation is required.",
        "Email is required.",
      ]);
    });

    it("shows an error toast when submission is rejected", async () => {
      const form = await mount<EmployeeForm>("employee-form");

      pressButton(submitButton(form));
      await form.updateComplete;

      const toast = toastOf(form);

      expect(toast.open).to.equal(true);
      expect(toast.variant).to.equal("error");
      expect(toast.message).to.equal("Please fix the errors in the form.");
    });

    it("refuses to submit when only the email is malformed", async () => {
      const form = await mount<EmployeeForm>("employee-form");
      const added = recordEvents(form, "employee-added");

      await fillAll(form, { ...VALID, email: "nope" });
      pressButton(submitButton(form));
      await form.updateComplete;

      expect(added).to.have.lengthOf(0);
      expect(errorOf(form, "email")).to.equal(
        "Please enter a valid email address.",
      );
    });

    it("emits employee-added with the trimmed values and no id", async () => {
      const form = await mount<EmployeeForm>("employee-form");
      const added = recordEvents<NewEmployee>(form, "employee-added");

      await fillAll(form, {
        name: "  Ada Lovelace  ",
        department: "Engineering",
        designation: "Principal Engineer",
        email: "  ada@example.com ",
      });

      pressButton(submitButton(form));
      await form.updateComplete;

      expect(added).to.have.lengthOf(1);
      expect(added[0]!.detail).to.deep.equal(VALID);
      expect(added[0]!.detail).to.not.have.property("id");
      expect(
        added[0]!.composed,
        "employee data must not cross the shadow boundary",
      ).to.equal(false);
    });

    it("resets the fields after a successful add", async () => {
      const form = await mount<EmployeeForm>("employee-form");

      await fillAll(form, VALID);
      pressButton(submitButton(form));
      await form.updateComplete;

      for (const field of FIELD_ORDER) {
        expect(valueOf(form, field), field).to.equal("");
        expect(errorOf(form, field), field).to.equal("");
      }
    });

    it("confirms the add with a success toast", async () => {
      const form = await mount<EmployeeForm>("employee-form");

      await fillAll(form, VALID);
      pressButton(submitButton(form));
      await form.updateComplete;

      expect(toastOf(form).variant).to.equal("success");
      expect(toastOf(form).message).to.equal("Employee added successfully!");
    });

    it("does not announce a cancelled edit when clearing a new form", async () => {
      const form = await mount<EmployeeForm>("employee-form");
      const cancelled = recordEvents(form, "edit-cancelled");

      await fillAll(form, VALID);
      pressButton(submitButton(form));
      await form.updateComplete;

      expect(cancelled).to.have.lengthOf(0);
    });
  });

  describe("editing an employee", () => {
    const existing = makeEmployee({
      id: "employee-1",
      name: "Ada Lovelace",
      department: "Engineering",
      designation: "Principal Engineer",
      email: "ada@example.com",
    });

    it("populates the fields from employeeToEdit", async () => {
      const form = await mount<EmployeeForm>("employee-form", {
        employeeToEdit: existing,
      });

      expect(valueOf(form, "name")).to.equal("Ada Lovelace");
      expect(valueOf(form, "department")).to.equal("Engineering");
      expect(valueOf(form, "designation")).to.equal("Principal Engineer");
      expect(valueOf(form, "email")).to.equal("ada@example.com");
    });

    describe("a stored value the dropdowns no longer offer", () => {
      const legacy = makeEmployee({
        id: "employee-legacy",
        name: "Grace Hopper",
        department: "Skunkworks",
        designation: "Rear Admiral",
        email: "grace@example.com",
      });

      it("stays selected instead of falling back to the placeholder", async () => {
        const form = await mount<EmployeeForm>("employee-form", {
          employeeToEdit: legacy,
        });

        expect(valueOf(form, "department")).to.equal("Skunkworks");
        expect(valueOf(form, "designation")).to.equal("Rear Admiral");
        expect(
          queryRequired<HTMLSelectElement>(
            fieldOf(form, "department"),
            "select",
          ).value,
        ).to.equal("Skunkworks");
      });

      it("is offered alongside the standard list", async () => {
        const form = await mount<EmployeeForm>("employee-form", {
          employeeToEdit: legacy,
        });

        const values = fieldOf(form, "department").options.map(
          (option) => option.value,
        );

        expect(values).to.deep.equal([...DEPARTMENTS, "Skunkworks"]);
      });

      it("survives an edit to an unrelated field", async () => {
        const form = await mount<EmployeeForm>("employee-form", {
          employeeToEdit: legacy,
        });
        const updated = recordEvents<Employee>(form, "employee-updated");

        await fillAll(form, { name: "Grace B. Hopper" });
        pressButton(submitButton(form));
        await form.updateComplete;

        expect(updated).to.have.lengthOf(1);
        expect(updated[0]!.detail).to.deep.equal({
          ...legacy,
          name: "Grace B. Hopper",
        });
      });
    });

    it("emits employee-updated keeping the original id", async () => {
      const form = await mount<EmployeeForm>("employee-form", {
        employeeToEdit: existing,
      });
      const updated = recordEvents<Employee>(form, "employee-updated");

      await fillAll(form, { designation: "VP Engineering" });
      pressButton(submitButton(form));
      await form.updateComplete;

      expect(updated).to.have.lengthOf(1);
      expect(updated[0]!.detail).to.deep.equal({
        ...existing,
        designation: "VP Engineering",
      });
    });

    it("emits employee-updated rather than employee-added", async () => {
      const form = await mount<EmployeeForm>("employee-form", {
        employeeToEdit: existing,
      });
      const added = recordEvents(form, "employee-added");
      const updated = recordEvents(form, "employee-updated");

      pressButton(submitButton(form));
      await form.updateComplete;

      expect(added).to.have.lengthOf(0);
      expect(updated).to.have.lengthOf(1);
    });

    it("announces the edit is over once the update is submitted", async () => {
      const form = await mount<EmployeeForm>("employee-form", {
        employeeToEdit: existing,
      });
      const cancelled = recordEvents(form, "edit-cancelled");

      pressButton(submitButton(form));
      await form.updateComplete;

      expect(cancelled).to.have.lengthOf(1);
      expect(toastOf(form).message).to.equal("Employee updated successfully!");
    });

    it("emits edit-cancelled when Cancel is pressed", async () => {
      const form = await mount<EmployeeForm>("employee-form", {
        employeeToEdit: existing,
      });
      const cancelled = recordEvents(form, "edit-cancelled");

      pressButton(secondaryButton(form));
      await form.updateComplete;

      expect(cancelled).to.have.lengthOf(1);
      expect(valueOf(form, "name")).to.equal("");
    });

    it("keeps unsaved edits when employeeToEdit is re-set to the same record", async () => {
      const form = await mount<EmployeeForm>("employee-form", {
        employeeToEdit: existing,
      });

      await fillAll(form, { name: "Ada L." });

      await update(form, { employeeToEdit: { ...existing } });

      expect(valueOf(form, "name")).to.equal("Ada L.");
    });

    it("repopulates when switched to a different employee", async () => {
      const form = await mount<EmployeeForm>("employee-form", {
        employeeToEdit: existing,
      });

      await fillAll(form, { name: "Ada L." });

      const other = makeEmployee({ id: "employee-2", name: "Grace Hopper" });

      await update(form, { employeeToEdit: other });

      expect(valueOf(form, "name")).to.equal("Grace Hopper");
      expect(valueOf(form, "email")).to.equal(other.email);
    });

    it("clears stale errors when switched to a different employee", async () => {
      const form = await mount<EmployeeForm>("employee-form", {
        employeeToEdit: existing,
      });

      await fillAll(form, { email: "broken" });

      expect(errorOf(form, "email")).to.not.equal("");

      await update(form, {
        employeeToEdit: makeEmployee({ id: "employee-2" }),
      });

      expect(errorOf(form, "email")).to.equal("");
    });

    it("can reopen the same employee after the edit is dismissed", async () => {
      const form = await mount<EmployeeForm>("employee-form", {
        employeeToEdit: existing,
      });

      pressButton(secondaryButton(form));
      await update(form, { employeeToEdit: null });

      expect(valueOf(form, "name")).to.equal("");

      await update(form, { employeeToEdit: existing });

      expect(valueOf(form, "name")).to.equal("Ada Lovelace");
    });
  });

  describe("clearing", () => {
    it("empties the fields and their errors", async () => {
      const form = await mount<EmployeeForm>("employee-form");

      await fillAll(form, { name: "Ada", email: "broken" });

      expect(errorOf(form, "email")).to.not.equal("");

      pressButton(secondaryButton(form));
      await form.updateComplete;

      expect(valueOf(form, "name")).to.equal("");
      expect(errorOf(form, "email")).to.equal("");
    });

    it("does not submit anything", async () => {
      const form = await mount<EmployeeForm>("employee-form");
      const added = recordEvents(form, "employee-added");

      await fillAll(form, VALID);
      pressButton(secondaryButton(form));
      await form.updateComplete;

      expect(added).to.have.lengthOf(0);
    });
  });

  it("renders a toast host that stays closed until something happens", async () => {
    const form = await mount<EmployeeForm>("employee-form");

    expect(query(form, "app-toast")).to.not.equal(null);
    expect(toastOf(form).open).to.equal(false);
  });
});
