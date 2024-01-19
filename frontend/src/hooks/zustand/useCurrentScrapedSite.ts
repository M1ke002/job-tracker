import { create } from "zustand";
import ScrapedSite from "@/types/ScrapedSite";

interface CurrentScrapedSiteStore {
  currentScrapedSite: ScrapedSite | null;
  setCurrentScrapedSite: (scrapedSite: ScrapedSite) => void;
}

export const useCurrentScrapedSite = create<CurrentScrapedSiteStore>((set) => ({
  currentScrapedSite: null,
  setCurrentScrapedSite: (scrapedSite: ScrapedSite) =>
    set({ currentScrapedSite: scrapedSite }),
}));
