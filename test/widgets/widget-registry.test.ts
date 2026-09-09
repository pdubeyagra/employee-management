import { expect } from "chai";

import {
  clearWidgets,
  getWidget,
  hasWidget,
  listWidgets,
  registerWidget,
  registerWidgets,
  type WidgetDefinition,
} from "../../src/widgets/widget-registry.ts";
import { WIDGET_CATALOG } from "../../src/widgets/widget-catalog.ts";
import { makeWidget } from "../helpers/widgets.ts";

describe("widget-registry", () => {
  let snapshot: WidgetDefinition[] = [];

  beforeEach(() => {
    snapshot = listWidgets();

    clearWidgets();
  });

  afterEach(() => {
    clearWidgets();
    registerWidgets(snapshot);
  });

  describe("registerWidget", () => {
    it("makes the widget findable by id", () => {
      const widget = makeWidget("reports");

      registerWidget(widget);

      expect(getWidget("reports")).to.equal(widget);
      expect(hasWidget("reports")).to.equal(true);
    });

    it("returns the definition it registered", () => {
      const widget = makeWidget("reports");

      expect(registerWidget(widget)).to.equal(widget);
    });

    it("refuses a duplicate id, so two widgets cannot share an address", () => {
      registerWidget(makeWidget("reports"));

      expect(() => registerWidget(makeWidget("reports"))).to.throw(
        /already registered/,
      );
    });

    it("refuses an id that would not survive a URL", () => {
      for (const id of ["Reports", "my widget", "reports/daily", ""]) {
        expect(() => registerWidget(makeWidget("reports", { id }))).to.throw(
          /must be lowercase/,
        );
      }
    });

    it("accepts dashes and digits", () => {
      expect(() =>
        registerWidget(makeWidget("reports", { id: "time-off-2" })),
      ).to.not.throw();
    });
  });

  describe("listWidgets", () => {
    it("is empty before anything registers", () => {
      expect(listWidgets()).to.deep.equal([]);
    });

    it("keeps registration order", () => {
      registerWidgets([makeWidget("alpha"), makeWidget("beta")]);
      registerWidget(makeWidget("gamma"));

      expect(listWidgets().map((widget) => widget.id)).to.deep.equal([
        "alpha",
        "beta",
        "gamma",
      ]);
    });

    it("hands back a copy, so callers cannot mutate the registry", () => {
      registerWidget(makeWidget("alpha"));

      listWidgets().push(makeWidget("beta"));

      expect(listWidgets()).to.have.lengthOf(1);
    });
  });

  describe("lookups for unknown ids", () => {
    it("reports nothing rather than throwing", () => {
      expect(getWidget("missing")).to.equal(undefined);
      expect(hasWidget("missing")).to.equal(false);
    });
  });

  describe("the shipped catalog", () => {
    it("registers the employee widget at app://employees", () => {
      registerWidgets(WIDGET_CATALOG);

      expect(getWidget("employees")?.title).to.equal("Employees");
    });

    it("gives every catalog widget an id the shell can address", () => {
      registerWidgets(WIDGET_CATALOG);

      const ids = listWidgets().map((widget) => widget.id);

      expect(ids).to.have.lengthOf(WIDGET_CATALOG.length);
      expect(new Set(ids).size).to.equal(ids.length);
    });
  });
});
