import React, { useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDownCircle, Sparkles } from "lucide-react";

import { useModal } from "@/stores/useModal";
import { useCurrentSavedJob } from "@/stores/useCurrentSavedJob";

interface TaskProps {
  jobId: string;
}

const Keywords = ({ jobId }: TaskProps) => {
  // const { currentSavedJob, setCurrentSavedJob } = useCurrentSavedJob();
  const { onOpen } = useModal();
  const [rotateChevron, setRotateChevron] = useState(false);
  const handleRotate = () => setRotateChevron(!rotateChevron);
  const rotate = rotateChevron ? "rotate(-180deg)" : "rotate(0)";
  return (
    <Collapsible defaultOpen={true}>
      <div className="p-6 bg-white border border-[#dbe9ff] w-full shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold mb-2">Keywords</h2>
          <CollapsibleTrigger>
            <ChevronDownCircle
              className="text-blue-600 cursor-pointer transition"
              style={{ transform: rotate, transition: "all 0.2s linear" }}
              size={23}
              onClick={handleRotate}
            />
          </CollapsibleTrigger>
        </div>
        <hr className="my-2 border-[#d6eaff]" />
        <CollapsibleContent>
          <div className="flex items-center justify-center text-gray-400 py-4">
            No keywords extracted from job description
          </div>
          <Button variant="primary" className="mt-2 w-full" onClick={() => {}}>
            <Sparkles size={20} className="mr-2" />
            Extract Keywords
          </Button>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default Keywords;
