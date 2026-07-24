export default function ScoreCard({ score }) {
  const color =
    score > 80
      ? "text-red-500"
      : score > 50
      ? "text-yellow-400"
      : "text-green-400";

  return (
    <div className="rounded-3xl bg-slate-900 p-8">
      <p className="text-slate-400">Threat Score</p>

      <h1 className={`mt-3 text-7xl font-black ${color}`}>
        {score}
      </h1>

      <div className="mt-5 h-3 rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}