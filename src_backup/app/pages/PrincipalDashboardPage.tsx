import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { LogOut, Users, FileText, Send, Loader2, BarChart, Settings, CheckCircle, Search, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function PrincipalDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'broadcast' | 'settings'>('overview');
  
  // Data State
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Form State
  const [broadcastForm, setBroadcastForm] = useState({ title: '', content: '' });
  const [credentialsForm, setCredentialsForm] = useState({ newUsername: '', newPassword: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]); // Fetch data based on tab

  const fetchData = async () => {
    try {
      if (activeTab === 'overview') {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/superadmin/analytics`, { credentials: 'include' });
        if (res.ok) setAnalytics(await res.json());
        else if (res.status === 401) navigate('/principal-login');
      } else if (activeTab === 'members') {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users/admin/users`, { credentials: 'include' });
        if (res.ok) setUsers(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/superadmin/logout`, { method: 'POST', credentials: 'include' });
    navigate('/principal-login');
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/superadmin/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(broadcastForm)
      });
      if (res.ok) {
        toast.success("Broadcast message sent successfully to all members.");
        setBroadcastForm({ title: '', content: '' });
      } else {
        toast.error("Failed to send message.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/superadmin/credentials`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentialsForm)
      });
      if (res.ok) {
        toast.success("Credentials updated securely.");
        setCredentialsForm({ newUsername: '', newPassword: '' });
      } else {
        toast.error("Failed to update credentials.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  const barChartData = {
    labels: ['Impromptu', 'Tone', 'Word of Day', 'Confidence', 'Story'],
    datasets: [
      {
        label: 'Exercises Completed',
        data: analytics ? [analytics.aiStats.impromptu, analytics.aiStats.tone, analytics.aiStats.word, analytics.aiStats.confidence, analytics.aiStats.story] : [0,0,0,0,0],
        backgroundColor: 'rgba(245, 158, 11, 0.8)', // amber-500
      },
    ],
  };

  const filteredUsers = users.filter(u => u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.usn?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 text-black flex font-sans">
      
      {/* Sidebar */}
      <div className="w-72 bg-black text-white p-6 flex flex-col h-screen fixed top-0 left-0">
         <div className="mb-12">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Principal Corner<span className="text-amber-500">.</span></h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">SuperAdmin Console</p>
         </div>

         <div className="flex-1 space-y-2">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'overview' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <BarChart className="w-5 h-5" /> Analytics Overview
            </button>
            <button onClick={() => setActiveTab('members')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'members' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <Users className="w-5 h-5" /> Member Directory
            </button>
            <button onClick={() => setActiveTab('broadcast')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'broadcast' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <Send className="w-5 h-5" /> Broadcast Message
            </button>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'settings' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <Settings className="w-5 h-5" /> Security Settings
            </button>
         </div>

         <button onClick={handleLogout} className="mt-auto flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl font-medium transition-colors">
            <LogOut className="w-5 h-5" /> Terminate Session
         </button>
      </div>

      {/* Main Content */}
      <div className="ml-72 flex-1 p-10 overflow-y-auto">
        
        {activeTab === 'overview' && analytics && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <h2 className="text-3xl font-bold mb-8">Global Analytics</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                   <div>
                     <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">Total Registered Members</p>
                     <h3 className="text-5xl font-black">{analytics.totalUsers}</h3>
                   </div>
                   <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><Users className="w-8 h-8" /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                   <div>
                     <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">Total Events Conducted</p>
                     <h3 className="text-5xl font-black">{analytics.totalEvents}</h3>
                   </div>
                   <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center"><CheckCircle className="w-8 h-8" /></div>
                </div>
             </div>

             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-6">AI Practice Hub Activity</h3>
                <div className="h-[400px]">
                  <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'members' && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <div className="flex justify-between items-center mb-8">
               <h2 className="text-3xl font-bold">Member Directory</h2>
               <div className="relative">
                 <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                 <input type="text" placeholder="Search by name or USN..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black w-80 font-medium" />
               </div>
             </div>

             <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Member</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">USN</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Branch/Sem</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-bold">{u.fullName}</td>
                        <td className="p-4 font-mono text-sm">{u.usn}</td>
                        <td className="p-4 text-sm">{u.branch} - S{u.sem}</td>
                        <td className="p-4">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.isSuspended ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                             {u.isSuspended ? 'Suspended' : 'Active'}
                           </span>
                        </td>
                        <td className="p-4">
                           <button onClick={() => setSelectedUser(u)} className="text-amber-600 hover:text-amber-800 text-sm font-bold">View Analytics</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>

             {/* Deep Dive Modal */}
             {selectedUser && (
               <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setSelectedUser(null)}>
                 <div className="bg-white rounded-3xl p-10 max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                    <h3 className="text-2xl font-bold mb-2">{selectedUser.fullName}'s Profile</h3>
                    <p className="text-gray-500 mb-8 font-mono">{selectedUser.usn} • {selectedUser.branch}</p>
                    
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 mb-6">
                      <h4 className="font-bold mb-4">Contact Info</h4>
                      <p className="text-sm mb-2"><span className="font-bold">Email:</span> {selectedUser.email}</p>
                      <p className="text-sm"><span className="font-bold">Mobile:</span> {selectedUser.mobile}</p>
                    </div>

                    <div className="p-6 bg-amber-50 text-amber-900 rounded-2xl border border-amber-100">
                      <h4 className="font-bold mb-4 flex items-center gap-2"><BarChart className="w-5 h-5"/> Read-Only Analytics Note</h4>
                      <p className="text-sm leading-relaxed">Detailed granular AI tracking data for this user would be displayed here by querying the UserProgress collection associated with their ObjectId. (Placeholder for UI structure).</p>
                    </div>

                    <button onClick={() => setSelectedUser(null)} className="mt-8 px-6 py-3 bg-black text-white font-bold rounded-xl w-full hover:bg-gray-900 transition-colors">Close Profile</button>
                 </div>
               </div>
             )}
           </motion.div>
        )}

        {activeTab === 'broadcast' && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
             <h2 className="text-3xl font-bold mb-2">Broadcast Message</h2>
             <p className="text-gray-500 mb-8">Send a global announcement to all active members.</p>

             <form onSubmit={handleBroadcast} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
               <div>
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Message Title</label>
                 <input type="text" required value={broadcastForm.title} onChange={e=>setBroadcastForm({...broadcastForm, title: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black font-medium" placeholder="e.g. Important Update regarding Upcoming Contest" />
               </div>
               <div>
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Message Content</label>
                 <textarea required value={broadcastForm.content} onChange={e=>setBroadcastForm({...broadcastForm, content: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black font-medium min-h-[200px]" placeholder="Type your announcement here..." />
               </div>
               <button type="submit" disabled={actionLoading} className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
                 {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                 Dispatch Broadcast
               </button>
             </form>
           </motion.div>
        )}

        {activeTab === 'settings' && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
             <h2 className="text-3xl font-bold mb-2">Security Settings</h2>
             <p className="text-gray-500 mb-8">Update your SuperAdmin credentials.</p>

             <form onSubmit={handleUpdateCredentials} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
               <div>
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">New Username</label>
                 <input type="text" value={credentialsForm.newUsername} onChange={e=>setCredentialsForm({...credentialsForm, newUsername: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black font-medium" placeholder="Leave blank to keep unchanged" />
               </div>
               <div>
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">New Password</label>
                 <input type="password" value={credentialsForm.newPassword} onChange={e=>setCredentialsForm({...credentialsForm, newPassword: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black font-medium" placeholder="Leave blank to keep unchanged" />
               </div>
               <button type="submit" disabled={actionLoading} className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
                 {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Settings className="w-5 h-5" />}
                 Update Credentials
               </button>
             </form>
           </motion.div>
        )}

      </div>
    </div>
  );
}
