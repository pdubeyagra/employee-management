import { expect } from "chai";

import { EmployeeStore } from "../../../src/widgets/employee/employee-store.ts";
import type { Employee } from "../../../src/types/employee-types.ts";

const ADA = {
  name: "Ada Lovelace",
  department: "Engineering",
  designation: "Principal Engineer",
  email: "ada@example.com",
};

const GRACE = {
  name: "Grace Hopper",
  department: "Research",
  designation: "Rear Admiral",
  email: "grace@example.com",
};

describe("EmployeeStore", () => {
  let store: EmployeeStore;

  beforeEach(() => {
    store = new EmployeeStore();
  });

  describe("add", () => {
    it("starts empty", () => {
      expect(store.getAll()).to.deep.equal([]);
    });

    it("keeps the employee and gives it an id", () => {
      const added = store.add(ADA);

      expect(added).to.include(ADA);
      expect(added.id).to.be.a("string").and.to.have.length.above(0);
      expect(store.getAll()).to.deep.equal([added]);
    });

    it("gives each employee a distinct id", () => {
      expect(store.add(ADA).id).to.not.equal(store.add(ADA).id);
    });

    it("keeps insertion order", () => {
      store.add(ADA);
      store.add(GRACE);

      expect(store.getAll().map((employee) => employee.name)).to.deep.equal([
        "Ada Lovelace",
        "Grace Hopper",
      ]);
    });
  });

  describe("update", () => {
    it("replaces only the matching employee", () => {
      const ada = store.add(ADA);
      store.add(GRACE);

      store.update({ ...ada, designation: "VP Engineering" });

      expect(store.getAll()[0]!.designation).to.equal("VP Engineering");
      expect(store.getAll()[1]!.name).to.equal("Grace Hopper");
    });

    it("reports whether it found the employee", () => {
      const ada = store.add(ADA);

      expect(store.update({ ...ada, name: "Ada L." })).to.equal(true);
      expect(store.update({ ...ada, id: "missing" })).to.equal(false);
    });

    it("leaves the roster alone when the id is unknown", () => {
      store.add(ADA);
      const before = store.getAll();

      store.update({ ...ADA, id: "missing" });

      expect(store.getAll()).to.equal(before);
    });
  });

  describe("remove", () => {
    it("drops the employee", () => {
      const ada = store.add(ADA);
      store.add(GRACE);

      expect(store.remove(ada.id)).to.equal(true);
      expect(store.getAll().map((employee) => employee.name)).to.deep.equal([
        "Grace Hopper",
      ]);
    });

    it("reports a miss for an unknown id", () => {
      store.add(ADA);

      expect(store.remove("missing")).to.equal(false);
      expect(store.getAll()).to.have.lengthOf(1);
    });
  });

  describe("subscribe", () => {
    it("notifies on every change", () => {
      const seen: Employee[][] = [];

      store.subscribe((employees) => seen.push(employees));

      const ada = store.add(ADA);
      store.update({ ...ada, name: "Ada L." });
      store.remove(ada.id);

      expect(seen).to.have.lengthOf(3);
      expect(seen[2]).to.deep.equal([]);
    });

    it("hands the listener the roster after the change", () => {
      let latest: Employee[] = [];

      store.subscribe((employees) => {
        latest = employees;
      });

      store.add(ADA);

      expect(latest.map((employee) => employee.name)).to.deep.equal([
        "Ada Lovelace",
      ]);
    });

    it("stays quiet for a change that did not happen", () => {
      let calls = 0;

      store.subscribe(() => {
        calls += 1;
      });

      store.remove("missing");
      store.update({ ...ADA, id: "missing" });

      expect(calls).to.equal(0);
    });

    it("reaches every subscriber, which is how two tabs stay in step", () => {
      const tabA: Employee[][] = [];
      const tabB: Employee[][] = [];

      store.subscribe((employees) => tabA.push(employees));
      store.subscribe((employees) => tabB.push(employees));

      store.add(ADA);

      expect(tabA).to.have.lengthOf(1);
      expect(tabB).to.deep.equal(tabA);
    });

    it("stops notifying once unsubscribed", () => {
      let calls = 0;

      const unsubscribe = store.subscribe(() => {
        calls += 1;
      });

      store.add(ADA);
      unsubscribe();
      store.add(GRACE);

      expect(calls).to.equal(1);
    });
  });

  describe("reset", () => {
    it("empties the roster and tells subscribers", () => {
      let latest: Employee[] | null = null;

      store.add(ADA);
      store.subscribe((employees) => {
        latest = employees;
      });

      store.reset();

      expect(store.getAll()).to.deep.equal([]);
      expect(latest).to.deep.equal([]);
    });
  });
});
