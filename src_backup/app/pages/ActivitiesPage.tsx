import { PublicActivities } from "../components/PublicActivities";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export function ActivitiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-black overflow-x-hidden w-full relative">
      <div className="absolute top-8 left-8 z-50">
         <Link to="/" className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 shadow-sm border border-gray-200 rounded-xl text-black font-bold transition-all text-sm">
           <ArrowLeft className="w-4 h-4" /> Go Back
         </Link>
      </div>
      <div className="py-20">
        <PublicActivities />
      </div>
    </div>
  );
}
