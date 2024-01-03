import { ChevronDownCircle, FileEdit } from "lucide-react";
import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const JobDescription = () => {
  const [rotateChevron, setRotateChevron] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [value, setValue] = useState("");

  const handleRotate = () => setRotateChevron(!rotateChevron);
  const rotate = rotateChevron ? "rotate(-180deg)" : "rotate(0)";
  return (
    <Collapsible defaultOpen={true}>
      <div className="p-6 bg-white border border-[#dbe9ff] w-full shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 mb-2">
            <h2 className="text-xl font-semibold">Job Description</h2>
            <button
              className={cn(
                "border-none focus:outline-none text-blue-700 hover:text-blue-700/80",
                isEditMode && "hidden"
              )}
              onClick={() => setIsEditMode(!isEditMode)}
            >
              <FileEdit size={20} />
            </button>
          </div>
          <CollapsibleTrigger>
            <ChevronDownCircle
              className="text-blue-600 cursor-pointer transition"
              style={{ transform: rotate, transition: "all 0.2s linear" }}
              size={23}
              onClick={handleRotate}
            />
          </CollapsibleTrigger>
        </div>
        <hr className="mt-2 mb-3 border-[#d6eaff]" />
        <CollapsibleContent>
          {!isEditMode && (
            <p className="text-gray-700">
              Position title: Application Developer
              <br />
              Department: IT Status: Full Time, Non-Exempt
              <br />
              Location: Remote
              <br />
              Reports to: Sr. Director of IT & Volunteer Services Works with:
              AHG Staff and Volunteers Pay range: $22 - $24 per hour
              <br />
              Position Description
              <br />
              Exhibits a Christ-like servant leadership spirit while developing
              and maintaining all databases and websites in the environment.
              This role is the primary administrator for all development
              applications and projects.
            </p>
          )}
          {isEditMode && (
            <div className="flex flex-col">
              <ReactQuill
                theme="snow"
                value={value}
                onChange={setValue}
                className="job-description-quill"
              />
              <div className="flex items-center space-x-2 mt-3">
                <Button
                  variant="primary"
                  size="sm"
                  className="text-white bg-blue-600 hover:bg-blue-700 px-5"
                  onClick={() => setIsEditMode(!isEditMode)}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700"
                  onClick={() => setIsEditMode(!isEditMode)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default JobDescription;
