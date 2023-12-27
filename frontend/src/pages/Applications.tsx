import ApplicationStageBox from "@/components/application/ApplicationStageBox";
import ApplicationStageItem from "@/components/application/ApplicationStageItem";
import { Plus } from "lucide-react";
import React from "react";

const Applications = () => {
  return (
    <div className="bg-[#f7fafc]">
      <div className="border-[#dce6f8] border-b-[1px] bg-white">
        <div className="flex items-center justify-between max-w-[1450px] px-4 mx-auto py-2 overflow-y-auto h-[100px]">
          <ApplicationStageItem stage="Applied" count={3} />
          <ApplicationStageItem stage="Interview" count={1} />
          <ApplicationStageItem stage="Offer" count={0} />
          <ApplicationStageItem stage="Rejected" count={0} />

          {/* Add btn */}
          <button className="flex items-center justify-center bg-[#f1f6fa] min-w-[150px] h-[64px] text-sm tracking-wider uppercase border-[1px] border-[#c3dafe] font-semibold text-[#3d3d3d] px-3 py-2 mr-2 hover:border-blue-400">
            <Plus size={20} className="mr-2" />
            <span>Add Status</span>
          </button>
        </div>
      </div>
      <div className="overflow-y-auto h-full min-h-[calc(100vh-60px-101px)]">
        <div className="mx-auto flex items-center mt-5 max-w-[1450px]">
          <ApplicationStageBox />
          <ApplicationStageBox />
          <ApplicationStageBox />
          <ApplicationStageBox />

          {/* Add btn */}
          <div className="px-3 mb-auto">
            <button className="flex items-center p-3 w-[250px] rounded-lg bg-[#ebf4ff] shadow-md border-[1px] border-[#c3dafe] hover:border-blue-400">
              <Plus size={20} className="mr-2" />
              <span className="text-sm font-medium text-[#3d3d3d]">
                Add Stage
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;
