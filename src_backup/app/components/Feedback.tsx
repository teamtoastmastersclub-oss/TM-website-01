import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { Star, Send, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { toast } from 'sonner';
import LiquidEther from "./LiquidEther";

export function Feedback() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    role: "",
    feedback: "",
    rating: 5,
  });

  const [queryData, setQueryData] = useState({
    name: "",
    branch: "",
    sem: "",
    description: "",
  });

  const [recentFeedbacks, setRecentFeedbacks] = useState<any[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [queryLoading, setQueryLoading] = useState(false);

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/feedbacks/recent")
      .then(res => res.json())
      .then(data => { setRecentFeedbacks(data); setLoadingFeedbacks(false); })
      .catch(err => { console.error(err); setLoadingFeedbacks(false); });
  }, []);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackLoading(true);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/feedbacks", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: feedbackData.name,
          branch: feedbackData.role.split(',')[1]?.trim() || "Unknown",
          sem: feedbackData.role.split(',')[0]?.trim() || "Unknown",
          feedback: feedbackData.feedback
        })
      });
      if (res.ok) {
        const data = await res.json();
        setRecentFeedbacks(prev => [data.feedback, ...prev].slice(0, 4));
        setFeedbackData({ name: "", role: "", feedback: "", rating: 5 });
        toast.success("Feedback submitted successfully!");
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch(err) {
      toast.error("Error submitting feedback");
    } finally { setFeedbackLoading(false); }
  };

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQueryLoading(true);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/queries", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: queryData.name,
          branch: queryData.branch,
          sem: queryData.sem,
          description: queryData.description
        })
      });
      if (res.ok) {
        setQueryData({ name: "", branch: "", sem: "", description: "" });
        toast.success("Query sent successfully!");
      } else {
        throw new Error("Failed to send query");
      }
    } catch(err) {
      toast.error("Error sending query");
    } finally { setQueryLoading(false); }
  };

  const handleStarClick = (rating: number) => {
    setFeedbackData({ ...feedbackData, rating });
  };

  return (
    <section id="feedback" ref={ref} className="py-10 md:py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-20"
        >
          <span className="text-sm uppercase tracking-widest text-gray-500 mb-4 block">
            Connect With Us
          </span>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Feedback & Support
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our members have to say, or share your own experience
          </p>
        </motion.div>

        {/* Recent Feedbacks Display */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={isInView ? { opacity: 1, y: 0 } : {}}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="max-w-7xl mx-auto mb-10 md:mb-20 relative"
        >
          <div className="flex justify-between items-end mb-8">
            <h3 className="text-3xl md:text-4xl font-bold">Recent Feedbacks</h3>
            <Link to="/feedbacks" className="hidden md:flex text-sm font-bold text-black border-b border-black hover:text-yellow-600 hover:border-yellow-600 items-center gap-2 transition-all pb-1 mb-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          {/* Desktop Display: Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
             {loadingFeedbacks ? (
               <div className="col-span-3 flex justify-center py-10"><Loader2 className="animate-spin text-yellow-500" /></div>
             ) : recentFeedbacks.length === 0 ? (
               <div className="col-span-3 text-center text-gray-500 py-10">No recent feedbacks.</div>
             ) : recentFeedbacks.slice(0, 3).map((fb, i) => (
               <div key={fb._id || i} className="bg-white border border-gray-100 p-8 hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col group rounded-xl">
                  <div className="flex gap-1 mb-6">
                    {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform" />)}
                  </div>
                  <p className="text-gray-600 mb-8 flex-grow leading-relaxed">"{fb.feedback}"</p>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 bg-black flex items-center justify-center font-bold text-white text-lg rounded-full">
                      {fb.studentName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h4 className="font-bold text-black">{fb.studentName}</h4>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{fb.sem}, {fb.branch}</p>
                    </div>
                  </div>
               </div>
             ))}
          </div>

          {/* Mobile Display: Stack View */}
          <div className="flex md:hidden flex-col gap-6 pb-8 pt-4">
             {loadingFeedbacks ? (
               <div className="flex justify-center py-10"><Loader2 className="animate-spin text-yellow-500" /></div>
             ) : recentFeedbacks.length === 0 ? (
               <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-xl border border-gray-100">No recent feedbacks yet. Be the first!</div>
             ) : recentFeedbacks.slice(0, 3).map((fb, i) => (
               <div 
                 key={fb._id || i} 
                 className="bg-white border border-gray-100 p-6 shadow-md shadow-black/5 flex flex-col group rounded-xl"
               >
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-gray-700 mb-6 flex-grow leading-relaxed text-sm">"{fb.feedback}"</p>
                  
                  <div className="flex items-center gap-4 mt-auto border-t border-gray-100 pt-4">
                    <div className="w-10 h-10 bg-black flex items-center justify-center font-bold text-white text-sm rounded-full bg-gradient-to-br from-black to-gray-800">
                      {fb.studentName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h4 className="font-bold text-black text-sm">{fb.studentName}</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{fb.sem}, {fb.branch}</p>
                    </div>
                  </div>
               </div>
             ))}
          </div>

          {/* Mobile View All button placed beautifully at bottom */}
          <div className="mt-12 flex justify-center md:hidden pb-4">
            <Link to="/feedbacks" className="px-6 py-3 bg-black text-white font-medium text-sm rounded-full flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-black/20">
              View All Experiences <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Left - Original Feedback Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="bg-gray-50 p-6 md:p-8 border border-gray-200 flex flex-col h-full"
          >
            <h3 className="text-2xl font-bold mb-6">Submit Your Feedback</h3>
            
            <form className="flex flex-col h-full" onSubmit={handleFeedbackSubmit}>
              <div className="space-y-6 mb-8 flex-grow">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={feedbackData.name}
                  onChange={(e) => setFeedbackData({ ...feedbackData, name: e.target.value })}
                  placeholder="Eg: Anusha Appajigol"
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                />
              </div>

              {/* Year & Branch */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year & Branch
                </label>
                <input
                  type="text"
                  value={feedbackData.role}
                  onChange={(e) => setFeedbackData({ ...feedbackData, role: e.target.value })}
                  placeholder="e.g. Final Year, CSE"
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= feedbackData.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Feedback
                </label>
                <textarea
                  value={feedbackData.feedback}
                  onChange={(e) => setFeedbackData({ ...feedbackData, feedback: e.target.value })}
                  placeholder="Share your experience with us..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors resize-none"
                />
              </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit" disabled={feedbackLoading}
                className="w-full px-8 py-4 bg-black text-white font-medium transition-all duration-300 flex items-center justify-center gap-3 group mt-auto hover:bg-gray-900 disabled:opacity-50 relative overflow-hidden rounded-sm"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <LiquidEther
                    colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                    mouseForce={20}
                    cursorSize={100}
                    isViscous
                    viscous={30}
                    autoDemo
                  />
                </div>
                <span className="group-hover:-translate-x-1 transition-transform duration-300 relative z-10">{feedbackLoading ? 'Submitting...' : 'Submit Feedback'}</span>
                {!feedbackLoading && <ArrowRight className="w-5 h-5 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 group-hover:translate-x-1 transition-all duration-300 relative z-10" />}
              </button>
            </form>
          </motion.div>

          {/* Right - New Support/Query Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-50 p-6 md:p-8 border border-gray-200 flex flex-col h-full"
          >
            <h3 className="text-2xl font-bold mb-6">Send a Query</h3>
            
            <form className="flex flex-col h-full" onSubmit={handleQuerySubmit}>
              <div className="space-y-6 mb-8 flex-grow">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={queryData.name}
                  onChange={(e) => setQueryData({ ...queryData, name: e.target.value })}
                  placeholder="Eg: Basavraj kagale"
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                />
              </div>

              {/* Branch & Sem */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch
                  </label>
                  <input
                    type="text"
                    value={queryData.branch}
                    onChange={(e) => setQueryData({ ...queryData, branch: e.target.value })}
                    placeholder="e.g. CSE"
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester
                  </label>
                  <input
                    type="text"
                    value={queryData.sem}
                    onChange={(e) => setQueryData({ ...queryData, sem: e.target.value })}
                    placeholder="e.g. 5th Sem"
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Description / Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={queryData.description}
                  onChange={(e) => setQueryData({ ...queryData, description: e.target.value })}
                  placeholder="Type your query or support request here..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors resize-none"
                />
              </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit" disabled={queryLoading}
                className="w-full px-8 py-4 bg-black text-white font-medium transition-all duration-300 flex items-center justify-center gap-3 group mt-auto hover:bg-gray-900 disabled:opacity-50 relative overflow-hidden rounded-sm"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <LiquidEther
                    colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                    mouseForce={20}
                    cursorSize={100}
                    isViscous
                    viscous={30}
                    autoDemo
                  />
                </div>
                <span className="group-hover:-translate-x-1 transition-transform duration-300 relative z-10">{queryLoading ? 'Sending...' : 'Send Message'}</span>
                {!queryLoading && <ArrowRight className="w-5 h-5 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 group-hover:translate-x-1 transition-all duration-300 relative z-10" />}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
