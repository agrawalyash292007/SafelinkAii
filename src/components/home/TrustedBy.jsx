import { Shield, Globe, Lock, Brain, Database } from "lucide-react";
import { motion } from "framer-motion";

const tools = [
  {
    icon: Shield,
    title: "VirusTotal",
    subtitle: "70+ AV Engines",
  },
  {
    icon: Globe,
    title: "Google Safe Browsing",
    subtitle: "Real-Time Threats",
  },
  {
    icon: Lock,
    title: "SSL Labs",
    subtitle: "Certificate Analysis",
  },
  {
    icon: Database,
    title: "WHOIS",
    subtitle: "Domain Intelligence",
  },
  {
    icon: Brain,
    title: "AI Engine",
    subtitle: "ML Risk Detection",
  },
];

export default function TrustedBy() {
  return (
    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{opacity:0,y:40}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          transition={{duration:.6}}
        >

          <p className="text-center text-blue-400 uppercase tracking-[0.25em] text-sm">

            Powered By

          </p>

          <h2 className="mt-4 text-center text-5xl font-black">

            Trusted Detection Sources

          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-center text-slate-400">

            SafeLink AI combines multiple cybersecurity
            intelligence providers to generate one
            unified threat report.

          </p>

        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-5">

          {tools.map((tool)=>{

            const Icon=tool.icon;

            return(

              <motion.div

                key={tool.title}

                whileHover={{y:-8}}

                className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl transition"

              >

                <Icon
                  className="text-blue-400"
                  size={42}
                />

                <h3 className="mt-6 text-xl font-bold">

                  {tool.title}

                </h3>

                <p className="mt-2 text-slate-400">

                  {tool.subtitle}

                </p>

              </motion.div>

            )

          })}

        </div>

      </div>

    </section>
  );
}