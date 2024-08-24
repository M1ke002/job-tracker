import axios from "@/lib/axiosConfig";
import SavedJob from "@/types/SavedJob";
import { useQuery } from "@tanstack/react-query";

export const useSavedJobsQuery = () => {
  return useQuery({
    queryKey: ["saved-jobs"],
    queryFn: async () => {
      console.log("fetching saved jobs [START]");
      const res = await axios.get<SavedJob[]>("/saved-jobs");
      console.log("fetching saved jobs [FINISH]");
      return res.data;
    },
    refetchOnMount: true,
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });
};
