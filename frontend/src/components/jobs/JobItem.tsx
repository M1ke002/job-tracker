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

import { Bookmark, MoreVertical, ArrowRightCircle } from "lucide-react";

const JobItem = () => {
  return (
    <Card className="max-w-[680px] my-2 border-[#c3dafe]">
      <CardHeader>
        <CardTitle className="mb-1">
          Software Developer Internship Program 2023
        </CardTitle>
        <div>
          <span className="font-semibold">Google</span>
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
          <Button className="mr-2 flex items-center justify-center">
            <span className="mr-2">View</span>
            <ArrowRightCircle size={20} />
          </Button>
          <Button
            variant="outline"
            className="mr-2 flex items-center justify-center"
          >
            <span className="mr-2">Save</span>
            <Bookmark size={20} />
          </Button>
        </div>
        <MoreVertical size={20} />
      </CardFooter>
    </Card>
  );
};

export default JobItem;
