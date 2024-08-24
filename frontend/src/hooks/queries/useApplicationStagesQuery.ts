import axios from "@/lib/axiosConfig";
import ApplicationStage from "@/types/ApplicationStage";
import { useQuery } from "@tanstack/react-query";

export const useApplicationStagesQuery = () => {
  return useQuery({
    queryKey: ["application-stages"],
    queryFn: async () => {
      console.log("fetching application-stages [START]");
      const res = await axios.get<ApplicationStage[]>("/application-stages");
      console.log("fetching application-stages [FINISH]");
      return res.data;
    },
    refetchOnMount: true,
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });
};
