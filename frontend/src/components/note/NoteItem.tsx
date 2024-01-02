import { FileEdit, Trash } from "lucide-react";
import React from "react";

const Note = () => {
  return (
    <div className="relative p-3 rounded-md shadow-sm bg-[#f1f6fa] border border-[#c3dafe]">
      <strong>Interview questions</strong> <br />
      <ul className="list-disc list-inside">
        <li>What is the difference between a div and a span?</li>
        <li>How to reverse a linked list?</li>
        <li>What is Javascript?</li>
      </ul>
      <strong>Other important notes</strong> <br />
      <p>Prepare your blurb or “tell me about yourself” response</p>
      <p>
        Practice answering behavioral interview questions. Research the company
        and your interviewers. Set up your virtual interview space and test your
        tech Send thank you emails within 24 hours
      </p>
      <div className="absolute top-3 right-3 flex items-center space-x-1">
        <button className="border-none focus:outline-none text-blue-700 hover:text-blue-700/80">
          <FileEdit className="ml-1" size={20} />
        </button>
        <button className="border-none focus:outline-none text-rose-500 hover:text-rose-500/80">
          <Trash className="ml-1" size={20} />
        </button>
      </div>
    </div>
  );
};

export default Note;
