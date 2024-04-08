import React from "react";
import JobDescription from "../jobs/JobDescription";
import Task from "../task/Task";
import { format } from "date-fns";
import Note from "../note/Note";
import Contact from "../contact/Contact";
import AttachedDocuments from "../document/AttachedDocuments";
import { Info } from "lucide-react";

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
          isLoading={jobDetailsStatus === "pending"}
        />
        <Task jobId={currentSavedJob?.id.toString() || ""} />
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
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 bg-white border border-[#dbe9ff] w-full shadow-sm space-y-4">
          <Note />
          <Contact
            contacts={currentSavedJob?.contacts}
            jobId={currentSavedJob?.id}
          />
          <AttachedDocuments documents={currentSavedJob?.documents || []} />
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
