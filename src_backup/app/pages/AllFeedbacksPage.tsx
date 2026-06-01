import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Star, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router";

export function AllFeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/feedbacks")
      .then(res => res.json())
      .then(data => {
        setFeedbacks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch feedbacks", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white text-black py-24 w-full">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 relative"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Member Experiences.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl font-light">
            Read transparent, real feedback from our community members about their journey and growth within the club.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mb-4" />
              <p className="text-gray-500 font-medium">Loading member experiences...</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-500 font-medium bg-gray-50 rounded-2xl border border-gray-100">
              No feedback has been submitted yet. Be the first!
            </div>
          ) : (
            feedbacks.map((fb, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-gray-50 border border-gray-200 p-8 hover:bg-white hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 flex flex-col group cursor-default"
              >
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform" />)}
                </div>
                <p className="text-gray-800 mb-8 flex-grow leading-relaxed font-medium">"{fb.feedback}"</p>
                
                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-200">
                  <div className="w-12 h-12 bg-black flex items-center justify-center font-bold text-white text-lg rounded-full group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                    {fb.studentName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h4 className="font-bold text-black">{fb.studentName}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{fb.sem}, {fb.branch}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
