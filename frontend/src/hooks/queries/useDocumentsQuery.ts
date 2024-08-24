import axios from "@/lib/axiosConfig";
import DocumentType from "@/types/DocumentType";
import { useQuery } from "@tanstack/react-query";

export const useDocumentsQuery = () => {
  return useQuery({
    queryKey: ["document-lists"],
    queryFn: async () => {
      console.log("fetching document types [START]");
      const res = await axios.get<DocumentType[]>("/document-types");
      console.log("fetching document types [FINISH]");
      return res.data;
    },
    refetchOnMount: true,
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000 * 5, //5 mins
  });
};
