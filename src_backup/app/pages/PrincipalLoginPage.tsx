import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock, Loader2, KeyRound } from 'lucide-react';
import { motion } from 'motion/react';

export function PrincipalLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/superadmin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/principal-dashboard');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans p-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white text-black p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <KeyRound className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-8">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Principal Access</h1>
          <p className="text-gray-500 mb-8 font-medium">Secure SuperAdmin Authentication.</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Username</label>
              <input type="text" required value={username} onChange={e=>setUsername(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium" placeholder="admin" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Password</label>
              <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium" placeholder="••••••••" />
            </div>
            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">{error}</div>}
            <button type="submit" disabled={loading} className="w-full mt-4 bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
              Authenticate
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
