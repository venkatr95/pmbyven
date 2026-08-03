import { describe, it, expect, beforeEach } from "vitest";
import { useReaderStore } from "./reader";

describe("useReaderStore", () => {
  beforeEach(() => {
    useReaderStore.setState({
      fontSize: 18,
      readingWidth: "normal",
      distractionFree: false,
      fullscreen: false,
      bookmarks: [],
      recentlyViewed: [],
      readingStreak: 0,
      lastReadDate: null,
    });
  });

  it("has sensible defaults", () => {
    const s = useReaderStore.getState();
    expect(s.fontSize).toBe(18);
    expect(s.readingWidth).toBe("normal");
    expect(s.distractionFree).toBe(false);
    expect(s.bookmarks).toEqual([]);
  });

  it("updates font size", () => {
    useReaderStore.getState().setFontSize(22);
    expect(useReaderStore.getState().fontSize).toBe(22);
  });

  it("updates reading width", () => {
    useReaderStore.getState().setReadingWidth("wide");
    expect(useReaderStore.getState().readingWidth).toBe("wide");
  });

  it("toggles bookmarks", () => {
    const { toggleBookmark, isBookmarked } = useReaderStore.getState();
    expect(isBookmarked("slug-a")).toBe(false);
    toggleBookmark("slug-a");
    expect(useReaderStore.getState().isBookmarked("slug-a")).toBe(true);
    useReaderStore.getState().toggleBookmark("slug-a");
    expect(useReaderStore.getState().isBookmarked("slug-a")).toBe(false);
  });

  it("tracks recently viewed (unique, max 20)", () => {
    const store = useReaderStore.getState();
    store.addRecentlyViewed("a");
    store.addRecentlyViewed("b");
    store.addRecentlyViewed("a");
    expect(useReaderStore.getState().recentlyViewed[0]).toBe("a");
    expect(useReaderStore.getState().recentlyViewed.filter((x) => x === "a")).toHaveLength(1);

    for (let i = 0; i < 25; i++) {
      useReaderStore.getState().addRecentlyViewed(`p-${i}`);
    }
    expect(useReaderStore.getState().recentlyViewed.length).toBeLessThanOrEqual(20);
  });

  it("updates reading streak", () => {
    useReaderStore.getState().updateStreak();
    expect(useReaderStore.getState().readingStreak).toBe(1);
    expect(useReaderStore.getState().lastReadDate).toBe(
      new Date().toISOString().slice(0, 10)
    );
    // same day — no increment
    useReaderStore.getState().updateStreak();
    expect(useReaderStore.getState().readingStreak).toBe(1);
  });

  it("toggles distraction free and fullscreen", () => {
    useReaderStore.getState().setDistractionFree(true);
    useReaderStore.getState().setFullscreen(true);
    expect(useReaderStore.getState().distractionFree).toBe(true);
    expect(useReaderStore.getState().fullscreen).toBe(true);
  });
});
