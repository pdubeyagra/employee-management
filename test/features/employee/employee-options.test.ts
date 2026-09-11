import { expect } from "chai";

import {
  DEPARTMENTS,
  DESIGNATIONS,
  DEPARTMENT_OPTIONS,
  DESIGNATION_OPTIONS,
  withCurrentValue,
} from "@/features/employee/employee-options.ts";

describe("employee options", () => {
  it("stores what it displays, so nothing needs decoding elsewhere", () => {
    for (const option of [...DEPARTMENT_OPTIONS, ...DESIGNATION_OPTIONS]) {
      expect(option.value, option.label).to.equal(option.label);
    }
  });

  it("mirrors the source lists in order", () => {
    expect(DEPARTMENT_OPTIONS.map((option) => option.value)).to.deep.equal([
      ...DEPARTMENTS,
    ]);
    expect(DESIGNATION_OPTIONS.map((option) => option.value)).to.deep.equal([
      ...DESIGNATIONS,
    ]);
  });

  it("offers no duplicates", () => {
    for (const list of [DEPARTMENTS, DESIGNATIONS]) {
      expect(new Set(list).size, list.join()).to.equal(list.length);
    }
  });
});

describe("withCurrentValue", () => {
  it("leaves the list alone when the value is already offered", () => {
    const result = withCurrentValue(DEPARTMENT_OPTIONS, "Engineering");

    expect(result).to.equal(DEPARTMENT_OPTIONS);
  });

  it("leaves the list alone when there is no value yet", () => {
    expect(withCurrentValue(DEPARTMENT_OPTIONS, "")).to.equal(
      DEPARTMENT_OPTIONS,
    );
    expect(withCurrentValue(DEPARTMENT_OPTIONS, "   ")).to.equal(
      DEPARTMENT_OPTIONS,
    );
  });

  it("appends a stored value the list no longer offers", () => {
    const result = withCurrentValue(DEPARTMENT_OPTIONS, "Skunkworks");

    expect(result).to.have.lengthOf(DEPARTMENT_OPTIONS.length + 1);
    expect(result[result.length - 1]).to.deep.equal({
      value: "Skunkworks",
      label: "Skunkworks",
    });
  });

  it("does not mutate the list it was given", () => {
    const before = [...DEPARTMENT_OPTIONS];

    withCurrentValue(DEPARTMENT_OPTIONS, "Skunkworks");

    expect(DEPARTMENT_OPTIONS).to.deep.equal(before);
  });
});
