import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Registration() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative">
      <Link
        href="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Back Home</span>
      </Link>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Coming Soon</h1>
        <p className="text-gray-400 text-lg">
          Check back later for more information on registering
        </p>
      </div>
    </div>
  );
}
