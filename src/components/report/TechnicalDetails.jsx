import {
  Server,
  Globe,
  Lock,
  Wifi,
  FileCode,
  Hash,
} from "lucide-react";

export default function TechnicalDetails({ report }) {
  if (!report) return null;

  const dns = report.dns || {};
  const http = report.http || {};
  const ssl = report.ssl || {};

  const details = [
    {
      icon: <Globe className="text-blue-400" />,
      label: "IP Address",
      value: dns.ipv4 || dns.ipv6 || "Not Available",
    },
    {
      icon: <Lock className="text-green-400" />,
      label: "Protocol",
      value: ssl.valid ? "HTTPS" : "HTTP / Invalid SSL",
    },
    {
      icon: <Server className="text-purple-400" />,
      label: "Server",
      value: http.server || "Not Available",
    },
    {
      icon: <Wifi className="text-cyan-400" />,
      label: "Port",
      value: ssl.valid ? "443" : "80",
    },
    {
      icon: <FileCode className="text-yellow-400" />,
      label: "Content Type",
      value: http.content_type || "Not Available",
    },
    {
      icon: <Hash className="text-pink-400" />,
      label: "HTTP Status",
      value:
        http.status_code
          ? `${http.status_code} ${http.reason || ""}`
          : "Not Available",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">
          Technical Details
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Network and protocol information collected during analysis.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {details.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-800 bg-slate-800/40 p-5 transition-all duration-300 hover:border-blue-500 hover:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-900 p-2">
                {item.icon}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-400">
                  {item.label}
                </p>

                <h3 className="mt-1 break-all font-semibold text-white">
                  {item.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}