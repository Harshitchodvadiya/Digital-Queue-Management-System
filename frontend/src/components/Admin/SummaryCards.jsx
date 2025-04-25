import React from "react";
import SummaryCard from "../reusableComponents/SummaryCard";
import { GoClock } from "react-icons/go";
import { LuTimer } from "react-icons/lu";
import { Users } from "lucide-react";
import { IoTicketOutline } from "react-icons/io5";

function SummaryCards({ totalTokens, avgTime, totalStaff, todaysTokens }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-11/12 mt-5 ml-12">
      <SummaryCard title="Total Tokens" value={totalTokens} icon={LuTimer} />
      <SummaryCard title="Avg. Wait Time" value={`${avgTime.mins} min`} icon={GoClock} />
      <SummaryCard title="Staff Members" value={totalStaff} icon={Users} />
      <SummaryCard title="Today's Tokens" value={todaysTokens} icon={IoTicketOutline} />
    </div>
  );
}

export default SummaryCards;