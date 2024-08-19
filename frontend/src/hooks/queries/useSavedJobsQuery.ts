import axios from "@/lib/axiosConfig";
import SavedJob from "@/types/SavedJob";
import { useQuery } from "@tanstack/react-query";

export const useSavedJobsQuery = () => {
  return useQuery({
    queryKey: ["saved-jobs"],
    queryFn: async () => {
      console.log("fetching saved jobs");
      const res = await axios.get<SavedJob[]>("/saved-jobs");
      return res.data;
    },
    refetchOnMount: "always",
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};
