import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Activity, ArrowRight } from "lucide-react";

export function PublicActivities() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data.filter((e:any) => e.status === 'past'));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="activities" className="py-24 bg-gray-50 text-black">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500 animate-pulse">Loading Activities...</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} className="bg-white/50 rounded-2xl p-8 border border-gray-100 animate-pulse h-64 flex flex-col justify-between">
                <div className="w-10 h-10 bg-gray-200 rounded-xl mb-6"></div>
                <div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-6"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section id="activities" className="py-32 bg-gray-50 text-black min-h-[50vh] flex flex-col items-center justify-center">
        <Activity className="w-16 h-16 text-gray-300 mb-6" />
        <h2 className="text-3xl font-bold mb-4 text-center">No Activity Records</h2>
        <p className="text-gray-500 text-center max-w-sm">There are no past events or highlighted activities available at this time. Please check back later!</p>
      </section>
    );
  }

  return (
    <section id="activities" className="py-24 bg-gray-50 text-black">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 text-center">Past Activity Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {events.map(ev => (
            <Link to={`/event/${ev._id}`} key={ev._id} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all block group cursor-pointer">
               <Activity className="w-10 h-10 text-amber-500 mb-6" />
               <h3 className="text-2xl font-bold mb-4 group-hover:text-amber-600 transition-colors line-clamp-2">{ev.title}</h3>
               <p className="text-gray-500 whitespace-pre-wrap mb-6">{ev.description}</p>
               <div className="flex items-center text-sm font-bold text-amber-600">
                 Read Full Cover Story <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
               </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
