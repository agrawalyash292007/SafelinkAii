export default function InfoCard({
  title,
  value,
  color = "text-white",
}) {
  return (
    <div className="rounded-2xl bg-slate-900 p-6">
      <p className="text-slate-400">{title}</p>

      <h2 className={`mt-3 text-2xl font-bold ${color}`}>
        {value}
      </h2>
    </div>
  );
}