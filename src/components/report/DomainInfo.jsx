import {
  Globe,
  Calendar,
  Building2,
  Server,
  Clock3,
} from "lucide-react";

export default function DomainInfo({ report }) {
  if (!report) return null;

  const whois = report.whois || {};
  const dns = report.dns || {};
  const http = report.http || {};

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">

      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-2xl font-bold">
            Domain Information
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Registration and hosting details
          </p>
        </div>

      </div>

      <div className="space-y-5">

        <Info
          icon={<Building2 className="h-5 w-5 text-indigo-400" />}
          title="Registrar"
          value={whois.registrar || "Unknown"}
        />

        <Info
          icon={<Calendar className="h-5 w-5 text-emerald-400" />}
          title="Created"
          value={whois.creation_date || "Unavailable"}
        />

        <Info
          icon={<Calendar className="h-5 w-5 text-orange-400" />}
          title="Expires"
          value={whois.expiration_date || "Unavailable"}
        />

        <Info
          icon={<Clock3 className="h-5 w-5 text-yellow-400" />}
          title="Domain Age"
          value={
            whois.domain_age_years != null
              ? `${whois.domain_age_years} year(s)`
              : "Unknown"
          }
        />

        <Info
          icon={<Globe className="h-5 w-5 text-blue-400" />}
          title="Country"
          value={whois.country || "Unknown"}
        />

        <Info
          icon={<Globe className="h-5 w-5 text-cyan-400" />}
          title="IP Address"
          value={dns.ip_address || dns.ip || "Unavailable"}
        />

        <Info
          icon={<Server className="h-5 w-5 text-purple-400" />}
          title="Server"
          value={http.server || "Unknown"}
        />

      </div>
    </div>
  );
}

function Info({ icon, title, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-4">

      <div className="flex items-center gap-3">

        <div className="rounded-lg bg-slate-800 p-2">
          {icon}
        </div>

        <span className="font-medium">
          {title}
        </span>

      </div>

      <span className="max-w-[55%] text-right text-slate-400 break-all">
        {value}
      </span>

    </div>
  );
}