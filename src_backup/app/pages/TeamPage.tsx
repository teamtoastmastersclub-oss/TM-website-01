import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, Award, UserCheck, Star } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";

export function TeamPage() {
  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/team')
      .then(res => res.json())
      .then(data => setTeamData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-black" />
      </div>
    );
  }

  // Safe checks
  const principal = teamData?.principal || {};
  const faculties = teamData?.faculties || [];
  const coordinators = teamData?.coordinators || [];

  return (
    <div className="min-h-screen bg-neutral-50 text-black overflow-x-hidden w-full relative font-sans pattern-bg">
      <div className="absolute top-8 left-8 z-50">
         <Link to="/" className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 shadow-sm border border-gray-200 rounded-xl text-black font-bold transition-all text-sm group">
           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Go Back
         </Link>
      </div>
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">CORE <span className="text-amber-500">TEAM.</span></h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">The visionaries, mentors, and hard-working student leaders who make KLECET Toastmasters Club exceptional.</p>
        </motion.div>

        {/* Principal Section */}
        {principal?.name && (
          <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{delay:0.1}} className="max-w-4xl mx-auto mb-32 bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col md:flex-row gap-12 items-center relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -z-10 group-hover:bg-amber-500/20 transition-colors"></div>
             
             {principal.image ? (
               <div className="w-48 h-48 md:w-72 md:h-72 shrink-0 rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl relative">
                 <img src={principal.image} alt={principal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               </div>
             ) : (
               <div className="w-48 h-48 md:w-72 md:h-72 shrink-0 rounded-[2rem] bg-gray-100 border-8 border-white shadow-2xl flex items-center justify-center">
                 <Award className="w-20 h-20 text-gray-300" />
               </div>
             )}
             
             <div className="text-center md:text-left">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-widest mb-4">
                 <Star className="w-3 h-3" /> {principal.title || 'Principal'}
               </div>
               <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">{principal.name}</h2>
               <p className="text-gray-600 leading-relaxed text-lg font-medium relative">
                 <span className="text-6xl text-gray-200 absolute -top-6 -left-4 -z-10 font-serif">"</span>
                 {principal.message}
               </p>
             </div>
          </motion.div>
        )}

        {/* Faculty Advisers Section */}
        {faculties.length > 0 && (
          <div className="mb-32">
            <h3 className="text-2xl md:text-3xl font-black mb-12 text-center flex items-center justify-center gap-3">
              FACULTY ADVISERS <div className="h-1 w-12 bg-amber-500 rounded-full"></div>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
               {faculties.map((fac: any, idx: number) => (
                 <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1 * idx}} key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center group hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-50 shadow-inner mb-6 relative">
                       {fac.image ? <img src={fac.image} className="w-full h-full object-cover" /> : <UserCheck className="w-full h-full p-8 text-gray-300 bg-gray-50" />}
                    </div>
                    <h4 className="text-xl font-black mb-1">{fac.name}</h4>
                    <p className="text-xs text-amber-600 font-bold uppercase tracking-widest">Adviser</p>
                 </motion.div>
               ))}
            </div>
          </div>
        )}

        {/* Student Coordinators Section */}
        {coordinators.length > 0 && (
          <div>
            <h3 className="text-2xl md:text-3xl font-black mb-12 text-center flex items-center justify-center gap-3">
              STUDENT COORDINATORS <div className="h-1 w-12 bg-black rounded-full"></div>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {coordinators.map((coord: any, idx: number) => (
                 <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{delay:0.05 * idx}} key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:border-black transition-colors relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-gray-900 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl origin-top-right">
                       {coord.title}
                    </div>
                    <div className="w-24 h-24 mt-4 mx-auto rounded-full overflow-hidden border-2 border-gray-100 mb-4 bg-gray-50">
                       {coord.profileImage ? <img src={coord.profileImage} className="w-full h-full object-cover" /> : <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${coord.name || coord.usn}&backgroundColor=000000`} className="w-full h-full object-cover" />}
                    </div>
                    <h4 className="font-black text-lg truncate w-full">{coord.name}</h4>
                    <p className="text-xs text-gray-500 font-mono mt-1">{coord.usn}</p>
                    {coord.branch && coord.sem && (
                      <div className="mt-4 pt-4 border-t border-gray-100 w-full flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                         <span>{coord.branch}</span>
                         <span>SEM {coord.sem}</span>
                      </div>
                    )}
                 </motion.div>
               ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Pattern CSS */}
      <style>{`
        .pattern-bg {
          background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
          background-size: 32px 32px;
        }
      `}</style>
    </div>
  );
}
