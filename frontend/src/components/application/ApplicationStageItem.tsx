import React from "react";

interface ApplicationStageItemProps {
  stage: string;
  count: number;
}

const ApplicationStageItem = ({ stage, count }: ApplicationStageItemProps) => {
  //#faf8f8
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-[#f1f6fa] min-w-[166px] h-[64px] tracking-wider uppercase border-[1px] border-[#c3dafe] font-semibold text-[#3d3d3d] px-3 py-2 mr-2">
      <span>{count > 0 ? count : "– –"}</span>
      <span className="text-sm">{stage}</span>
    </div>
  );
};

export default ApplicationStageItem;
