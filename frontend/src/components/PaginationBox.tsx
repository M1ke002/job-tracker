import React from "react";
import { Button } from "./ui/button";

const PaginationBox = () => {
  return (
    <div className="flex items-center justify-center mt-3 mb-2">
      <Button variant="outline" className="rounded-none border-r-0">
        Prev
      </Button>
      <Button
        variant="outline"
        className="rounded-none bg-green-500 text-white border-r-0"
      >
        1
      </Button>
      <Button variant="outline" className="rounded-none border-r-0">
        2
      </Button>
      <Button variant="outline" className="rounded-none border-r-0">
        3
      </Button>
      <Button variant="outline" className="rounded-none">
        Next
      </Button>
    </div>
  );
};

export default PaginationBox;
