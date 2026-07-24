import { motion } from "framer-motion";
import {
  Bot,
  ShieldAlert,
  Lightbulb,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function AIAnalyst() {
  return (
    <section className="py-28">

      <div className="max-w-7xl mx-auto px-6">

        <p className="text-center uppercase tracking-[0.3em] text-blue-400 text-sm">
          AI Security Analyst
        </p>

        <h2 className="mt-4 text-center text-5xl font-black">

          Don't Just Detect Threats

          <br />

          Understand Them

        </h2>

        <p className="mt-6 max-w-3xl mx-auto text-center text-slate-400">

          SafeLink AI explains every decision using
          artificial intelligence so anyone can understand
          why a website is dangerous.

        </p>

        <motion.div

          initial={{opacity:0,y:40}}

          whileInView={{opacity:1,y:0}}

          viewport={{once:true}}

          className="mt-20 grid lg:grid-cols-2 gap-10"

        >

          {/* LEFT */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl">

            <div className="flex items-center gap-4">

              <Bot
                size={45}
                className="text-blue-400"
              />

              <div>

                <h3 className="text-2xl font-bold">

                  AI Security Analyst

                </h3>

                <p className="text-slate-400">

                  GPT Powered Explanation

                </p>

              </div>

            </div>

            <div className="mt-8 rounded-2xl bg-slate-800/60 p-6 leading-8 text-slate-300">

              This website appears suspicious because
              it impersonates Amazon, uses an unusually
              long domain name, was registered only
              2 days ago, has an invalid SSL certificate,
              and has already been flagged by multiple
              security vendors.

            </div>

          </div>

          {/* RIGHT */}

          <div className="space-y-5">

            <Card
              icon={<ShieldAlert className="text-red-400"/>}
              title="Why is it dangerous?"
              text="Domain registered recently."
            />

            <Card
              icon={<CheckCircle2 className="text-green-400"/>}
              title="What should I do?"
              text="Avoid entering passwords."
            />

            <Card
              icon={<Sparkles className="text-blue-400"/>}
              title="AI Recommendation"
              text="Block this website immediately."
            />

            <Card
              icon={<Lightbulb className="text-yellow-400"/>}
              title="Cyber Tip"
              text="Always verify the URL before logging in."
            />

          </div>

        </motion.div>

      </div>

    </section>
  );
}

function Card({icon,title,text}){

  return(

    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">

      <div className="flex gap-4">

        {icon}

        <div>

          <h3 className="font-bold">

            {title}

          </h3>

          <p className="mt-2 text-slate-400">

            {text}

          </p>

        </div>

      </div>

    </div>

  )

}