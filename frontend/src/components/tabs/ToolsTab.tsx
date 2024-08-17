import React from "react";

import ToolItem from "../tools/ToolItem";

const tools = [
  {
    toolName: "Cover letter",
    toolDescription:
      "Generates a personalized cover letter to the hiring manager, explaining why you are good fit for the position. Based on the job description, your uploaded CV, and an optional cover letter template.",
    buttonMessage: "Generate cover letter",
    buttonTextColor: "#ff8c00",
  },
  {
    toolName: "Interview preparation questions",
    toolDescription:
      "Generates possible questions you may be asked during the job interview based on the job description.",
    buttonMessage: "Generate interview questions",
    buttonTextColor: "#0070fb",
  },
];

const ToolsTab = () => {
  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 min-h-[200px]">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4 w-full pt-1">
      {tools.map((tool) => (
        <ToolItem
          key={tool.toolName}
          toolName={tool.toolName}
          toolDescription={tool.toolDescription}
          buttonMessage={tool.buttonMessage}
          buttonTextColor={tool.buttonTextColor}
        />
      ))}
    </div>
  );
};

export default ToolsTab;
