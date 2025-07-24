import OverviewCard from "../components/OverviewCard";
import { useEffect, useState } from "react";

export default function Overview() {
  const [overview, setOverview] = useState({ totalExpense: 0, totalReserve: 0, totalBalance: 0 });

  useEffect(() => {
    fetch("/api/overview").then(res => res.json()).then(setOverview);
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <OverviewCard title="总开销" value={`¥${overview.totalExpense}`} />
      <OverviewCard title="备用金" value={`¥${overview.totalReserve}`} />
      <OverviewCard title="结算差额" value={`¥${overview.totalBalance}`} />
    </div>
  );
}