export enum ApplicationStageNames {
  APPLIED = "Applied",
  OA = "O.A.",
  INTERVIEW = "Interview",
  OFFER = "Offer",
  REJECTED = "Rejected",
}

export const applicationStageColors = {
  [ApplicationStageNames.APPLIED]: "blue-200",
  [ApplicationStageNames.OA]: "[#a3e8f8]",
  [ApplicationStageNames.INTERVIEW]: "amber-200",
  [ApplicationStageNames.OFFER]: "green-300",
  [ApplicationStageNames.REJECTED]: "rose-300",
};
