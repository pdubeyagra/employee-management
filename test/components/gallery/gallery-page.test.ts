import { expect } from "chai";

import "../../../src/components/gallery/gallery-page.ts";
import type { GalleryPage } from "../../../src/components/gallery/gallery-page.ts";
import { mount, query, text, update } from "../../helpers/dom.ts";

describe("<gallery-page>", () => {
  it("renders the heading", async () => {
    const page = await mount<GalleryPage>("gallery-page", {
      heading: "Button",
    });

    expect(text(query(page, ".heading"))).to.equal("Button");
  });

  it("shows the address it answers on", async () => {
    const page = await mount<GalleryPage>("gallery-page", {
      address: "app://button",
    });

    expect(text(query(page, ".address"))).to.equal("app://button");
  });

  it("omits the address chip when there is none", async () => {
    const page = await mount<GalleryPage>("gallery-page", { heading: "Button" });

    expect(query(page, ".address")).to.equal(null);
  });

  it("renders the description", async () => {
    const page = await mount<GalleryPage>("gallery-page", {
      description: "The shared button.",
    });

    expect(text(query(page, ".description"))).to.equal("The shared button.");
  });

  it("omits the description when there is none", async () => {
    const page = await mount<GalleryPage>("gallery-page", { heading: "Button" });

    expect(query(page, ".description")).to.equal(null);
  });

  it("gives the demo cards a slot to land in", async () => {
    const page = await mount<GalleryPage>("gallery-page");

    expect(query(page, ".sections slot")).to.not.equal(null);
  });

  it("updates when the heading changes", async () => {
    const page = await mount<GalleryPage>("gallery-page", { heading: "One" });

    await update(page, { heading: "Two" });

    expect(text(query(page, ".heading"))).to.equal("Two");
  });
});
