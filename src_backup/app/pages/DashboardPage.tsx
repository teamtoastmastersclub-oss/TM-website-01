import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import { Activity, Bell, Calendar, Calendar as CalendarIcon, ChevronRight, Download, FileText, Image as ImageIcon, MapPin, Search, Star, Trash2, Trophy, Upload, User as UserIcon, LogOut, CheckCircle, ShieldAlert, Loader2, Menu, X, Shield, Clock, Camera, KeyRound, Mail, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'attendance' | 'profile' | 'security' | 'certificates'>('events');
  const [myCertificates, setMyCertificates] = useState<any[]>([]);

  // Profile Form State
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', mobile: '', branch: '', sem: '', usn: '', profileImage: '' });
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security Form State
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passMessage, setPassMessage] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  // Reset Password State
  const [resetFlow, setResetFlow] = useState<'idle' | 'otp' | 'newpass'>('idle');
  const [resetOtp, setResetOtp] = useState('');
  const [resetNewPass, setResetNewPass] = useState('');
  const [resetConfirmNewPass, setResetConfirmNewPass] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, eventsRes, certRes] = await Promise.all([
          fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/users/me', { credentials: 'include' }),
          fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/events').catch(() => ({ ok: false } as Response)),
          fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/certificates/my', { credentials: 'include' }).catch(() => ({ ok: false } as Response))
        ]);

        if (userRes.ok) {
          const data = await userRes.json();
          setUser(data);
          setFormData({
            fullName: data.fullName || '',
            email: data.email || '',
            mobile: data.mobile || '',
            branch: data.branch || '',
            sem: data.sem || '',
            usn: data.usn || '',
            profileImage: data.profileImage || ''
          });
          
          // If events fetched successfully
          if (eventsRes.ok) {
             const evData = await eventsRes.json();
             setEvents(evData);
          }
          if (certRes.ok) {
             const cData = await certRes.json();
             setMyCertificates(cData);
          }
          
        } else {
          navigate('/login');
        }
      } catch (err) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage('');
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Failed to update profile.');
      }
    } catch {
      setMessage('Network error.');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/auth/logout', { credentials: 'include', method: 'POST' });
    navigate('/login');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassMessage("New passwords don't match");
      return;
    }
    // Password strength check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{"':;?/>.<,])(?=.*[^\s]).{8,}$/;
    if (!passwordRegex.test(passForm.newPassword)) {
      setPassMessage("New password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }

    setPassLoading(true); setPassMessage('');
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/users/me/password', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ oldPassword: passForm.oldPassword, newPassword: passForm.newPassword })
      });
      const data = await res.json();
      if (res.ok) {
         setPassMessage("success: Password changed securely.");
         setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
         setPassMessage(data.message || "Failed to change password.");
      }
    } catch { setPassMessage("Network error."); } finally { setPassLoading(false); }
  };

  const handleRequestOTP = async () => {
    setResetLoading(true); setResetMessage('');
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/auth/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usn: user?.usn })
      });
      const data = await res.json();
      if (res.ok) { setResetFlow('otp'); setResetMessage('success: ' + data.message); }
      else setResetMessage(data.message);
    } catch { setResetMessage("Network error."); } finally { setResetLoading(false); }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true); setResetMessage('');
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/auth/verify-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usn: user?.usn, otp: resetOtp })
      });
      const data = await res.json();
      if (res.ok) { setResetFlow('newpass'); setResetMessage('success: ' + data.message); }
      else setResetMessage(data.message);
    } catch { setResetMessage("Network error."); } finally { setResetLoading(false); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetNewPass !== resetConfirmNewPass) {
      setResetMessage("Passkeys do not match.");
      return;
    }
    // Password strength check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{"':;?/>.<,])(?=.*[^\s]).{8,}$/;
    if (!passwordRegex.test(resetNewPass)) {
      setResetMessage("New password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }

    setResetLoading(true); setResetMessage('');
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/auth/reset-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usn: user?.usn, newPassword: resetNewPass, otp: resetOtp })
      });
      const data = await res.json();
      if (res.ok) { 
        setResetFlow('idle'); 
        setResetMessage('success: ' + data.message); 
        setResetOtp(''); setResetNewPass(''); setResetConfirmNewPass('');
      } else setResetMessage(data.message);
    } catch { setResetMessage("Network error."); } finally { setResetLoading(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin w-8 h-8 text-black" /></div>;

  const upcomingActivities = events.filter(e => e.status === 'upcoming');
  const pastActivities = events.filter(e => e.status === 'past');
  const myActivities = events.filter(e => e.status === 'past');

  return (
    <div className="min-h-screen bg-white text-black flex overflow-hidden font-sans">
      
      {/* Mobile Top Header containing Hamburger */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white border-b border-gray-100 z-20 px-6 py-4 flex items-center justify-between">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <div className="font-bold text-xl tracking-tight">KLECET<span className="text-amber-500">.</span></div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-gray-50 border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-gray-200 flex justify-between items-center bg-white">
           <div>
             <div className="font-bold text-2xl tracking-tight">KLECET<span className="text-amber-500">.</span></div>
             <p className="text-[10px] text-gray-500 tracking-widest font-semibold uppercase mt-1">Dashboard</p>
           </div>
           <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-gray-400 hover:text-black">
             <X className="w-5 h-5" />
           </button>
        </div>
        
        <div className="p-6 flex flex-col gap-2 flex-grow">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">Menu</p>
          
          <button 
            onClick={() => { setActiveTab('events'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'events' ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-600 hover:bg-gray-200/50 hover:text-black'}`}
          >
            <CalendarIcon className="w-5 h-5" /> Events
          </button>

          <button 
            onClick={() => { setActiveTab('attendance'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'attendance' ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-600 hover:bg-gray-200/50 hover:text-black'}`}
          >
            <Activity className="w-5 h-5" /> My Activities
          </button>

          <button 
            onClick={() => { setActiveTab('certificates'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'certificates' ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-600 hover:bg-gray-200/50 hover:text-black'}`}
          >
            <Award className="w-5 h-5" /> My Certificates
          </button>
          
          <button 
            onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'profile' ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-600 hover:bg-gray-200/50 hover:text-black'}`}
          >
            <UserIcon className="w-5 h-5" /> Manage Profile
          </button>

          <button 
            onClick={() => { setActiveTab('security'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'security' ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-600 hover:bg-gray-200/50 hover:text-black'}`}
          >
            <Shield className="w-5 h-5" /> Security & Access
          </button>
        </div>

        <div className="p-6 border-t border-gray-200 bg-white">
           <div className="flex items-center gap-3 mb-6">
             {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
             ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-black to-gray-800 flex items-center justify-center text-white font-bold text-sm">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
             )}
             <div className="overflow-hidden">
               <h4 className="font-bold text-sm truncate">{user?.fullName}</h4>
               <p className="text-xs text-gray-500 truncate">{user?.email}</p>
             </div>
           </div>
           <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
           </button>
        </div>
      </div>

      {/* Main Content View */}
      <div className="flex-1 h-screen overflow-y-auto pt-20 md:pt-0 bg-white">
        <div className="p-6 md:p-12 max-w-5xl mx-auto w-full">
           
           {activeTab === 'events' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
               <h1 className="text-3xl md:text-4xl font-bold mb-2">Club Events</h1>
               <p className="text-gray-500 mb-10">Discover upcoming workshops and review past sessions.</p>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div>
                   <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-amber-500"></span> Upcoming Activities
                   </h2>
                   <div className="flex flex-col gap-6">
                     {upcomingActivities.length === 0 ? (
                       <div className="p-8 text-center text-sm font-medium text-gray-500 bg-gray-50/50 border border-gray-100 rounded-2xl">
                         No upcoming activities scheduled yet.
                       </div>
                     ) : (
                       upcomingActivities.map(act => (
                         <div key={act._id} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-black/5 hover:border-gray-200 transition-all group">
                           {act.banner && (
                             <div className="w-full h-48 rounded-xl overflow-hidden bg-gray-100 mb-6 border border-gray-100">
                               <img src={act.banner} className="w-full h-full object-cover" />
                             </div>
                           )}
                           <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider rounded-lg mb-4">Upcoming</div>
                           <h3 className="text-lg font-bold mb-4 group-hover:text-amber-600 transition-colors">{act.title}</h3>
                           <p className="text-sm text-gray-500 mb-4 whitespace-pre-wrap">{act.description}</p>
                           <div className="space-y-2 text-sm text-gray-500">
                             <div className="flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> {act.date}</div>
                             <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {act.timeFrom} - {act.timeTo}</div>
                             <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {act.venue}</div>
                           </div>
                         </div>
                       ))
                     )}
                   </div>
                 </div>

                 <div>
                   <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-gray-300"></span> Past Events
                   </h2>
                   <div className="flex flex-col gap-4">
                     {pastActivities.length === 0 ? (
                       <div className="p-8 text-center text-sm font-medium text-gray-500 bg-gray-50/50 border border-gray-100 rounded-2xl">
                         No past events found.
                       </div>
                     ) : (
                       pastActivities.map(act => (
                         <Link to={`/event/${act._id}`} key={act._id} className="block hover:-translate-y-1 transition-transform">
                           <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors bg-white shadow-sm">
                             <div className="flex items-center gap-4 mb-2 sm:mb-0">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                  <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900">{act.title}</h4>
                                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{act.winners?.length || 0} Winners • {act.gallery?.length || 0} Photos</p>
                                </div>
                             </div>
                             <div className="text-sm font-medium text-gray-500 sm:text-right ml-14 sm:ml-0">
                               {act.date}
                             </div>
                           </div>
                         </Link>
                       ))
                     )}
                   </div>
                 </div>
               </div>
             </motion.div>
           )}

           {activeTab === 'attendance' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
               <h1 className="text-3xl md:text-4xl font-bold mb-2">My Activities</h1>
               <p className="text-gray-500 mb-10">Track your attendance and participation history.</p>
               
               <div className="mb-6">
                 {myActivities.length === 0 ? (
                   <div className="p-12 text-center bg-gray-50 rounded-2xl border border-gray-100">
                     <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                     <h3 className="text-lg font-bold text-gray-600 mb-2">Attendance System</h3>
                     <p className="text-sm text-gray-500 max-w-md mx-auto">Your attendance records will be displayed here once an admin marks your presence during club activities.</p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {myActivities.map(act => {
                          const attended = act.attendees?.some((a: any) => a._id === user?._id || a === user?._id);
                          return (
                            <div key={act._id} className={`p-6 rounded-2xl border relative overflow-hidden ${attended ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                              <div className="absolute top-0 right-0 p-4 opacity-10">
                                {attended ? <CheckCircle className="w-24 h-24 text-green-600" /> : <X className="w-24 h-24 text-red-600" />}
                              </div>
                              <div className="relative z-10">
                                <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg mb-4 ${attended ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                  {attended ? 'Attended Event' : 'Absent Session'}
                                </span>
                                <h3 className={`text-lg font-bold mb-2 ${attended ? 'text-green-900' : 'text-red-900'}`}>{act.title}</h3>
                                <p className={`text-sm mb-4 line-clamp-2 ${attended ? 'text-green-800' : 'text-red-800'}`}>{act.description}</p>
                                <div className={`text-sm font-medium ${attended ? 'text-green-700' : 'text-red-700'}`}>{act.date} • {act.venue}</div>
                              </div>
                            </div>
                          );
                       })}
                     </div>
                 )}
               </div>
             </motion.div>
           )}

           {activeTab === 'certificates' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">My Certificates</h1>
                <p className="text-gray-500 mb-10">View and download your earned certificates.</p>

                <div className="mb-6">
                  {myCertificates.length === 0 ? (
                    <div className="p-12 text-center bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center">
                      <Award className="w-12 h-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-bold text-gray-600 mb-2">No Certificates Found</h3>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto">You have not been issued any certificates yet. Participate in events to earn them!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {myCertificates.map(c => (
                         <div key={c._id} className="p-8 rounded-2xl border border-gray-200 bg-white hover:border-black transition-all group relative overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                               <Award className="w-32 h-32" />
                            </div>
                            <div className="relative z-10">
                               <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                                 <Award className="w-6 h-6" />
                               </div>
                               <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">{c.description}</h3>
                               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Date Issued: {new Date(c.issuedAt).toLocaleDateString()}</p>
                            </div>
                            <a href={c.fileData} download={`Certificate-${c.usn}.jpeg`} className="relative z-10 w-full bg-gray-50 hover:bg-gray-100 text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mt-4">
                              <Download className="w-4 h-4"/> Download Asset
                            </a>
                         </div>
                       ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
               <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Profile</h1>
               <p className="text-gray-500 mb-10">Update your academic details and profile picture.</p>
               
               <form onSubmit={handleUpdate} className="max-w-2xl bg-white border border-gray-100 p-8 rounded-2xl shadow-xl shadow-black/5">
                 
                 <div className="mb-8 flex flex-col items-center sm:flex-row sm:items-start md:items-center gap-6 pb-8 border-b border-gray-100">
                   <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                     {formData.profileImage ? (
                        <img src={formData.profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-md group-hover:opacity-75 transition-opacity" />
                     ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400 border-4 border-gray-50 shadow-md group-hover:opacity-75 transition-opacity">
                          <UserIcon className="w-8 h-8 opacity-50 mb-1" />
                        </div>
                     )}
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white mb-1" />
                        <span className="text-[10px] text-white font-bold tracking-wider uppercase">Upload</span>
                     </div>
                     <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                   </div>
                   <div className="text-center sm:text-left">
                     <h3 className="font-bold text-lg">Profile Image</h3>
                     <p className="text-xs text-gray-500 mt-1 max-w-xs">Supports JPG, PNG limit removed. Wait for upload to conclude.</p>
                     {formData.profileImage && (
                       <button type="button" onClick={() => setFormData({ ...formData, profileImage: '' })} className="text-xs text-red-500 font-medium mt-2 hover:underline">
                         Remove Image
                       </button>
                     )}
                   </div>
                 </div>

                 <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Full Name</label>
                       <input name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium text-gray-900" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Email Address</label>
                       <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium text-gray-900" />
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">University Seat Number (USN)</label>
                       <input name="usn" value={formData.usn} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium text-gray-900 uppercase" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Mobile Number</label>
                       <input name="mobile" value={formData.mobile} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium text-gray-900" placeholder="+91" />
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Branch</label>
                       <input name="branch" value={formData.branch} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium text-gray-900" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Semester</label>
                       <input name="sem" value={formData.sem} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium text-gray-900" />
                     </div>
                   </div>
                 </div>

                 {message && (
                   <div className={`mt-6 p-4 rounded-xl text-sm font-medium border ${message.includes('success') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                     {message}
                   </div>
                 )}

                 <div className="border-t border-gray-100 mt-8 pt-8 flex justify-end">
                   <button type="submit" disabled={updating} className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center gap-2">
                     {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                     {updating ? 'Saving...' : 'Save Changes'}
                   </button>
                 </div>
               </form>
             </motion.div>
           )}

           {activeTab === 'security' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
               <h1 className="text-3xl md:text-4xl font-bold mb-2">Security & Access</h1>
               <p className="text-gray-500 mb-10">Manage your passwords and account recovery architecture.</p>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                 {/* Change Password Block */}
                 <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-xl shadow-black/5">
                   <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><KeyRound className="w-5 h-5 text-amber-500"/> Update Password</h2>
                   <form onSubmit={handleChangePassword} className="space-y-4">
                     <div>
                       <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Current Password</label>
                       <input type="password" required value={passForm.oldPassword} onChange={e=>setPassForm({...passForm, oldPassword: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black" />
                     </div>
                     <div>
                       <label className="text-xs font-bold text-gray-400 uppercase block mb-1">New Password</label>
                       <input type="password" required value={passForm.newPassword} onChange={e=>setPassForm({...passForm, newPassword: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black" />
                     </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Confirm New Password</label>
                        <input type="password" required value={passForm.confirmPassword} onChange={e=>setPassForm({...passForm, confirmPassword: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black" />
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Requires 1 uppercase, 1 lowercase, 1 number, & 1 special character.</div>
                     {passMessage && (
                       <div className={`p-3 rounded-lg text-sm font-medium border ${passMessage.includes('success') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                         {passMessage.replace('success: ', '')}
                       </div>
                     )}
                     <button type="submit" disabled={passLoading} className="w-full mt-2 bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50">
                       {passLoading ? 'Updating Sequence...' : 'Authenticate & Save'}
                     </button>
                   </form>
                 </div>

                 {/* Reset Password Block */}
                 <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-xl shadow-black/5 bg-gradient-to-br from-white to-gray-50/50">
                   <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Shield className="w-5 h-5 text-gray-400"/> Force OTP Reset</h2>
                   <p className="text-sm text-gray-500 mb-6 leading-relaxed">Forgot your password entirely? Generate a 6-digit Time-Based One Time Password (TOTP) to securely overwrite your keys.</p>
                   
                   {resetFlow === 'idle' && (
                     <div>
                       <button onClick={handleRequestOTP} disabled={resetLoading} className="w-full border-2 border-black bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                         {resetLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Mail className="w-4 h-4" />}
                         {resetLoading ? 'Authorizing Email...' : 'Send OTP to Email'}
                       </button>
                       {resetMessage && (
                           <div className={`mt-4 p-3 rounded-lg text-sm font-medium border ${resetMessage.includes('success') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                             {resetMessage.replace('success: ', '')}
                           </div>
                       )}
                     </div>
                   )}

                   {resetFlow === 'otp' && (
                     <form onSubmit={handleVerifyOTP} className="space-y-4">
                       <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4">
                         <p className="text-xs text-amber-800 font-bold uppercase mb-1">Check your inbox</p>
                         <p className="text-sm text-amber-700">A 6-digit verification code has been dispatched. Expires in 2 minutes.</p>
                       </div>
                       <div>
                         <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Enter OTP Sequence</label>
                         <input type="text" maxLength={6} required value={resetOtp} onChange={e=>setResetOtp(e.target.value)} placeholder="000000" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black font-mono text-center tracking-[1em] text-xl" />
                       </div>
                       {resetMessage && (
                         <div className={`p-3 rounded-lg text-sm font-medium border ${resetMessage.includes('success') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                           {resetMessage.replace('success: ', '')}
                         </div>
                       )}
                       <button type="submit" disabled={resetLoading} className="w-full mt-2 bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50">
                         {resetLoading ? 'Verifying...' : 'Validate Code'}
                       </button>
                     </form>
                   )}

                    {resetFlow === 'newpass' && (
                      <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-bold text-gray-400 uppercase block mb-1">New Terminal Password</label>
                            <input type="password" required value={resetNewPass} onChange={e=>setResetNewPass(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Confirm Terminal Password</label>
                            <input type="password" required value={resetConfirmNewPass} onChange={e=>setResetConfirmNewPass(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black" />
                          </div>
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Requires 1 uppercase, 1 lowercase, 1 number, & 1 special character.</div>
                       {resetMessage && (
                         <div className={`p-3 rounded-lg text-sm font-medium border ${resetMessage.includes('success') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                           {resetMessage.replace('success: ', '')}
                         </div>
                       )}
                       <button type="submit" disabled={resetLoading} className="w-full mt-2 bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50">
                         {resetLoading ? 'Sealing...' : 'Confirm Reset Password'}
                       </button>
                     </form>
                   )}

                 </div>
               </div>
             </motion.div>
           )}

        </div>
      </div>
    </div>
  );
}
