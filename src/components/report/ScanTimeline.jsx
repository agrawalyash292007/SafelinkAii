import {
  CheckCircle2,
  Clock3,
  ShieldCheck,
} from "lucide-react";

export default function ScanTimeline({ report }) {
  if (!report) return null;

  const scanTime = report.scan_time || "Completed";

  const steps = [
    {
      title: "URL Validation",
      status: "Completed",
      detail: report.normalized_url || report.url,
    },
    {
      title: "SSL Certificate Check",
      status: report.ssl?.valid ? "Secure" : "Issue Detected",
      detail: report.ssl?.valid
        ? "Valid SSL Certificate"
        : "SSL verification failed",
    },
    {
      title: "WHOIS Lookup",
      status: "Completed",
      detail: report.whois?.registrar || "WHOIS data retrieved",
    },
    {
      title: "DNS Resolution",
      status: "Completed",
      detail:
        report.dns?.ip_address ||
        report.dns?.ip ||
        "DNS records resolved",
    },
    {
      title: "VirusTotal Analysis",
      status: "Completed",
      detail:
        report.virustotal?.summary ||
        "Reputation analysis completed",
    },
    {
      title: "AI Threat Analysis",
      status: report.risk?.level || "Completed",
      detail: report.ai?.summary || "AI analysis finished",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">

      <div className="flex items-center justify-between mb-8">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-green-500/10 p-3">
            <ShieldCheck className="text-green-400" />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              Scan Timeline
            </h2>

            <p className="text-sm text-slate-400">
              Security analysis completed successfully
            </p>
          </div>

        </div>

        <div className="rounded-xl bg-slate-800 px-4 py-2">

          <p className="text-xs text-slate-400">
            Scan Time
          </p>

          <p className="font-bold text-green-400">
            {scanTime}
          </p>

        </div>

      </div>

      <div className="space-y-4">

        {steps.map((step, index) => (

          <div
            key={index}
            className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-800/40 p-5 transition-all duration-300 hover:border-blue-500 hover:bg-slate-800"
          >

            <div className="flex items-center gap-4">

              <div className="rounded-full bg-green-500/10 p-2">

                <CheckCircle2
                  className="text-green-400"
                  size={20}
                />

              </div>

              <div>

                <h3 className="font-semibold">
                  {step.title}
                </h3>

                <p className="text-sm text-slate-400">
                  {step.detail}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-2">

              <Clock3
                size={16}
                className="text-slate-400"
              />

              <span
                className={`text-sm font-medium ${
                  step.status === "Issue Detected"
                    ? "text-red-400"
                    : step.status === "High"
                    ? "text-red-400"
                    : step.status === "Medium"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                {step.status}
              </span>

            </div>

          </div>

        ))}

      </div>

      <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">

        <p className="text-sm leading-6 text-slate-300">

          SafeLink AI completed URL validation, SSL verification,
          WHOIS lookup, DNS analysis, VirusTotal reputation checks,
          URLScan inspection, and AI-powered phishing detection
          before generating this security report.

        </p>

      </div>

    </div>
  );
}