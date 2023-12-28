import React from "react";

interface DocumentListTitleProps {
  title: string;
}

const DocumentListTitle = ({ title }: DocumentListTitleProps) => {
  return (
    <div>
      <p className="font-semibold text-lg text-[#3d3d3d]">{title}</p>
    </div>
  );
};

export default DocumentListTitle;
