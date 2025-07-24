import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Overview from "./pages/Overview";
import Members from "./pages/Members";
import Transactions from "./pages/Transactions";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow p-4">
          <nav className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">记账系统</h1>
            <div className="space-x-4">
              <Link to="/" className="text-blue-600 hover:underline">总览</Link>
              <Link to="/members" className="text-blue-600 hover:underline">成员</Link>
              <Link to="/transactions" className="text-blue-600 hover:underline">账单</Link>
            </div>
          </nav>
        </header>
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/members" element={<Members />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
