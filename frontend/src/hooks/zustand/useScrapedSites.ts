import { create } from "zustand";
import ScrapedSite from "@/types/ScrapedSite";

interface ScrapedSitesStore {
  scrapedSites: ScrapedSite[];
  setScrapedSites: (scrapedSites: ScrapedSite[]) => void;
}

export const useScrapedSites = create<ScrapedSitesStore>((set) => ({
  scrapedSites: [],
  setScrapedSites: (scrapedSites: ScrapedSite[]) => set({ scrapedSites }),
}));
