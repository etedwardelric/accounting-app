import { useEffect, useState } from "react";
import { fetchOverview, fetchMembers, fetchTransactions, fetchReserve } from "../api/api";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, BarElement } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, BarElement);

const translations = {
  en: {
    dashboard: "Statistics Dashboard",
    totalExpense: "Total Expense",
    totalReserve: "Total Reserve",
    balance: "Difference",
    memberPayments: "Member Payments",
    memberReserves: "Member Reserves",
    memberSettlement: "Member Settlement",
  },
  zh: {
    dashboard: "统计仪表盘",
    totalExpense: "总开销",
    totalReserve: "总储备金",
    balance: "差额",
    memberPayments: "成员付款总额",
    memberReserves: "成员储备金",
    memberSettlement: "成员结算分布",
  },
};

export default function Dashboard({ lang = "en" }) {
  const [overview, setOverview] = useState({ totalExpense: 0, totalReserve: 0, members: [] });
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [reserves, setReserves] = useState([]);
  const t = translations[lang] || translations.en;

  useEffect(() => {
    fetchOverview().then(setOverview);
    fetchMembers().then(setMembers);
    fetchTransactions().then(setTransactions);
    fetchReserve().then(setReserves);
  }, []);

  const paidMap = {};
  const reserveMap = {};
  members.forEach(m => {
    paidMap[m.id] = 0;
    reserveMap[m.id] = 0;
  });
  transactions.forEach(ti => { paidMap[ti.paid_by] += ti.amount; });
  reserves.forEach(r => { reserveMap[r.member_id] += r.amount; });

  const expenseChart = {
    labels: members.map(m => m.name),
    datasets: [
      {
        label: t.memberPayments,
        data: members.map(m => paidMap[m.id]),
        backgroundColor: members.map((_, idx) => `hsl(${(idx * 50) % 360}, 60%, 60%)`)
      }
    ]
  };

  const reserveChart = {
    labels: members.map(m => m.name),
    datasets: [
      {
        label: t.memberReserves,
        data: members.map(m => reserveMap[m.id]),
        backgroundColor: members.map((_, idx) => `hsl(${(idx * 70) % 360}, 60%, 60%)`)
      }
    ]
  };

  const balanceChart = {
    labels: overview.members.map(m => m.name),
    datasets: [
      {
        label: t.memberSettlement,
        data: overview.members.map(m => m.balance),
        backgroundColor: overview.members.map((_, idx) => `hsl(${(idx * 90) % 360}, 60%, 60%)`)
      }
    ]
  };

  return (
    <div className="p-4 space-y-8">
      <h2 className="text-2xl font-bold">{t.dashboard}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-semibold text-gray-600">{t.totalExpense}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">¥{overview.totalExpense}</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-semibold text-gray-600">{t.totalReserve}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">¥{overview.totalReserve}</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-semibold text-gray-600">{t.balance}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ¥{(overview.totalReserve - overview.totalExpense).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-bold mb-4">{t.memberPayments}</h3>
          <Bar data={expenseChart} />
        </div>
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-bold mb-4">{t.memberReserves}</h3>
          <Bar data={reserveChart} />
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-bold mb-4">{t.memberSettlement}</h3>
        <Pie data={balanceChart} />
      </div>
    </div>
  );
}
