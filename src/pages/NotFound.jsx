import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#030712] text-white flex items-center justify-center px-6">
      <div className="text-center">
        <ShieldAlert className="mx-auto mb-6 text-red-500" size={72} />

        <h1 className="text-7xl font-black">404</h1>

        <p className="mt-4 text-slate-400">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}