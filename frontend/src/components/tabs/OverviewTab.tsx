import React from "react";

import { Info } from "lucide-react";

import JobDescription from "../jobs/JobDescription";
import Note from "../note/Note";
import Task from "../task/Task";
import Contact from "../contact/Contact";
import AttachedDocuments from "../document/AttachedDocuments";
import Keywords from "../keywords/Keywords";

import { format } from "date-fns";

import SavedJob from "@/types/SavedJob";

interface OverviewTabProps {
  currentSavedJob: SavedJob | null;
  jobDetailsStatus: "error" | "success" | "pending";
}

const OverviewTab = ({
  currentSavedJob,
  jobDetailsStatus,
}: OverviewTabProps) => {
  return (
    <div className="lg:grid grid-cols-5 gap-4 w-full">
      {/* left col */}
      <div className="col-span-3 space-y-4 mb-4 lg:mb-0">
        <JobDescription
          jobDescription={currentSavedJob?.job_description || ""}
          isLoading={!currentSavedJob}
        />

        {/* <Task jobId={currentSavedJob?.id.toString() || ""} /> */}
      </div>

      {/* right col */}

      <div className="col-span-2 space-y-4">
        {currentSavedJob?.applied_date && (
          <div className="p-6 bg-white border border-[#dbe9ff] w-full shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <Info className="text-blue-700" size={23} />
              <div>
                Application started on:{" "}
                <span className="font-semibold">
                  {format(
                    new Date(currentSavedJob?.applied_date),
                    "dd/MM/yyyy"
                  )}
                  .
                </span>{" "}
                <span className="text-blue-600 underline cursor-pointer">
                  View timeline
                </span>
                .
              </div>
            </div>
          </div>
        )}
        <Keywords jobId={currentSavedJob?.id.toString() || ""} />

        <div className="p-6 bg-white border border-[#dbe9ff] w-full shadow-sm space-y-4">
          <Note />
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
