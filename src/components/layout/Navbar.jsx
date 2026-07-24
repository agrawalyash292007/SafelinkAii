import { Shield } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-950/70 backdrop-blur-xl">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        <div className="flex items-center gap-3">

          <Shield className="text-blue-500" />

          <h1 className="text-2xl font-bold">

            SafeLink AI

          </h1>

        </div>

        <div className="hidden lg:flex gap-10 text-slate-300">

          <a href="#">Features</a>

          <a href="#">Threat Feed</a>

          <a href="#">Dashboard</a>

          <a href="#">Docs</a>

          <a href="#">GitHub</a>

        </div>

        <button className="rounded-xl bg-blue-600 px-6 py-3 hover:bg-blue-700">

          Get Started

        </button>

      </div>

    </nav>
  );
}