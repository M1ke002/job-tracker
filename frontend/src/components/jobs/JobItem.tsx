import React from "react";
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
import { useNavigate } from "react-router-dom";

import {
  Bookmark,
  MoreVertical,
  ArrowRightCircle,
  ArrowUpRightSquare,
} from "lucide-react";

interface JobItemProps {
  type: "job" | "savedJob";
}

const JobItem = ({ type }: JobItemProps) => {
  const navigate = useNavigate();
  return (
    <Card className="max-w-[680px] my-2 border-[#c3dafe]">
      <CardHeader>
        <CardTitle className="mb-1">
          Software Developer Internship Program 2023
        </CardTitle>
        <div className="pt-1">
          <span className="font-semibold py-1 px-2 border border-blue-400 rounded-md">
            Google
          </span>
          <span className="ml-3 text-xs uppercase text-rose-700 bg-rose-100 p-1 px-2 rounded-md font-bold">
            Closing in a month
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <p className="text-sm">Sydney NSW, Australia · Internship</p>
          <p className="text-sm">60,000 - 70,000$/year</p>
        </div>
        <p className="mb-2 text-sm text-zinc-500">
          IMC is a leading global market maker, using algorithmic trading and
          advanced technology to buy and sell securities on multiple trading
          venues worldwide. We provide liquidity to the financial markets,
          driving efficiencies for buyers and sellers.
        </p>
        <Separator className="bg-[#d6eaff]" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="primary"
            className="mr-2 flex items-center justify-center"
            onClick={() => {
              if (type === "savedJob") {
                navigate("/saved-jobs/1");
              }
            }}
          >
            <span className="mr-2">View</span>
            {type === "job" ? (
              <ArrowUpRightSquare size={20} />
            ) : (
              <ArrowRightCircle size={20} />
            )}
          </Button>
          {type === "job" && (
            <Button
              variant="outlinePrimary"
              className="mr-2 flex items-center justify-center"
            >
              <span className="mr-2">Save</span>
              <Bookmark size={20} />
            </Button>
          )}
        </div>
        {type === "savedJob" && <MoreVertical size={20} />}
      </CardFooter>
    </Card>
  );
};

export default JobItem;
