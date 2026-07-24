import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function Scanner() {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleAnalyze = () => {
    let trimmedUrl = url.trim();

    if (!trimmedUrl) {
      alert("Please enter a URL.");
      return;
    }

    if (
      !trimmedUrl.startsWith("http://") &&
      !trimmedUrl.startsWith("https://")
    ) {
      trimmedUrl = "https://" + trimmedUrl;
    }

    navigate(`/analyze?url=${encodeURIComponent(trimmedUrl)}`);
  };

  const demoUrls = [
    "https://google.com",
    "https://github.com",
    "https://amaz0n-login-security.xyz",
  ];

  return (
    <div>
      <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900/80 p-2 backdrop-blur-xl shadow-[0_0_40px_rgba(37,99,235,.15)]">
        <div className="flex items-center">
          <Search className="mx-5 text-blue-400" />

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAnalyze();
            }}
            placeholder="Paste suspicious URL..."
            className="flex-1 bg-transparent py-5 text-lg outline-none placeholder:text-slate-500"
          />

          <button
            onClick={handleAnalyze}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 font-semibold transition hover:scale-105"
          >
            Analyze
          </button>
        </div>
      </div>

      {/* Demo URLs */}

      <div className="mt-6 flex flex-wrap gap-3">
        {demoUrls.map((demo) => (
          <button
            key={demo}
            onClick={() => {
              setUrl(demo);
              navigate(`/analyze?url=${encodeURIComponent(demo)}`);
            }}
            className="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm text-slate-300 transition hover:border-blue-500 hover:text-white"
          >
            {demo}
          </button>
        ))}
      </div>
    </div>
  );
}