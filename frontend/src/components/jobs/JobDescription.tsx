import React, { useEffect, useState } from "react";

import { ChevronDownCircle, FileEdit } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "../ui/button";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { cn } from "@/lib/utils";
import { isTextEmpty } from "@/utils/utils";
import axios from "@/lib/axiosConfig";

import JobDescriptionSkeleton from "../skeleton/JobDescriptionSkeleton";

import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface JobDescriptionProps {
  jobDescription: string;
  isLoading: boolean;
}

const JobDescription = ({ jobDescription, isLoading }: JobDescriptionProps) => {
  const { id: currentSavedJobId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [rotateChevron, setRotateChevron] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [value, setValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleRotate = () => setRotateChevron(!rotateChevron);
  const rotate = rotateChevron ? "rotate(-180deg)" : "rotate(0)";

  useEffect(() => {
    setValue(jobDescription);
  }, [jobDescription]);

  const handleSaveJobDescription = async () => {
    try {
      if (!currentSavedJobId) return;

      console.log(value);
      setIsSaving(true);
      const res = await axios.put(
        `/saved-jobs/${currentSavedJobId}/job-description`,
        {
          jobDescription: value,
        }
      );

      await queryClient.invalidateQueries({
        queryKey: ["job-details", currentSavedJobId],
      });

      //TODO: refetch saved jobs?

      setIsEditMode(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
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
              onClick={() => {
                if (isLoading) return;
                setIsEditMode(!isEditMode);
              }}
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
          {isLoading ? (
            <JobDescriptionSkeleton />
          ) : (
            <>
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
                      No job description yet. Click the edit button to paste in
                      the job description.
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
                      disabled={isSaving}
                    >
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                      onClick={() => setIsEditMode(!isEditMode)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default JobDescription;
