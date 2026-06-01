import { useRouteError, Link } from "react-router";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

export function GlobalError() {
  const error = useRouteError() as any;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] bg-orange-900/10 rounded-full blur-[128px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-lg w-full bg-gray-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl text-center"
      >
        <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-black mb-3">System Error</h1>
        <p className="text-gray-400 mb-6">
          An unexpected error occurred in the application. We apologize for the inconvenience.
        </p>

        {import.meta.env.DEV && error?.message && (
          <div className="bg-black/50 border border-red-500/20 p-4 rounded-xl text-left mb-8 overflow-x-auto">
            <p className="text-red-400 font-mono text-sm">{error.message}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-white text-black font-bold flex items-center justify-center gap-2 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-5 h-5" /> Reload Page
          </button>
          <Link 
            to="/" 
            className="px-6 py-3 bg-black/50 border border-white/10 text-white font-bold flex items-center justify-center gap-2 rounded-xl hover:bg-black/80 transition-colors"
          >
            <Home className="w-5 h-5" /> Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
