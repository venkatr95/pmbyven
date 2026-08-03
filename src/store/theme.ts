import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeId } from "@/lib/themes";

interface ThemeState {
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeId: "warm",
      setThemeId: (themeId) => set({ themeId }),
    }),
    { name: "pmbyven-theme" }
  )
);
