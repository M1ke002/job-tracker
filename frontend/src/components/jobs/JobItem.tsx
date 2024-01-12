import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

import {
  Bookmark,
  MoreVertical,
  ArrowRightCircle,
  ArrowUpRightSquare,
  Settings,
  Trash,
  FileEdit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "@/lib/axiosConfig";

interface JobItemProps {
  id?: number;
  type: "jobListing" | "savedJob";
  jobTitle: string;
  companyName: string;
  additionalInfo: string;
  location: string;
  salary: string;
  jobDescription: string;
  jobUrl: string;
  jobDate: string;
  isNewJob?: boolean;
}

const JobItem = ({
  id,
  type,
  jobTitle,
  companyName,
  additionalInfo,
  location,
  salary,
  jobDescription,
  jobUrl,
  jobDate,
  isNewJob,
}: JobItemProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onSave = async () => {
    try {
      const res = await axios.post("/saved-jobs", {
        jobTitle,
        companyName,
        location,
        jobDescription,
        additionalInfo,
        salary,
        jobUrl,
        jobDate,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card
      className={cn(
        "relative max-w-[680px] my-2 border-[#c3dafe] w-full",
        isNewJob ? "border-[#f1969b]" : "border-[#c3dafe]"
      )}
    >
      <CardHeader>
        <CardTitle className="mb-1 leading-7">
          {/* {jobTitle.length > 75 ? jobTitle.substring(0, 75) + "..." : jobTitle} */}
          {jobTitle}
        </CardTitle>
        <div className="pt-1 flex  items-center flex-wrap">
          <span className="text-sm font-semibold py-1 px-2 border border-blue-400 rounded-md">
            {companyName}
          </span>
          {jobDate && (
            <span className="ml-3 text-xs uppercase text-rose-700 bg-rose-100 p-1 px-2 rounded-md font-bold">
              {jobDate}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="mb-[77px] pb-3">
        <div className="mb-2">
          <p className="text-sm font-semibold">
            {location} {additionalInfo && `· ${additionalInfo}`}
          </p>
          <p className="text-sm">{salary}</p>
        </div>
        <p className="mb-2 text-sm text-zinc-500">
          {jobDescription.length > 250
            ? jobDescription.substring(0, 250) + "..."
            : jobDescription}
          {/* IMC is a leading global market maker, using algorithmic trading and
          advanced technology to buy and sell securities on multiple trading
          venues worldwide. We provide liquidity to the financial markets,
          driving efficiencies for buyers and sellers. */}
        </p>
        {/* <hr className="border-[#d6eaff]" /> */}
      </CardContent>
      <CardFooter className="flex flex-col absolute bottom-0 right-0 left-0">
        <hr className="border-[#d6eaff] mb-3 w-full" />

        <div className="flex items-center space-x-2 mr-auto w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Button
                variant="primary"
                className="mr-2 flex items-center justify-center"
                onClick={() => {
                  if (type === "savedJob") {
                    navigate(`/saved-jobs/${id}`);
                  } else {
                    window.open(jobUrl, "_blank");
                  }
                }}
              >
                <span className="mr-2">View</span>
                {type === "jobListing" ? (
                  <ArrowUpRightSquare size={20} />
                ) : (
                  <ArrowRightCircle size={20} />
                )}
              </Button>
              {type === "savedJob" && (
                <Badge className="text-xs font-bold uppercase py-1 px-3 text-white bg-green-400 hover:bg-initial">
                  Applied
                </Badge>
              )}
              {type === "jobListing" && (
                <Button
                  variant="outlinePrimary"
                  className="mr-2 flex items-center justify-center"
                  disabled={isLoading}
                  onClick={onSave}
                >
                  <span className="mr-2">Save</span>
                  <Bookmark size={20} />
                </Button>
              )}
            </div>

            <div>
              {type === "savedJob" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-md border-none focus:outline-none hover:text-zinc-600">
                      <MoreVertical size={20} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="flex items-center ">
                      <FileEdit size={18} className="mr-2 text-blue-500" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center ">
                      <Trash size={18} className="mr-2 text-rose-500" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {isNewJob && type === "jobListing" && (
                <Badge className="text-xs font-bold uppercase text-white bg-[#cc294e] py-1 px-3 hover:bg-initial">
                  New!
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobItem;
