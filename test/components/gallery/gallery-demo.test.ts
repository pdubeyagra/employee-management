import { expect } from "chai";

import "../../../src/components/gallery/gallery-demo.ts";
import type { GalleryDemo } from "../../../src/components/gallery/gallery-demo.ts";
import { mount, query, text, update } from "../../helpers/dom.ts";

describe("<gallery-demo>", () => {
  it("renders the label", async () => {
    const demo = await mount<GalleryDemo>("gallery-demo", { label: "Variants" });

    expect(text(query(demo, ".demo-label"))).to.equal("Variants");
  });

  it("renders the hint when given one", async () => {
    const demo = await mount<GalleryDemo>("gallery-demo", {
      hint: "The colour role.",
    });

    expect(text(query(demo, ".demo-hint"))).to.equal("The colour role.");
  });

  it("omits the hint when there is none", async () => {
    const demo = await mount<GalleryDemo>("gallery-demo", { label: "Variants" });

    expect(query(demo, ".demo-hint")).to.equal(null);
  });

  it("shows the snippet as code", async () => {
    const demo = await mount<GalleryDemo>("gallery-demo", {
      code: '<ui-button variant="danger">Delete</ui-button>',
    });

    expect(text(query(demo, ".demo-code"))).to.equal(
      '<ui-button variant="danger">Delete</ui-button>',
    );
  });

  it("omits the snippet when there is none", async () => {
    const demo = await mount<GalleryDemo>("gallery-demo", { label: "Variants" });

    expect(query(demo, ".demo-code")).to.equal(null);
  });

  it("gives the examples a slot to land in", async () => {
    const demo = await mount<GalleryDemo>("gallery-demo");

    expect(query(demo, ".demo-examples slot")).to.not.equal(null);
  });

  describe("layout", () => {
    it("lays examples out in a row by default", async () => {
      const demo = await mount<GalleryDemo>("gallery-demo");

      expect(demo.getAttribute("layout")).to.equal("row");
    });

    it("reflects the stack layout to an attribute, which the CSS keys off", async () => {
      const demo = await mount<GalleryDemo>("gallery-demo", {
        layout: "stack",
      });

      expect(demo.getAttribute("layout")).to.equal("stack");
    });

    it("keeps the attribute in step when the layout changes", async () => {
      const demo = await mount<GalleryDemo>("gallery-demo");

      await update(demo, { layout: "stack" });

      expect(demo.getAttribute("layout")).to.equal("stack");
    });
  });
});
