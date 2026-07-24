import { Clipboard } from "lucide-react";

export default function CopyReportButton({ report }) {
  const copyReport = async () => {
    const text = `
SafeLink AI Security Report

URL: ${report.url}

Risk Level: ${report.risk.level}
Risk Score: ${report.risk.score}/100

SSL: ${report.ssl.valid ? "Valid" : "Invalid"}

Registrar: ${report.whois.registrar}

Domain Age: ${report.whois.domain_age_years} years

VirusTotal
Malicious: ${report.virustotal.malicious}
Suspicious: ${report.virustotal.suspicious}

Recommendation:
${report.ai.recommendation}
`;

    await navigator.clipboard.writeText(text);

    alert("Report copied!");
  };

  return (
    <button
      onClick={copyReport}
      className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
    >
      <Clipboard size={18} />
      Copy Report
    </button>
  );
}