import { FileEdit, Trash } from "lucide-react";
import { useModal } from "@/hooks/zustand/useModal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useCurrentSavedJob } from "@/hooks/zustand/useCurrentSavedJob";
import axios from "@/lib/axiosConfig";

const isTextEmpty = (text: string) => {
  // Regular expression to match HTML tags
  var htmlTagPattern = /<[^>]*>/g;

  // Extract all HTML tags from the input string
  var tags = text.match(htmlTagPattern);

  // If there are tags and they cover the entire input string, it contains only tags
  return tags && text.replace(htmlTagPattern, "").trim() === "";
};

const Note = () => {
  const { currentSavedJob, setCurrentSavedJob } = useCurrentSavedJob();
  const [isEditMode, setIsEditMode] = useState(false);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { onOpen } = useModal();

  useEffect(() => {
    setValue(currentSavedJob?.notes || "");
  }, [currentSavedJob]);

  const handleSaveNote = async () => {
    try {
      setIsLoading(true);
      const res = await axios.put(`/saved-jobs/${currentSavedJob?.id}/notes`, {
        notes: value,
      });
      const updatedSavedJob = res.data;
      setCurrentSavedJob(updatedSavedJob);
      setIsEditMode(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setValue(currentSavedJob?.notes || "");
    setIsEditMode(false);
  };

  const handleDeleteNote = async () => {
    try {
      const res = await axios.put(`/saved-jobs/${currentSavedJob?.id}/notes`, {
        notes: "",
      });
      const updatedSavedJob = res.data;
      setCurrentSavedJob(updatedSavedJob);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
            className="job-note-quill"
          />
          <div className="flex items-center space-x-2 mt-3">
            <Button
              variant="primary"
              size="sm"
              className="text-white bg-blue-600 hover:bg-blue-700 px-5"
              disabled={isLoading}
              onClick={handleSaveNote}
            >
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      {!isEditMode && (
        <div className="relative p-3 rounded-md shadow-sm bg-[#f1f6fa] border border-[#c3dafe]">
          {value !== "" && (
            <div
              className="min-h-28 max-h-[600px] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: value }}
            ></div>
          )}

          {value === "" && (
            <div className="flex items-center justify-center h-28 text-gray-400">
              No notes yet
            </div>
          )}

          <div className="absolute top-3 right-3 flex items-center space-x-1">
            <button
              className="border-none focus:outline-none text-blue-700 hover:text-blue-700/80"
              onClick={() => setIsEditMode(!isEditMode)}
            >
              <FileEdit className="ml-1" size={20} />
            </button>
            <button
              className="border-none focus:outline-none text-rose-500 hover:text-rose-500/80"
              onClick={() => {
                onOpen("deleteNote", {
                  confirmModalTitle: "Delete Note",
                  confirmModalMessage:
                    "Are you sure you want to delete this note?",
                  confirmModalConfirmButtonText: "Delete",
                  confirmModalAction: handleDeleteNote,
                });
              }}
            >
              <Trash className="ml-1" size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Note;
