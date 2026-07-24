import { motion } from "framer-motion";
import Scanner from "./Scanner";

import {
  Shield,
  Globe,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-28">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">

        {/* LEFT */}

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-400">
            <Shield size={16} />
            AI Powered Threat Intelligence
          </div>

          <h1 className="mt-8 text-5xl xl:text-6xl font-black leading-[1.05]">
            Detect{" "}
            <span className="text-blue-500">
              Fake URLs
            </span>

            <br />

            Before They Fool You
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">
            Analyze suspicious URLs using AI,
            Machine Learning,
            VirusTotal,
            WHOIS,
            SSL,
            DNS,
            and phishing intelligence in seconds.
          </p>

          {/* Scanner */}

          <Scanner />

          {/* Feature Chips */}

          <div className="mt-6 flex flex-wrap gap-3">
            {[
              "AI Detection",
              "VirusTotal",
              "WHOIS",
              "SSL",
              "DNS",
            ].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm text-slate-300"
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Stats */}

          <div className="mt-12 grid grid-cols-3 gap-6">
            <Stat number="99.8%" label="Accuracy" />
            <Stat number="1.2M+" label="URLs Scanned" />
            <Stat number="52K+" label="Threats Blocked" />
          </div>

        </motion.div>

        {/* RIGHT */}

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-[0_0_70px_rgba(37,99,235,.12)] backdrop-blur-xl">

            <div className="flex justify-between">

              <div>

                <p className="text-slate-400">
                  Threat Intelligence Report
                </p>

                <h2 className="mt-2 text-7xl font-black text-red-500">
                  92
                </h2>

                <p className="mt-2 text-red-400">
                  High Risk
                </p>

              </div>

              <Globe
                size={72}
                className="text-blue-500"
              />

            </div>

            <div className="mt-8 h-3 rounded-full bg-slate-800">
              <div className="h-3 w-[92%] rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">

              <MiniCard
                title="AI Confidence"
                value="98%"
                color="text-blue-400"
              />

              <MiniCard
                title="Scan Time"
                value="0.42s"
                color="text-green-400"
              />

            </div>

            <div className="mt-8 space-y-4">

              <Status
                title="VirusTotal"
                value="Clean"
                icon={<CheckCircle2 className="text-green-400" />}
              />

              <Status
                title="WHOIS"
                value="New Domain"
                icon={<AlertTriangle className="text-yellow-400" />}
              />

              <Status
                title="SSL Certificate"
                value="Invalid"
                icon={<XCircle className="text-red-400" />}
              />

              <Status
                title="AI Detection"
                value="Phishing Detected"
                icon={<Sparkles className="text-blue-400" />}
              />

            </div>

            <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 font-semibold transition hover:opacity-90">

              View Full Report

              <ArrowRight size={18} />

            </button>

          </div>

        </motion.div>

      </div>
    </section>
  );
}

function Stat({ number, label }) {
  return (
    <div>
      <h2 className="text-4xl font-black">{number}</h2>
      <p className="mt-2 text-slate-500">{label}</p>
    </div>
  );
}

function MiniCard({ title, value, color }) {
  return (
    <div className="rounded-2xl bg-slate-800/60 p-4">
      <p className="text-sm text-slate-400">{title}</p>
      <h3 className={`mt-2 text-3xl font-bold ${color}`}>
        {value}
      </h3>
    </div>
  );
}

function Status({ title, value, icon }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-800/60 p-4">
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-slate-400">{value}</p>
      </div>

      {icon}
    </div>
  );
}