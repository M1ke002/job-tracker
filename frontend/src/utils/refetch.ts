const refetchApplicationStagesData = async (queryClient: any) => {
  await queryClient.refetchQueries({
    queryKey: ["application-stages"],
    type: "active",
  });
};

const refetchSavedJobsData = async (queryClient: any) => {
  console.log("called", queryClient);
  await queryClient.refetchQueries({
    queryKey: ["saved-jobs"],
    type: "active",
  });
};

const refetchJobDetailsData = async (queryClient: any, id: string) => {
  await queryClient.refetchQueries({
    queryKey: ["job-details", id],
    type: "active",
  });
};

const refetchDocumentsData = async (queryClient: any) => {
  await queryClient.refetchQueries({
    queryKey: ["documents"],
    type: "active",
  });
};

export {
  refetchJobDetailsData,
  refetchApplicationStagesData,
  refetchSavedJobsData,
  refetchDocumentsData,
};
