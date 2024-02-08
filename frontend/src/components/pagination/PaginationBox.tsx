import React, { useEffect, useState } from "react";

import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationBoxProps {
  currentPage: number;
  totalPages: number;
  fetchPage: (page: number) => void;
}

const PaginationBox = ({
  currentPage,
  totalPages,
  fetchPage,
}: PaginationBoxProps) => {
  const [pageButtons, setPageButtons] = useState<
    {
      position: number;
      text: string;
      value: number | null;
    }[]
  >([]);

  useEffect(() => {
    //create array of page numbers. ex. [0,1,2,3,4,5]
    const pagesArray = Array(totalPages)
      .fill(0)
      .map((_, i) => i);

    const renderedPageButtons = [
      {
        position: 1,
        text: "1",
        value: 1,
      },
      {
        position: 2,
        text: currentPage < 4 || pagesArray.length <= 5 ? "2" : "...",
        value: currentPage < 4 || pagesArray.length <= 5 ? 2 : null,
      },
    ];

    if (pagesArray.length > 2) {
      renderedPageButtons.push({
        position: 3,
        text:
          currentPage <= 3 || pagesArray.length <= 5
            ? "3"
            : pagesArray.length > 5 && currentPage + 2 >= pagesArray.length
            ? `${pagesArray[pagesArray.length - 2]}`
            : `${currentPage}`,
        value:
          currentPage <= 3 || pagesArray.length <= 5
            ? 3
            : pagesArray.length > 5 && currentPage + 2 >= pagesArray.length
            ? pagesArray[pagesArray.length - 2]
            : currentPage,
      });
    }

    if (pagesArray.length > 3) {
      renderedPageButtons.push({
        position: 4,
        text:
          pagesArray.length <= 5
            ? "4"
            : currentPage + 2 >= pagesArray.length
            ? `${pagesArray[pagesArray.length - 1]}`
            : "...",
        value:
          pagesArray.length <= 5
            ? 4
            : currentPage + 2 >= pagesArray.length
            ? pagesArray[pagesArray.length - 1]
            : null,
      });
    }

    if (pagesArray.length > 4) {
      renderedPageButtons.push({
        position: 5,
        text: `${pagesArray.length}`,
        value: pagesArray.length,
      });
    }

    setPageButtons(renderedPageButtons);
  }, [totalPages, currentPage]);

  const onPageButtonClick = async (page: number) => {
    if (page === currentPage) {
      return;
    }
    fetchPage(page);
  };

  return (
    <div className="flex items-center justify-center mt-3 mb-2">
      <Button
        variant="outline"
        className={cn(
          "flex items-center rounded-none border-r-0 border-[#c3dafe]",
          currentPage === 1 &&
            "cursor-not-allowed text-zinc-500 dark:text-zinc-500"
        )}
        disabled={currentPage === 1}
        onClick={() => {
          if (currentPage !== 1) {
            onPageButtonClick(currentPage - 1);
          }
        }}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Prev
      </Button>

      {pageButtons.map((button) => {
        return (
          <Button
            key={button.position}
            variant="outline"
            className={cn(
              "rounded-none border-r-0 border-[#c3dafe]",
              currentPage === button.value &&
                "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
            )}
            onClick={() => {
              if (button.value !== null) {
                onPageButtonClick(button.value);
              }
            }}
          >
            {button.text}
          </Button>
        );
      })}

      <Button
        variant="outline"
        className={cn(
          "flex items-center justify-center rounded-none border-[#c3dafe]",
          currentPage === totalPages &&
            "cursor-not-allowed text-zinc-500 dark:text-zinc-500"
        )}
        disabled={currentPage === totalPages}
        onClick={() => {
          if (currentPage !== totalPages) {
            onPageButtonClick(currentPage + 1);
          }
        }}
      >
        Next
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

export default PaginationBox;
