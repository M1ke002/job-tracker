const applicationData = {
  applicationStageOrderIds: [0, 1, 2, 3],
  applicationStages: [
    {
      id: 0,
      name: "Applied",
      jobOrderIds: [0, 1, 2],
      jobs: [
        {
          id: 0,
          title: "Job 0",
          company: "Google",
          stageId: 0,
        },
        {
          id: 1,
          title: "Job 1",
          company: "Facebook",
          stageId: 0,
        },
        {
          id: 2,
          title: "Job 2",
          company: "Apple",
          stageId: 0,
        },
      ],
    },
    {
      id: 1,
      name: "Interview",
      jobOrderIds: [3, 4, 5],
      jobs: [
        {
          id: 3,
          title: "Job 3",
          company: "Google",
          stageId: 1,
        },
        {
          id: 4,
          title: "Job 4",
          company: "Facebook",
          stageId: 1,
        },
        {
          id: 5,
          title: "Job 5",
          company: "Apple",
          stageId: 1,
        },
      ],
    },
    {
      id: 2,
      name: "Offer",
      jobOrderIds: [6, 7, 8, 9, 10],
      jobs: [
        {
          id: 6,
          title: "Job 6",
          company: "Google",
          stageId: 2,
        },
        {
          id: 7,
          title: "Job 7",
          company: "Facebook",
          stageId: 2,
        },
        {
          id: 8,
          title: "Job 8",
          company: "Apple",
          stageId: 2,
        },
        {
          id: 9,
          title: "Job 9",
          company: "Apple",
          stageId: 2,
        },
        {
          id: 10,
          title: "Job 10",
          company: "Apple",
          stageId: 2,
        },
      ],
    },
    {
      id: 3,
      name: "Rejected",
      jobOrderIds: [11],
      jobs: [
        {
          id: 11,
          title: "Job 11",
          company: "Google",
          stageId: 3,
        },
      ],
    },
  ],
};

export { applicationData };
