import {
  AlertTriangle,
  ShieldAlert,
  Globe,
  Clock3,
  Lock,
  CheckCircle2,
} from "lucide-react";

export default function ThreatIndicators({ report }) {
  if (!report) return null;

  const indicators = [];

  // Backend risk reasons
  report?.risk?.reasons?.forEach((reason) => {
    indicators.push({
      title: reason,
      desc: "Detected by SafeLink AI risk engine.",
      severity:
        report.risk.level === "High"
          ? "High"
          : report.risk.level === "Medium"
          ? "Medium"
          : "Low",
      icon: <AlertTriangle className="h-6 w-6 text-red-400" />,
      color:
        report.risk.level === "High"
          ? "bg-red-500/20 text-red-400 border-red-500/30"
          : report.risk.level === "Medium"
          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
          : "bg-green-500/20 text-green-400 border-green-500/30",
    });
  });

  // SSL
  if (report?.ssl && report.ssl.valid === false) {
    indicators.push({
      title: "SSL Certificate Invalid",
      desc: "HTTPS certificate could not be verified.",
      severity: "High",
      icon: <Lock className="h-6 w-6 text-red-400" />,
      color: "bg-red-500/20 text-red-400 border-red-500/30",
    });
  }

  // WHOIS
  if (
    report?.whois &&
    (report.whois.privacy_protected || report.whois.hidden)
  ) {
    indicators.push({
      title: "WHOIS Privacy Enabled",
      desc: "Registrant details are hidden.",
      severity: "Medium",
      icon: <Globe className="h-6 w-6 text-blue-400" />,
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    });
  }

  // Recently registered
  if (
    report?.whois?.domain_age_years !== undefined &&
    report.whois.domain_age_years < 1
  ) {
    indicators.push({
      title: "Recently Registered Domain",
      desc: `Domain age: ${report.whois.domain_age_years} year(s).`,
      severity: "Medium",
      icon: <Clock3 className="h-6 w-6 text-yellow-400" />,
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    });
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Threat Indicators</h2>

          <p className="mt-1 text-sm text-slate-400">
            Risk signals identified during analysis
          </p>
        </div>

        <div className="rounded-xl bg-red-500/10 px-4 py-2">
          <span className="text-red-400 font-semibold">
            {indicators.length} Indicator
            {indicators.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {indicators.length === 0 ? (
        <div className="rounded-2xl border border-green-700 bg-green-900/20 p-6 text-center">
          <ShieldAlert className="mx-auto mb-3 h-10 w-10 text-green-400" />

          <h3 className="text-lg font-semibold text-green-400">
            No Major Threat Indicators
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            SafeLink AI did not detect any significant phishing indicators.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {indicators.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-800 bg-slate-800/40 p-5 transition-all duration-300 hover:border-blue-500 hover:bg-slate-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="rounded-xl bg-slate-900 p-3">
                    {item.icon}
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${item.color}`}
                >
                  {item.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-2xl bg-slate-800/60 p-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-green-400" />

          <p className="text-sm text-slate-300">
            Generated using SSL, WHOIS, DNS, HTTP checks, VirusTotal,
            URLScan, and the SafeLink AI risk engine.
          </p>
        </div>
      </div>
    </div>
  );
}