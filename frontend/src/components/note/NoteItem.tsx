import { FileEdit, Trash } from "lucide-react";
import { useModal } from "@/hooks/zustand/useModal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

const Note = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [value, setValue] = useState(
    "<h3><strong>Interview questions</strong></h3><ul><li>What is the difference between a div and a span?</li><li>How to reverse a linked list?</li><li>What is Javascript?</li></ul><p><strong>Other important notes:</strong></p><p>Prepare your blurb or “tell me about yourself” response (it sucks, I know )</p><p>Practice answering behavioral interview questions. Research the company and your interviewers. Set up your virtual interview space and test your tech Send thank you emails within 24 hours</p>"
  );

  useEffect(() => {
    console.log(value);
  }, [value]);

  const { onOpen } = useModal();
  return (
    <>
      {isEditMode && (
        <div className="flex flex-col">
          <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            className="job-note-quill"
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
      {!isEditMode && (
        <div className="relative p-3 rounded-md shadow-sm bg-[#f1f6fa] border border-[#c3dafe]">
          <div dangerouslySetInnerHTML={{ __html: value }}>
            {/* <strong>Interview questions</strong> <br />
            <ul className="list-disc list-inside">
              <li>What is the difference between a div and a span?</li>
              <li>How to reverse a linked list?</li>
              <li>What is Javascript?</li>
            </ul>
            <strong>Other important notes</strong> <br />
            <p>Prepare your blurb or “tell me about yourself” response</p>
            <p>
              Practice answering behavioral interview questions. Research the
              company and your interviewers. Set up your virtual interview space
              and test your tech Send thank you emails within 24 hours
            </p> */}
          </div>

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
                  confirmModalAction: () => {
                    console.log("delete note");
                  },
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
