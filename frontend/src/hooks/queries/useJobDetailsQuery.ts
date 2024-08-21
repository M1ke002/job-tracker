import axios from "@/lib/axiosConfig";
import SavedJob from "@/types/SavedJob";
import { useQuery } from "@tanstack/react-query";

export const useJobDetailsQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ["job-details", id],
    queryFn: async () => {
      const res = await axios.get<SavedJob>(`/saved-jobs/${id}`);
      return res.data;
    },
    refetchOnMount: true,
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });
};
