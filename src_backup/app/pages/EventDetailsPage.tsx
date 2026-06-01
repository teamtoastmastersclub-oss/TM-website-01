import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
// Removed Header and Footer imports for clean UI
import { Loader2, Calendar, MapPin, Clock, Trophy, Image as ImageIcon, CheckCircle, Award, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/events/${id}`);
        if (res.ok) {
          setEvent(await res.json());
        } else {
          navigate('/'); // redirect home if invalid
        }
      } catch (err) {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!event) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-black font-sans">
      
      {/* Event Header */}
      <div className="bg-black text-white pt-24 pb-20 px-4 relative">
        <div className="absolute top-8 left-8">
           <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white font-bold transition-all text-sm">
             <ArrowLeft className="w-4 h-4" /> Navigate Back
           </button>
        </div>
        <div className="max-w-5xl mx-auto text-center mt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-amber-500 mb-6">
              {event.status === 'past' ? 'Archived Event' : 'Upcoming Event'}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif leading-tight">{event.title}</h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">{event.description}</p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-gray-300">
               <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-xl"><Calendar className="w-4 h-4 text-amber-500" /> {event.date}</div>
               <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-xl"><Clock className="w-4 h-4 text-amber-500" /> {event.timeFrom} - {event.timeTo}</div>
               <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-xl"><MapPin className="w-4 h-4 text-amber-500" /> {event.venue}</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex-grow max-w-5xl mx-auto w-full px-4 -mt-10 pb-24 relative z-10 flex flex-col gap-8">
        
        {/* Rules & Req container */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-black/5 border border-gray-100">
           <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-amber-500" /> Rules & Requirements</h3>
           <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.rules}</p>
        </div>

        {/* Winners Showcase */}
        {event.status === 'past' && event.winners && event.winners.length > 0 && (
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-black/5 border border-gray-100">
             <div className="text-center mb-10">
               <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-4" />
               <h2 className="text-3xl font-bold mb-2">Session Winners</h2>
               <p className="text-gray-500">Commemorating the outstanding performers of the event.</p>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
               {event.winners.map((win: any, i: number) => {
                 const u = win.user; // Auto populated user profile
                 if (!u) return null;
                 return (
                   <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i*0.1 }} key={i} className="group relative bg-gray-50 border border-gray-100 p-6 rounded-2xl flex flex-col items-center text-center overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 text-amber-500/20 group-hover:scale-110 transition-transform"><Award className="w-20 h-20" /></div>
                      <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl mb-4 relative z-10 overflow-hidden bg-white flex items-center justify-center">
                        {win.image ? <img src={win.image} alt="Winner" className="w-full h-full object-cover" /> : (u.profileImage ? <img src={u.profileImage} alt="Winner" className="w-full h-full object-cover" /> : <div className="text-3xl font-bold text-gray-300">{u.fullName.charAt(0)}</div>)}
                      </div>
                      {win.title && <div className="bg-amber-100 text-amber-800 text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full mb-3 relative z-10">{win.title}</div>}
                      <h4 className="font-bold text-lg relative z-10">{u.fullName}</h4>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1 mb-2 relative z-10">{u.usn}</p>
                      <span className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase relative z-10">{u.branch} - Sem {u.sem}</span>
                   </motion.div>
                 )
               })}
             </div>
          </div>
        )}

        {/* Gallery */}
        {event.status === 'past' && event.gallery && event.gallery.length > 0 && (
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-black/5 border border-gray-100">
             <div className="flex items-center gap-3 mb-8">
               <ImageIcon className="w-6 h-6 text-gray-400" />
               <h2 className="text-2xl font-bold">Event Highlights</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {event.gallery.map((url: string, idx: number) => (
                 <div key={idx} className="aspect-square bg-gray-100 rounded-2xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer">
                   <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                 </div>
               ))}
             </div>
          </div>
        )}

      </div>

    </div>
  );
}
