import { describe, it, expect, beforeEach } from "vitest";
import { useThemeStore } from "./theme";

describe("useThemeStore", () => {
  beforeEach(() => {
    useThemeStore.setState({ themeId: "warm" });
  });

  it("defaults to warm", () => {
    expect(useThemeStore.getState().themeId).toBe("warm");
  });

  it("switches theme", () => {
    useThemeStore.getState().setThemeId("midnight");
    expect(useThemeStore.getState().themeId).toBe("midnight");
    useThemeStore.getState().setThemeId("aurora");
    expect(useThemeStore.getState().themeId).toBe("aurora");
  });
});
