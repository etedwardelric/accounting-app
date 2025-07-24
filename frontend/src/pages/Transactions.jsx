import { useEffect, useState } from "react";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const fetchTransactions = () => {
    fetch("/api/transactions").then(res => res.json()).then(setTransactions);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async () => {
    if (!amount) return;
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(amount), note })
    });
    setAmount("");
    setNote("");
    fetchTransactions();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">账单列表</h2>
      <div className="mb-4 flex gap-2">
        <input
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="金额"
          className="border p-2 rounded w-24"
        />
        <input
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="备注"
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={addTransaction}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          添加
        </button>
      </div>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-2">金额</th>
            <th className="p-2">备注</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id}>
              <td className="p-2">¥{t.amount}</td>
              <td className="p-2">{t.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
