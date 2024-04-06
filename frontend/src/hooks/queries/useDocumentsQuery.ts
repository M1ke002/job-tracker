import axios from "@/lib/axiosConfig";
import DocumentType from "@/types/DocumentType";
import { useQuery } from "@tanstack/react-query";

export const useDocumentsQuery = () => {
  return useQuery({
    queryKey: ["document-lists"],
    queryFn: async () => {
      const res = await axios.get<DocumentType[]>("/document-types");
      return res.data;
    },
    refetchOnMount: true,
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  });
};
