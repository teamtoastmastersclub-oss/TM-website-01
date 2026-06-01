import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, ShieldCheck, X, Activity, Loader2, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router';

export function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  // OTP Reset State
  const [resetStep, setResetStep] = useState<0|1|2|3>(0);
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        if (data.user.role !== 'admin') {
          setError('Unauthorized: Credentials valid, but account lacks administrative privileges.');
          // Automatically log them out since they just authenticated successfully as user but shouldn't be here
          await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/auth/logout', { method: 'POST', credentials: 'include' });
        } else {
          window.location.href = '/admin'; // Force hard reload into admin panel
        }
      } else {
        setError(data.message || 'Authentication sequence failed.');
      }
    } catch {
      setError('Network connection failed. Verify server status.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true); setResetMessage('');
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/auth/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin: true })
      });
      const data = await res.json();
      if (res.ok) { setResetStep(2); setResetMessage(data.message); }
      else setResetMessage(data.message || 'Failed to dispatch OTP.');
    } catch { setResetMessage('Network error'); } finally { setResetLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true); setResetMessage('');
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/auth/verify-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin: true, otp })
      });
      const data = await res.json();
      if (res.ok) { setResetStep(3); setResetMessage(''); }
      else setResetMessage(data.message || 'Invalid OTP.');
    } catch { setResetMessage('Network error'); } finally { setResetLoading(false); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setResetMessage("Passkeys do not match.");
      return;
    }
    setResetLoading(true); setResetMessage('');
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/auth/reset-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin: true, otp, newPassword })
      });
      const data = await res.json();
      if (res.ok) { 
        setResetStep(0); 
        setFormData({ email: resetEmail, password: '' }); 
        toast.success("Password reset successfully. Please login."); 
      } else {
        setResetMessage(data.message || 'Reset failed.');
      }
    } catch { setResetMessage('Network error'); } finally { setResetLoading(false); }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Background FX */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] bg-amber-900/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 mb-6 shadow-2xl shadow-yellow-500/20">
            <span className="text-3xl font-black text-black">TM<span className="text-white">.</span></span>
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-3">System Override</h1>
          <p className="text-gray-400 font-medium tracking-wide">Enter root credentials to access the Administration Core.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* subtle glow border */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium mb-6 text-center">
              {error}
            </div>
          )}

          {resetStep === 0 ? (
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Identifier</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                  <input
                    type="text"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-yellow-500/50 focus:bg-black/80 transition-all text-sm font-medium"
                    placeholder="Root protocol email or username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center pr-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Passkey</label>
                  <button type="button" onClick={() => setResetStep(1)} className="text-xs font-bold text-yellow-500 hover:text-yellow-400">Forgot Passkey?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-yellow-500/50 focus:bg-black/80 transition-all text-sm font-medium"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-black uppercase tracking-widest py-4 rounded-xl hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Decrypting...
                  </>
                ) : (
                  <>
                    Authenticate <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
             <div className="space-y-5 animate-in fade-in zoom-in duration-300">
                {resetMessage && (
                  <div className={`p-4 rounded-xl text-sm font-bold border ${resetMessage.includes('success') ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {resetMessage}
                  </div>
                )}
                
                {resetStep === 1 && (
                  <form onSubmit={handleRequestOtp} className="space-y-5">
                    <p className="text-sm text-gray-400 mb-6 text-center">Click below to dispatch a secure 2FA recovery OTP to the root administrator's inbox.</p>
                    <button type="submit" disabled={resetLoading} className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 flex justify-center">{resetLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Dispatch Admin OTP'}</button>
                  </form>
                )}

                {resetStep === 2 && (
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <p className="text-sm text-gray-400 mb-6">Enter the 6-digit OTP sent to {resetEmail}</p>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">One-Time Passcode</label>
                       <input type="text" required value={otp} onChange={e => setOtp(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-yellow-500/50 font-mono text-center text-xl tracking-[0.5em]" maxLength={6} placeholder="000000" />
                    </div>
                    <button type="submit" disabled={resetLoading} className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 flex justify-center">{resetLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}</button>
                  </form>
                )}

                {resetStep === 3 && (
                  <form onSubmit={handleResetPassword} className="space-y-5">
                    <p className="text-sm text-gray-400 mb-6">OTP Verified. Create a new cryptography passkey.</p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">New Passkey</label>
                         <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-yellow-500/50" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Repeat Passkey</label>
                         <input type="password" required value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-yellow-500/50" />
                      </div>
                    </div>
                    <button type="submit" disabled={resetLoading} className="w-full bg-yellow-500 text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 flex justify-center">{resetLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Passkey'}</button>
                  </form>
                )}

                <button onClick={() => { setResetStep(0); setResetMessage(''); }} className="w-full text-center text-sm font-bold text-gray-500 hover:text-white transition-colors mt-4">Cancel Recovery</button>
             </div>
          )}
          
          <div className="mt-8 text-center pt-6 border-t border-white/10">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-white transition-colors">
              <LinkIcon className="w-3 h-3" /> Return to Public Sector
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
