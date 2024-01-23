import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface UploadFileZoneProps {}

const UploadFileZone = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const onImageChange = (file: File) => {
    //check if file is an image
    if (file.type.startsWith("image/")) {
      console.log("not accepted file type");
      return;
    }
    //check if file is too large (larger than 4MB)
    if (file.size > 4000000) {
      console.log("file is too large");
      return;
    }
    let reader = new FileReader();
    console.log(file);
    reader.onload = (e) => {
      const { result } = e.target as any;
      if (result) {
        console.log(result);
        // setImageData({
        //   src: result,
        //   file: file,
        // });
      }
    };
    reader.readAsDataURL(file);
  };

  // triggers when file is dropped
  const handleDrop = function (e: any) {
    console.log("dropped!!!");
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageChange(e.dataTransfer.files[0]);
    }
  };

  // handle drag events
  const handleDrag = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      console.log("drag enter or over");
      setDragActive(true);
    } else if (e.type === "dragleave") {
      console.log("drag leave");
      setDragActive(false);
    }
  };

  return (
    <div>
      {/* Hiddden input field to open pdf file */}
      <Input
        type="file"
        className="hidden"
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ref={inputFileRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onImageChange(e.target.files[0]);
          }
        }}
      />
      <div
        className={cn(
          "flex justify-center items-center w-full h-40 border-2 border-[#b4cffa] border-dashed rounded-md hover:bg-[#e6f0fd]",
          dragActive && "border-blue-500"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputFileRef.current?.click()}
      >
        <div className="flex flex-col items-center">
          <p className="text-blue-700 text-sm font-semibold cursor-pointer">
            Choose files or drag and drop
          </p>
          <p className="text-zinc-500 text-xs cursor-pointer">File (4MB)</p>
        </div>
      </div>
    </div>
  );
};

export default UploadFileZone;
