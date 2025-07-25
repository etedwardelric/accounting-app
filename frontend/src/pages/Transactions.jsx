import { useEffect, useState } from "react";
import { fetchTransactions, addTransaction, fetchMembers } from "../api/api";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

const translations = {
  en: {
    title: "Transactions",
    amount: "Amount",
    note: "Note",
    payer: "Payer",
    participants: "Participants",
    add: "Add",
    totalPayment: "Total Payments",
  },
  zh: {
    title: "账单记录",
    amount: "金额",
    note: "备注",
    payer: "付款人",
    participants: "参与人员",
    add: "添加",
    totalPayment: "付款总额",
  },
};

export default function Transactions({ lang = "en" }) {
  const [transactions, setTransactions] = useState([]);
  const [members, setMembers] = useState([]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [participants, setParticipants] = useState([]);

  const t = translations[lang] || translations.en;

  const loadData = () => {
    fetchTransactions().then(setTransactions);
    fetchMembers().then(setMembers);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async () => {
    if (!amount || !paidBy) return;
    await addTransaction({
      amount: parseFloat(amount),
      note,
      paid_by: parseInt(paidBy),
      participants
    });
    setAmount("");
    setNote("");
    setPaidBy("");
    setParticipants([]);
    loadData();
  };

  const paidMap = {};
  members.forEach(m => paidMap[m.id] = 0);
  transactions.forEach(ti => {
    paidMap[ti.paid_by] += ti.amount;
  });

  const chartData = {
    labels: members.map(m => m.name),
    datasets: [
      {
        label: t.totalPayment,
        data: members.map(m => paidMap[m.id]),
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
        <select value={paidBy} onChange={e => setPaidBy(e.target.value)} className="border p-2 rounded">
          <option value="">{t.payer}</option>
          {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <label className="font-medium">{t.participants}:</label>
        <div className="flex flex-wrap gap-2">
          {members.map(m => (
            <label key={m.id} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={participants.includes(m.id)}
                onChange={() => setParticipants(p => p.includes(m.id) ? p.filter(x => x !== m.id) : [...p, m.id])}
              />
              {m.name}
            </label>
          ))}
        </div>
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">{t.add}</button>
      </div>

      <div className="my-6">
        <Bar data={chartData} options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: t.totalPayment
            }
          }
        }} />
      </div>

      <table className="w-full bg-white rounded shadow mt-4">
        <thead>
          <tr>
            <th className="p-2">{t.amount}</th>
            <th className="p-2">{t.note}</th>
            <th className="p-2">{t.payer}</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(ti => (
            <tr key={ti.id}>
              <td className="p-2">¥{ti.amount}</td>
              <td className="p-2">{ti.note}</td>
              <td className="p-2">{members.find(m => m.id === ti.paid_by)?.name || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
