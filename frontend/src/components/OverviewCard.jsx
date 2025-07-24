export default function OverviewCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center">
      <span className="text-lg font-semibold text-gray-500">{title}</span>
      <span className="text-2xl font-bold text-gray-900 mt-2">{value}</span>
    </div>
  );
}