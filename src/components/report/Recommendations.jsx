import {
  Download,
  RefreshCw,
} from "lucide-react";

export default function Recommendations({ report }) {
  if (!report) return null;

  const risk = report.risk || {};
  const ai = report.ai || {};
  const recommendation =
    ai.recommendation ||
    "Proceed carefully and avoid sharing sensitive information unless you trust the website.";

  const tips =
    risk.level === "Low"
      ? [
          "Website appears safe to visit.",
          "Verify the URL before entering credentials.",
          "Keep your browser updated.",
          "Continue using HTTPS websites."
        ]
      : [
          "Do not enter passwords.",
          "Avoid making payments.",
          "Do not download files.",
          "Verify the domain manually."
        ];

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold">
            Recommendations
          </h2>

          <p className="text-sm text-slate-400">
            AI-generated safety advice
          </p>

        </div>

        <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-400">
          SafeLink AI
        </span>

      </div>

      <div className="mt-8 space-y-4">
        {tips.map((tip) => (
          <div
            key={tip}
            className="rounded-xl border border-slate-800 bg-slate-800/30 p-4"
          >
            {tip}
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
        <h3 className="font-semibold">
          Final Recommendation
        </h3>

        <p className="mt-3 text-slate-300">
          {recommendation}
        </p>
      </div>

      <div className="mt-8 flex gap-4">

        <button
          type="button"
          onClick={() => window.print()}
          className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold flex items-center justify-center gap-2"
        >
          <Download size={18} />
          Print Report
        </button>

        <button
          type="button"
          onClick={() => window.location.assign("/")}
          className="rounded-xl border border-slate-700 px-5"
          aria-label="Start another scan"
        >
          <RefreshCw />
        </button>

      </div>

    </div>
  );
}
