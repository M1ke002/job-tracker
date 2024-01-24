import { create } from "zustand";
import ScrapedSite from "@/types/ScrapedSite";

interface CurrentScrapedSiteIdStore {
  currentScrapedSiteId: string | null;
  setCurrentScrapedSiteId: (scrapedSiteId: string) => void;
}

export const useCurrentScrapedSiteId = create<CurrentScrapedSiteIdStore>(
  (set) => ({
    currentScrapedSiteId: null,
    setCurrentScrapedSiteId: (scrapedSiteId: string) =>
      set({ currentScrapedSiteId: scrapedSiteId }),
  })
);
