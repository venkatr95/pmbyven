import { describe, it, expect } from "vitest";
import { themes, getTheme, type ThemeId } from "./themes";

describe("themes", () => {
  it("exports 8 named themes", () => {
    expect(themes).toHaveLength(8);
    const ids = themes.map((t) => t.id);
    expect(ids).toEqual([
      "warm",
      "midnight",
      "forest",
      "nordic",
      "sand",
      "aurora",
      "sunset",
      "ocean",
    ]);
  });

  it("each theme has required CSS variables", () => {
    const required = [
      "--background",
      "--foreground",
      "--primary",
      "--card",
      "--glass",
      "--gradient-from",
      "--gradient-to",
      "--selection",
      "--code-bg",
    ];
    for (const theme of themes) {
      for (const key of required) {
        expect(theme.vars[key], `${theme.id} missing ${key}`).toBeTruthy();
      }
      expect(theme.name).toBeTruthy();
      expect(theme.description).toBeTruthy();
    }
  });

  it("getTheme returns matching theme", () => {
    expect(getTheme("midnight").id).toBe("midnight");
    expect(getTheme("aurora").name).toBe("Aurora");
  });

  it("getTheme falls back to default for unknown ids", () => {
    expect(getTheme("not-a-theme").id).toBe("warm");
    expect(getTheme("").id).toBe("warm");
  });

  it("theme ids are unique", () => {
    const ids = themes.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("accepts ThemeId union values", () => {
    const id: ThemeId = "ocean";
    expect(getTheme(id).id).toBe("ocean");
  });
});
