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
      name: "O.A.",
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
      name: "Interview",
      jobOrderIds: [6, 7, 8],
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
      ],
    },
    {
      id: 3,
      name: "Offer",
      jobOrderIds: [9, 10, 11, 12, 13],
      jobs: [
        {
          id: 9,
          title: "Job 9",
          company: "Google",
          stageId: 3,
        },
        {
          id: 10,
          title: "Job 10",
          company: "Facebook",
          stageId: 3,
        },
        {
          id: 11,
          title: "Job 11",
          company: "Apple",
          stageId: 3,
        },
        {
          id: 12,
          title: "Job 12",
          company: "Apple",
          stageId: 3,
        },
        {
          id: 13,
          title: "Job 13",
          company: "Apple",
          stageId: 3,
        },
      ],
    },
    {
      id: 4,
      name: "Rejected",
      jobOrderIds: [14],
      jobs: [
        {
          id: 14,
          title: "Job 14",
          company: "Google",
          stageId: 4,
        },
      ],
    },
  ],
};

export { applicationData };
