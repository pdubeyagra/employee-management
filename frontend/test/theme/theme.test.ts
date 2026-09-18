import { expect } from "chai";

import {
  THEME_COLORS,
  generateThemeCSSVariables,
} from "@/theme/colors.ts";
import {
  LAYOUT_CONFIG,
  generateLayoutCSSVariables,
} from "@/theme/layout.ts";

function parseCustomProperties(css: string): Record<string, string> {
  const properties: Record<string, string> = {};

  for (const declaration of css.split(";")) {
    const match = declaration.match(/(--[\w-]+)\s*:\s*([\s\S]+)/);

    if (match) {
      properties[match[1]!] = match[2]!.trim();
    }
  }

  return properties;
}

describe("generateThemeCSSVariables", () => {
  const properties = parseCustomProperties(generateThemeCSSVariables());

  it("maps the semantic names onto the palette", () => {
    expect(properties["--color-primary"]).to.equal(THEME_COLORS.primary[600]);
    expect(properties["--color-primary-hover"]).to.equal(
      THEME_COLORS.primary[700],
    );
    expect(properties["--color-danger"]).to.equal(THEME_COLORS.danger[600]);
    expect(properties["--color-success"]).to.equal(THEME_COLORS.success[600]);
    expect(properties["--color-warning"]).to.equal(THEME_COLORS.warning[600]);
  });

  it("exposes the text, surface and border roles the components consume", () => {
    expect(properties["--color-text-primary"]).to.equal(
      THEME_COLORS.text.primary,
    );
    expect(properties["--color-text-inverse"]).to.equal(
      THEME_COLORS.text.inverse,
    );
    expect(properties["--color-background"]).to.equal(
      THEME_COLORS.background.light,
    );
    expect(properties["--color-background-secondary"]).to.equal(
      THEME_COLORS.gray[50],
    );
    expect(properties["--color-border"]).to.equal(THEME_COLORS.border.light);
    expect(properties["--color-border-secondary"]).to.equal(
      THEME_COLORS.border.medium,
    );
  });

  it("emits every custom property the stylesheets reference", () => {
    expect(Object.keys(properties)).to.include.members([
      "--color-primary",
      "--color-primary-hover",
      "--color-primary-light",
      "--color-secondary",
      "--color-secondary-hover",
      "--color-success",
      "--color-danger",
      "--color-danger-hover",
      "--color-text-primary",
      "--color-text-secondary",
      "--color-text-tertiary",
      "--color-text-inverse",
      "--color-background",
      "--color-background-secondary",
      "--color-border",
      "--color-shadow",
    ]);
  });

  it("leaves no unresolved template placeholders", () => {
    expect(generateThemeCSSVariables()).to.not.contain("undefined");
    expect(generateThemeCSSVariables()).to.not.contain("[object Object]");
  });
});

describe("generateLayoutCSSVariables", () => {
  const properties = parseCustomProperties(generateLayoutCSSVariables());

  it("maps spacing and radius onto the layout config", () => {
    expect(properties["--spacing-xs"]).to.equal(LAYOUT_CONFIG.spacing.xs);
    expect(properties["--spacing-3xl"]).to.equal(LAYOUT_CONFIG.spacing["3xl"]);
    expect(properties["--radius-md"]).to.equal(LAYOUT_CONFIG.radius.md);
    expect(properties["--radius-full"]).to.equal(LAYOUT_CONFIG.radius.full);
  });

  it("maps typography onto the layout config", () => {
    expect(properties["--font-size-xs"]).to.equal(LAYOUT_CONFIG.fontSize.xs);
    expect(properties["--font-size-4xl"]).to.equal(
      LAYOUT_CONFIG.fontSize["4xl"],
    );
    expect(properties["--line-height-tight"]).to.equal(
      LAYOUT_CONFIG.lineHeight.tight,
    );
  });

  it("maps shadows, transitions and z-index onto the layout config", () => {
    expect(properties["--shadow-md"]).to.equal(LAYOUT_CONFIG.shadows.md);
    expect(properties["--transition-fast"]).to.equal(
      LAYOUT_CONFIG.transitions.fast,
    );
    expect(properties["--z-modal"]).to.equal(LAYOUT_CONFIG.zIndex.modal);
  });

  it("leaves no unresolved template placeholders", () => {
    expect(generateLayoutCSSVariables()).to.not.contain("undefined");
  });
});

describe("LAYOUT_CONFIG", () => {
  it("orders the breakpoints from narrow to wide", () => {
    const widths = Object.values(LAYOUT_CONFIG.breakpoints);
    const sorted = [...widths].sort((a, b) => a - b);

    expect(widths).to.deep.equal(sorted);
  });

  it("declares a font stack with a generic fallback", () => {
    expect(LAYOUT_CONFIG.fontFamily).to.contain("sans-serif");
  });
});
