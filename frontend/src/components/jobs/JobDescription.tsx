import { ChevronDownCircle, FileEdit } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { isTextEmpty } from "@/utils/utils";
import axios from "@/lib/axiosConfig";

import { useCurrentSavedJob } from "@/hooks/zustand/useCurrentSavedJob";

interface JobDescriptionProps {
  jobDescription: string;
}

const JobDescription = ({ jobDescription }: JobDescriptionProps) => {
  const { currentSavedJob, setCurrentSavedJob } = useCurrentSavedJob();
  const [rotateChevron, setRotateChevron] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [value, setValue] = useState("");

  const handleRotate = () => setRotateChevron(!rotateChevron);
  const rotate = rotateChevron ? "rotate(-180deg)" : "rotate(0)";

  useEffect(() => {
    setValue(jobDescription);
  }, [jobDescription]);

  const handleSaveJobDescription = async () => {
    try {
      console.log(value);
      const res = await axios.put(
        `/saved-jobs/${currentSavedJob?.id}/job-description`,
        {
          jobDescription: value,
        }
      );
      const updatedSavedJob = res.data;
      setCurrentSavedJob(updatedSavedJob);
      setIsEditMode(false);
    } catch (error) {
      console.log(error);
    }
  };

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
            <div className="text-gray-700">
              {value !== "" && (
                <div
                  className="max-h-[500px] overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: value }}
                ></div>
              )}
              {value === "" && (
                <p className="text-gray-700">
                  No job description yet. Click the edit button to paste in the
                  job description.
                </p>
              )}
            </div>
          )}
          {isEditMode && (
            <div className="flex flex-col">
              <ReactQuill
                theme="snow"
                value={value}
                onChange={(value) => {
                  if (isTextEmpty(value)) {
                    setValue("");
                  } else {
                    setValue(value);
                  }
                }}
                className="job-description-quill"
              />
              <div className="flex items-center space-x-2 mt-3">
                <Button
                  variant="primary"
                  size="sm"
                  className="text-white bg-blue-600 hover:bg-blue-700 px-5"
                  onClick={handleSaveJobDescription}
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
