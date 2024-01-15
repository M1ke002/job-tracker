import React from "react";
import { Button } from "../ui/button";

const PaginationBox = () => {
  return (
    <div className="flex items-center justify-center mt-3 mb-2">
      <Button
        variant="outline"
        className="rounded-none border-r-0 border-[#c3dafe]"
      >
        Prev
      </Button>
      <Button
        variant="outline"
        className="rounded-none bg-blue-500 text-white border-r-0 border-[#c3dafe]"
      >
        1
      </Button>
      <Button
        variant="outline"
        className="rounded-none border-r-0 border-[#c3dafe]"
      >
        2
      </Button>
      <Button
        variant="outline"
        className="rounded-none border-r-0 border-[#c3dafe]"
      >
        3
      </Button>
      <Button variant="outline" className="rounded-none border-[#c3dafe]">
        Next
      </Button>
    </div>
  );
};

export default PaginationBox;
