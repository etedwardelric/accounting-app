import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Members from "./pages/Members";
import Transactions from "./pages/Transactions";
import ReserveFund from "./pages/ReserveFund";
import Overview from "./pages/Overview";
import Dashboard from "./pages/Dashboard";

const translations = {
  en: {
    dashboard: "Dashboard",
    overview: "Overview",
    transactions: "Transactions",
    reserve: "Reserve Fund",
    members: "Members",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    language: "Language",
  },
  zh: {
    dashboard: "仪表盘",
    overview: "概览",
    transactions: "账单",
    reserve: "备用金",
    members: "成员",
    darkMode: "暗黑模式",
    lightMode: "明亮模式",
    language: "语言",
  },
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const t = translations[lang];

  return (
    <Router>
      <div className={\`min-h-screen \${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}\`}>
        <nav className={\`shadow p-4 flex gap-4 \${darkMode ? "bg-gray-800" : "bg-white"}\`}>
          <Link to="/dashboard" className="hover:text-blue-400">{t.dashboard}</Link>
          <Link to="/overview" className="hover:text-blue-400">{t.overview}</Link>
          <Link to="/transactions" className="hover:text-blue-400">{t.transactions}</Link>
          <Link to="/reserve" className="hover:text-blue-400">{t.reserve}</Link>
          <Link to="/members" className="hover:text-blue-400">{t.members}</Link>
          <div className="ml-auto flex gap-2">
            <select
              value={lang}
              onChange={e => setLang(e.target.value)}
              className="border p-1 rounded bg-gray-200 dark:bg-gray-700"
            >
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              {darkMode ? t.lightMode : t.darkMode}
            </button>
          </div>
        </nav>
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard lang={lang} />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/transactions" element={<Transactions lang={lang} />} />
            <Route path="/reserve" element={<ReserveFund lang={lang} />} />
            <Route path="/members" element={<Members lang={lang} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
