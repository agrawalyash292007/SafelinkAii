import { motion } from "framer-motion";
import {
  Link,
  Brain,
  Shield,
  Globe,
  FileSearch,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    icon: Link,
    title: "Paste URL",
    text: "Enter any suspicious website.",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    text: "ML models inspect the URL.",
  },
  {
    icon: Shield,
    title: "Threat Check",
    text: "VirusTotal + SSL analysis.",
  },
  {
    icon: Globe,
    title: "WHOIS Lookup",
    text: "Domain ownership & age.",
  },
  {
    icon: FileSearch,
    title: "Threat Report",
    text: "Generate complete report.",
  },
  {
    icon: CheckCircle2,
    title: "Stay Safe",
    text: "Decision with confidence.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-28">

      <div className="mx-auto max-w-7xl px-6">

        <p className="text-center uppercase tracking-[0.3em] text-blue-400 text-sm">

          Process

        </p>

        <h2 className="mt-4 text-center text-5xl font-black">

          How SafeLink AI Works

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {steps.map((step, index) => {

            const Icon = step.icon;

            return (

              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl"
              >

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20">

                  <Icon className="text-blue-400" size={32} />

                </div>

                <h3 className="mt-8 text-2xl font-bold">

                  {step.title}

                </h3>

                <p className="mt-4 text-slate-400">

                  {step.text}

                </p>

              </motion.div>

            );

          })}

        </div>

      </div>

    </section>
  );
}