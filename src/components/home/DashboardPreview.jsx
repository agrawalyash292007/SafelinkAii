import { motion } from "framer-motion";
import {
  ShieldAlert,
  Globe,
  Lock,
  Brain,
  Clock,
  Activity,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPreview() {
  return (
    <section className="py-28">

      <div className="mx-auto max-w-7xl px-6">

        <p className="text-center uppercase tracking-[0.3em] text-blue-400 text-sm">
          Product Preview
        </p>

        <h2 className="mt-4 text-center text-5xl font-black">
          AI Threat Dashboard
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-center text-slate-400">
          Every scan generates a complete cybersecurity report
          in less than one second.
        </p>

        <motion.div
          initial={{opacity:0,y:40}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          transition={{duration:.7}}
          className="mt-16 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl"
        >

          <div className="grid gap-8 lg:grid-cols-3">

            {/* LEFT */}

            <div className="rounded-3xl bg-slate-800/60 p-8">

              <ShieldAlert
                size={60}
                className="text-red-500"
              />

              <h2 className="mt-6 text-6xl font-black text-red-500">
                92
              </h2>

              <p className="mt-2 text-red-400">
                High Risk
              </p>

              <div className="mt-8 h-3 rounded-full bg-slate-700">

                <div className="h-3 w-[92%] rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400"/>

              </div>

              <p className="mt-5 text-slate-400">
                Threat Score
              </p>

            </div>

            {/* CENTER */}

            <div className="space-y-5">

              <Card
                icon={<Brain className="text-blue-400"/>}
                title="AI Detection"
                value="Phishing Detected"
              />

              <Card
                icon={<Lock className="text-green-400"/>}
                title="SSL Certificate"
                value="Invalid"
              />

              <Card
                icon={<Globe className="text-yellow-400"/>}
                title="WHOIS"
                value="Registered 2 Days Ago"
              />

              <Card
                icon={<Activity className="text-cyan-400"/>}
                title="VirusTotal"
                value="31 Vendors Flagged"
              />

            </div>

            {/* RIGHT */}

            <div className="rounded-3xl bg-slate-800/60 p-8">

              <h3 className="text-2xl font-bold">
                Scan Summary
              </h3>

              <div className="mt-8 space-y-6">

                <Summary
                  label="AI Confidence"
                  value="98%"
                />

                <Summary
                  label="Response Time"
                  value="0.42 sec"
                />

                <Summary
                  label="Risk Level"
                  value="Critical"
                />

                <Summary
                  label="Recommendation"
                  value="Do Not Visit"
                />

              </div>

              <button className="mt-10 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 font-semibold hover:opacity-90">

                Download Report

              </button>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}

function Card({icon,title,value}){

  return(

    <div className="flex items-center justify-between rounded-2xl bg-slate-800/60 p-5">

      <div>

        <h4 className="font-semibold">
          {title}
        </h4>

        <p className="mt-1 text-slate-400">
          {value}
        </p>

      </div>

      {icon}

    </div>

  )

}

function Summary({label,value}){

  return(

    <div className="flex justify-between border-b border-slate-700 pb-4">

      <span className="text-slate-400">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>

    </div>

  )

}