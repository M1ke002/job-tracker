import axios from "@/lib/axiosConfig";
import ApplicationStage from "@/types/ApplicationStage";
import { useQuery } from "@tanstack/react-query";

export const useApplicationStagesQuery = () => {
  return useQuery({
    queryKey: ["application-stages"],
    queryFn: async () => {
      const res = await axios.get<ApplicationStage[]>("/application-stages");
      return res.data;
    },
    refetchOnMount: "always",
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};
