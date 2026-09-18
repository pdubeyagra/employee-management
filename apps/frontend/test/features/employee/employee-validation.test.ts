import { expect } from "chai";

import {
  FIELD_MAX_LENGTHS,
  isEmployeeFormValid,
  validateEmployeeField,
  validateEmployeeForm,
} from "@/features/employee/components/employee-form.ts";
import type {
  EmployeeErrors,
  EmployeeField,
  EmployeeFormData,
} from "@/types/employee-types.ts";

const validForm: EmployeeFormData = {
  name: "Ada Lovelace",
  department: "Engineering",
  designation: "Software Engineer",
  email: "ada@example.com",
};

const noErrors: EmployeeErrors = {
  name: "",
  department: "",
  designation: "",
  email: "",
};

describe("validateEmployeeField", () => {
  it("names the field in its required message", () => {
    expect(validateEmployeeField("name", "")).to.equal("Name is required.");
    expect(validateEmployeeField("department", "")).to.equal(
      "Department is required.",
    );
    expect(validateEmployeeField("designation", "")).to.equal(
      "Designation is required.",
    );
    expect(validateEmployeeField("email", "")).to.equal("Email is required.");
  });

  it("treats whitespace-only input as missing", () => {
    expect(validateEmployeeField("name", "   ")).to.equal("Name is required.");
    expect(validateEmployeeField("email", "\t\n ")).to.equal(
      "Email is required.",
    );
  });

  it("accepts any non-empty value for the non-email fields", () => {
    expect(validateEmployeeField("name", "A")).to.equal("");
    expect(validateEmployeeField("department", "R&D")).to.equal("");
    expect(validateEmployeeField("designation", "QA")).to.equal("");
  });

  it("does not apply the email pattern to other fields", () => {
    expect(validateEmployeeField("name", "not-an-email")).to.equal("");
  });

  it("accepts well-formed email addresses", () => {
    const valid = [
      "ada@example.com",
      "ada.lovelace@example.co.uk",
      "ada+work@example.com",
      "ADA@EXAMPLE.COM",
      "a@b.c",
    ];

    for (const email of valid) {
      expect(validateEmployeeField("email", email), email).to.equal("");
    }
  });

  it("rejects malformed email addresses", () => {
    const invalid = [
      "ada",
      "ada@",
      "@example.com",
      "ada@example",
      "ada @example.com",
      "ada@exam ple.com",
      "ada@@example.com",
      "ada@example..com",
      "ada@.com",
      "ada@example.",
    ];

    for (const email of invalid) {
      expect(validateEmployeeField("email", email), email).to.equal(
        "Please enter a valid email address.",
      );
    }
  });

  it("rejects a long non-matching address without stalling", () => {
    const hostile = `a@${"a".repeat(200)}${"!".repeat(40)}`;

    const started = Date.now();
    const error = validateEmployeeField("email", hostile);
    const elapsed = Date.now() - started;

    expect(error).to.not.equal("");
    expect(elapsed, "validation should be effectively instant").to.be.lessThan(
      100,
    );
  });
});

describe("length limits", () => {
  const fields = Object.keys(FIELD_MAX_LENGTHS) as EmployeeField[];

  it("accepts a value of exactly the maximum length", () => {
    for (const field of fields) {
      const atLimit =
        field === "email"
          ? `${"a".repeat(FIELD_MAX_LENGTHS.email - "@example.com".length)}@example.com`
          : "a".repeat(FIELD_MAX_LENGTHS[field]);

      expect(atLimit.length, field).to.equal(FIELD_MAX_LENGTHS[field]);
      expect(validateEmployeeField(field, atLimit), field).to.equal("");
    }
  });

  it("rejects a value one character over the maximum", () => {
    for (const field of fields) {
      const tooLong =
        field === "email"
          ? `${"a".repeat(FIELD_MAX_LENGTHS.email - "@example.com".length + 1)}@example.com`
          : "a".repeat(FIELD_MAX_LENGTHS[field] + 1);

      expect(validateEmployeeField(field, tooLong), field).to.equal(
        `${field[0]!.toUpperCase()}${field.slice(1)} must be ${
          FIELD_MAX_LENGTHS[field]
        } characters or fewer.`,
      );
    }
  });

  it("measures the trimmed value, not the raw one", () => {
    const padded = `  ${"a".repeat(FIELD_MAX_LENGTHS.name)}  `;

    expect(validateEmployeeField("name", padded)).to.equal("");
  });

  it("caps names well below anything that could bloat the DOM", () => {
    expect(FIELD_MAX_LENGTHS.name).to.be.at.most(200);
    expect(FIELD_MAX_LENGTHS.email, "RFC 5321 mailbox limit").to.equal(254);
  });

  it("validates the trimmed email, so surrounding whitespace is forgiven", () => {
    expect(validateEmployeeField("email", "  ada@example.com  ")).to.equal("");
  });
});

describe("validateEmployeeForm", () => {
  it("reports no errors for a fully valid form", () => {
    expect(validateEmployeeForm(validForm)).to.deep.equal(noErrors);
  });

  it("reports every missing field at once", () => {
    expect(
      validateEmployeeForm({
        name: "",
        department: "",
        designation: "",
        email: "",
      }),
    ).to.deep.equal({
      name: "Name is required.",
      department: "Department is required.",
      designation: "Designation is required.",
      email: "Email is required.",
    });
  });

  it("reports only the fields that are actually wrong", () => {
    expect(validateEmployeeForm({ ...validForm, email: "nope" })).to.deep.equal(
      {
        ...noErrors,
        email: "Please enter a valid email address.",
      },
    );
  });

  it("always returns all four keys", () => {
    expect(Object.keys(validateEmployeeForm(validForm))).to.have.members([
      "name",
      "department",
      "designation",
      "email",
    ]);
  });
});

describe("isEmployeeFormValid", () => {
  it("is true when no field carries a message", () => {
    expect(isEmployeeFormValid(noErrors)).to.equal(true);
  });

  it("is false when any single field carries a message", () => {
    for (const field of Object.keys(noErrors) as (keyof EmployeeErrors)[]) {
      expect(
        isEmployeeFormValid({ ...noErrors, [field]: "Something is wrong." }),
        field,
      ).to.equal(false);
    }
  });
});
