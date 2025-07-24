import { useEffect, useState } from "react";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");

  const fetchMembers = () => {
    fetch("/api/members").then(res => res.json()).then(setMembers);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const addMember = async () => {
    if (!name) return;
    await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    setName("");
    fetchMembers();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">成员列表</h2>
      <div className="mb-4 flex gap-2">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="成员名"
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={addMember}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          添加
        </button>
      </div>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-2">姓名</th>
            <th className="p-2">Balance</th>
          </tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.id}>
              <td className="p-2">{m.name}</td>
              <td className={`p-2 ${m.balance > 0 ? "text-red-500" : "text-green-500"}`}>
                ¥{m.balance}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
