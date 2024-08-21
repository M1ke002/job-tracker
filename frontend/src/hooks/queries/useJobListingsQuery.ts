import axios from "@/lib/axiosConfig";
import JobListingData from "@/types/JobListingData";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useJobListingsQuery = (
  siteId: string | undefined,
  pageNum: number,
  searchText: string
) => {
  return useQuery({
    queryKey: ["job-listings", siteId, pageNum, searchText],
    queryFn: async () => {
      const res = await axios.get<JobListingData>(
        `/scraped-sites/${siteId}/jobs?page=${pageNum}&per_page=30&search=${searchText}`
      );
      console.log(res.data);
      return res.data;
    },
    enabled: !!siteId, //query runs only when siteId is defined,
    refetchOnMount: true,
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000 * 5,
    placeholderData: keepPreviousData,
  });
};
