import { expect } from "chai";

import "../../../src/components/gallery/gallery-log.ts";
import type { GalleryLog } from "../../../src/components/gallery/gallery-log.ts";
import { mount, query, queryAll, text, update } from "../../helpers/dom.ts";

describe("<gallery-log>", () => {
  it("shows the empty message when there is nothing to report", async () => {
    const log = await mount<GalleryLog>("gallery-log", {
      emptyMessage: "No clicks yet.",
    });

    expect(text(query(log, ".empty"))).to.equal("No clicks yet.");
    expect(query(log, ".log")).to.equal(null);
  });

  it("lists the entries in the order given", async () => {
    const log = await mount<GalleryLog>("gallery-log", {
      entries: ["newest", "older", "oldest"],
    });

    expect(queryAll(log, ".entry").map(text)).to.deep.equal([
      "newest",
      "older",
      "oldest",
    ]);
  });

  it("highlights only the newest entry", async () => {
    const log = await mount<GalleryLog>("gallery-log", {
      entries: ["newest", "older"],
    });

    const highlighted = queryAll(log, ".entry").map((entry) =>
      entry.className.includes("latest"),
    );

    expect(highlighted).to.deep.equal([true, false]);
  });

  it("announces changes politely", async () => {
    const log = await mount<GalleryLog>("gallery-log", { entries: ["one"] });

    expect(query(log, ".log")?.getAttribute("aria-live")).to.equal("polite");
  });

  it("swaps the empty message out once an entry arrives", async () => {
    const log = await mount<GalleryLog>("gallery-log");

    await update(log, { entries: ["one"] });

    expect(query(log, ".empty")).to.equal(null);
    expect(queryAll(log, ".entry")).to.have.lengthOf(1);
  });
});
