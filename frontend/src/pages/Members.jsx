import { useEffect, useState } from "react";
import { fetchMembers, addMember } from "../api/api";

const translations = {
  en: {
    title: "Members",
    name: "Name",
    balance: "Balance",
    add: "Add",
    placeholder: "Enter member name",
  },
  zh: {
    title: "成员列表",
    name: "姓名",
    balance: "余额",
    add: "添加",
    placeholder: "输入成员名",
  },
};

export default function Members({ lang = "en" }) {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const t = translations[lang] || translations.en;

  const loadMembers = () => fetchMembers().then(setMembers);

  useEffect(() => {
    loadMembers();
  }, []);

  const handleAdd = async () => {
    if (!name.trim()) return;
    await addMember(name);
    setName("");
    loadMembers();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{t.title}</h2>
      <div className="mb-4 flex gap-2">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={t.placeholder}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {t.add}
        </button>
      </div>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-2">{t.name}</th>
            <th className="p-2">{t.balance}</th>
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
