import axios from "@/lib/axiosConfig";
import ScrapedSite from "@/types/ScrapedSite";
import { useQuery } from "@tanstack/react-query";

export const useScrapedSitesQuery = () => {
  return useQuery({
    queryKey: ["scraped-sites"],
    queryFn: async () => {
      const res = await axios.get<ScrapedSite[]>("/scraped-sites");
      return res.data;
    },
    refetchOnMount: true,
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  });
};
