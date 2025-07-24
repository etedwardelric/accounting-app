import { useEffect, useState } from "react";
import { fetchReserve, addReserve, fetchMembers } from "../api/api";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

const translations = {
  en: {
    title: "Reserve Fund",
    amount: "Amount",
    note: "Note",
    member: "Member",
    add: "Add",
    totalReserve: "Total Reserve",
  },
  zh: {
    title: "备用金记录",
    amount: "金额",
    note: "备注",
    member: "成员",
    add: "添加",
    totalReserve: "储备金总额",
  },
};

export default function ReserveFund({ lang = "en" }) {
  const [reserves, setReserves] = useState([]);
  const [members, setMembers] = useState([]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [memberId, setMemberId] = useState("");
  const t = translations[lang] || translations.en;

  const loadData = () => {
    fetchReserve().then(setReserves);
    fetchMembers().then(setMembers);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async () => {
    if (!amount || !memberId) return;
    await addReserve({
      member_id: parseInt(memberId),
      amount: parseFloat(amount),
      note
    });
    setAmount("");
    setNote("");
    setMemberId("");
    loadData();
  };

  const reserveMap = {};
  members.forEach(m => reserveMap[m.id] = 0);
  reserves.forEach(r => {
    reserveMap[r.member_id] += r.amount;
  });

  const chartData = {
    labels: members.map(m => m.name),
    datasets: [
      {
        label: t.totalReserve,
        data: members.map(m => reserveMap[m.id]),
        backgroundColor: members.map((_, idx) =>
          `hsl(${(idx * 50) % 360}, 60%, 60%)`
        )
      }
    ]
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{t.title}</h2>
      <div className="mb-4 flex flex-col gap-2">
        <input value={amount} onChange={e => setAmount(e.target.value)} placeholder={t.amount} className="border p-2 rounded" />
        <input value={note} onChange={e => setNote(e.target.value)} placeholder={t.note} className="border p-2 rounded" />
        <select value={memberId} onChange={e => setMemberId(e.target.value)} className="border p-2 rounded">
          <option value="">{t.member}</option>
          {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">{t.add}</button>
      </div>

      <div className="my-6">
        <Bar data={chartData} options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: t.totalReserve
            }
          }
        }} />
      </div>

      <table className="w-full bg-white rounded shadow mt-4">
        <thead>
          <tr>
            <th className="p-2">{t.amount}</th>
            <th className="p-2">{t.note}</th>
            <th className="p-2">{t.member}</th>
          </tr>
        </thead>
        <tbody>
          {reserves.map(r => (
            <tr key={r.id}>
              <td className="p-2">¥{r.amount}</td>
              <td className="p-2">{r.note}</td>
              <td className="p-2">{members.find(m => m.id === r.member_id)?.name || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
