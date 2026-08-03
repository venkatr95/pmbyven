import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ReaderState {
  fontSize: number;
  readingWidth: "narrow" | "normal" | "wide";
  distractionFree: boolean;
  fullscreen: boolean;
  bookmarks: string[];
  recentlyViewed: string[];
  readingStreak: number;
  lastReadDate: string | null;
  setFontSize: (n: number) => void;
  setReadingWidth: (w: "narrow" | "normal" | "wide") => void;
  setDistractionFree: (v: boolean) => void;
  setFullscreen: (v: boolean) => void;
  toggleBookmark: (slug: string) => void;
  isBookmarked: (slug: string) => boolean;
  addRecentlyViewed: (slug: string) => void;
  updateStreak: () => void;
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set, get) => ({
      fontSize: 18,
      readingWidth: "normal",
      distractionFree: false,
      fullscreen: false,
      bookmarks: [],
      recentlyViewed: [],
      readingStreak: 0,
      lastReadDate: null,
      setFontSize: (fontSize) => set({ fontSize }),
      setReadingWidth: (readingWidth) => set({ readingWidth }),
      setDistractionFree: (distractionFree) => set({ distractionFree }),
      setFullscreen: (fullscreen) => set({ fullscreen }),
      toggleBookmark: (slug) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(slug)
            ? s.bookmarks.filter((b) => b !== slug)
            : [...s.bookmarks, slug],
        })),
      isBookmarked: (slug) => get().bookmarks.includes(slug),
      addRecentlyViewed: (slug) =>
        set((s) => ({
          recentlyViewed: [slug, ...s.recentlyViewed.filter((x) => x !== slug)].slice(0, 20),
        })),
      updateStreak: () => {
        const today = new Date().toISOString().slice(0, 10);
        const { lastReadDate, readingStreak } = get();
        if (lastReadDate === today) return;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const y = yesterday.toISOString().slice(0, 10);
        set({
          readingStreak: lastReadDate === y ? readingStreak + 1 : 1,
          lastReadDate: today,
        });
      },
    }),
    { name: "pmbyven-reader" }
  )
);
