import React from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import ApplicationStageBoxItem from "./ApplicationStageBoxItem";

const ApplicationStageBox = () => {
  //#f1f2f4
  return (
    <div className="px-3">
      {/* #ebf4ff instead of #fff???? */}
      <div className="flex flex-col p-3 w-[340px] rounded-lg bg-[#fff] shadow-md border-[1px] border-[#c3dafe]">
        <div className="flex items-center justify-between">
          <span className="font-medium">
            Applied
            <div className="bg-[#c0dbf7] rounded-full text-center px-2 py-1 text-xs font-semibold ml-2 inline-block">
              2
            </div>
          </span>
          <MoreHorizontal size={20} />
        </div>

        <Separator className="my-2 bg-[#d6eaff]" />

        <div className="max-h-[360px] overflow-y-auto">
          <ApplicationStageBoxItem />
          <ApplicationStageBoxItem />
          <ApplicationStageBoxItem />
          <ApplicationStageBoxItem />
          <ApplicationStageBoxItem />
          <ApplicationStageBoxItem />
        </div>

        <Separator className="my-2 bg-[#d6eaff]" />

        {/* was #ddecfc instead of #f0f7fd??? */}
        <button className="flex items-center hover:bg-[#f0f7fd] p-1 rounded-md">
          <Plus size={20} className="mr-1" />
          Add Item
        </button>
      </div>
    </div>
  );
};

export default ApplicationStageBox;
