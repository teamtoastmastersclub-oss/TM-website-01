import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Loader2, Menu, X, Trash2, Mail, MessageSquare, Users, Settings as SettingsIcon, CalendarDays, CheckCircle, XCircle, Search, Activity, ShieldAlert, ShieldCheck, LogOut, PlusSquare, User as UserIcon, Camera, Clock, MapPin, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export function AdminPanelPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'create-event' | 'upcoming-events' | 'past-events' | 'users' | 'queries' | 'feedbacks' | 'settings' | 'team' | 'profile' | 'certificates'>('upcoming-events');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [globalUsers, setGlobalUsers] = useState<any[]>([]);

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAttendanceModal, setShowAttendanceModal] = useState<string | null>(null);
  const [showMovePastModal, setShowMovePastModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<any>(null);
  const [deleteInput, setDeleteInput] = useState('');
  const [confirmModal, setConfirmModal] = useState<{ title: string, message: string, onConfirm: () => void } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [archiveLoading, setArchiveLoading] = useState(false);
  
  // Forms
  const [eventForm, setEventForm] = useState({ title: '', description: '', rules: '', date: '', timeFrom: '', timeFromAMPM: 'AM', timeTo: '', timeToAMPM: 'PM', venue: '', banner: '' });
  const [settingsForm, setSettingsForm] = useState<any>({ heroCounts: [{ title: '', count: 0 }, { title: '', count: 0 }, { title: '', count: 0 }] });
  const [teamForm, setTeamForm] = useState<any>({ principal: {}, faculties: [], coordinators: [] });
  const [teamLoading, setTeamLoading] = useState(false);
  const [pastForm, setPastForm] = useState<{ winners: {usn: string, title: string, image: string}[], galleryURLs: string[] }>({ winners: [{ usn: '', title: '', image: '' }], galleryURLs: [] });

  // Profile Form State
  const [updating, setUpdating] = useState(false);
  const [profileData, setProfileData] = useState({ fullName: '', email: '', branch: '', sem: '', usn: '', profileImage: '' });
  const [profileMessage, setProfileMessage] = useState('');
  
  // Password State
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passMessage, setPassMessage] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Certificates State
  const [certForm, setCertForm] = useState({ usn: '', description: '', fileData: '' });
  const [certLoading, setCertLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/users/me', { credentials: 'include' });
        if (res.ok) {
          const userData = await res.json();
          if (userData.role !== 'admin') {
            navigate('/dashboard');
            return;
          }
          setUser(userData);
          setProfileData({
            fullName: userData.fullName || '',
            email: userData.email || '',
            branch: userData.branch || '',
            sem: userData.sem || '',
            usn: userData.usn || '',
            profileImage: userData.profileImage || ''
          });
          fetchData('upcoming-events');
          fetchGlobalUsers();
        } else {
          navigate('/login');
        }
      } catch {
        navigate('/login');
      }
    };
    init();
  }, [navigate]);

  useEffect(() => {
    if (user) fetchData(activeTab);
  }, [activeTab]);

  const fetchGlobalUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users/admin/users`, { credentials: 'include' });
      if (res.ok) setGlobalUsers(await res.json());
    } catch (err) {}
  };

  const fetchData = async (tab: string) => {
    setLoading(true);
    setData(null);
    try {
      let endpoint = '';
      if (tab === 'queries') endpoint = '/api/queries';
      else if (tab === 'feedbacks') endpoint = '/api/feedbacks';
      else if (tab === 'users') endpoint = `/api/users/admin/users?search=${searchQuery}`;
      else if (tab === 'settings') endpoint = '/api/settings';
      else if (tab === 'team') endpoint = '/api/team';
      else if (tab === 'certificates') endpoint = '/api/certificates';
      else if (tab.includes('events')) endpoint = '/api/events';

      if (endpoint) {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${endpoint}`, { credentials: 'include' });
        if (res.ok) {
           const result = await res.json();
           setData(result);
           if (tab === 'settings') setSettingsForm(result);
           if (tab === 'team') setTeamForm(result);
        }
      }
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/auth/logout', { credentials: 'include', method: 'POST' });
    navigate('/login');
  };

  const handleSearchUsers = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData('users');
  };

  const handleDeleteQueryFeedback = (id: string, type: 'queries' | 'feedbacks') => {
    setConfirmModal({
      title: 'Confirm Deletion',
      message: `Delete this ${type.slice(0, -1)}?`,
      onConfirm: async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/${type}/${id}`, { method: 'DELETE', credentials: 'include' });
          if (res.ok) {
             setData((prev: any[]) => prev.filter(item => item._id !== id));
             toast.success("Deleted successfully!");
          }
        } catch {}
        setConfirmModal(null);
      }
    });
  };

  const handleDeleteUser = (id: string) => {
    setConfirmModal({
      title: 'Delete User',
      message: 'Permanently delete this user?',
      onConfirm: async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users/admin/users/${id}`, { method: 'DELETE', credentials: 'include' });
          if (res.ok) {
             fetchData('users');
             toast.success("User deleted successfully!");
          }
        } catch {}
        setConfirmModal(null);
      }
    });
  };

  const handleDeleteEvent = (ev: any) => {
    setShowDeleteModal(ev);
    setDeleteInput('');
  };

  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showDeleteModal) return;
    if (deleteInput.trim() !== showDeleteModal.title.trim()) {
       toast.error("Title did not match. Deletion aborted.");
       return;
    }
    setDeleteLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/events/${showDeleteModal._id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        setShowDeleteModal(null);
        fetchData(activeTab);
      }
    } catch {} finally {
      setDeleteLoading(false);
    }
  };

  const handleSuspendUser = async (id: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users/admin/users/${id}/suspend`, { method: 'PUT', credentials: 'include' });
      if (res.ok) fetchData('users');
    } catch {}
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/settings', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) toast.success('Settings saved!');
    } catch {}
    setLoading(false);
  };

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeamLoading(true);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/team', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify(teamForm)
      });
      if (res.ok) {
        toast.success('Team configuration saved!');
        fetchData('team');
      }
    } catch {}
    setTeamLoading(false);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createLoading) return;
    setCreateLoading(true);
    try {
      const payload = { ...eventForm };
      if (!payload.timeFrom.includes('AM') && !payload.timeFrom.includes('PM')) {
        payload.timeFrom = `${payload.timeFrom} ${payload.timeFromAMPM}`;
      }
      if (!payload.timeTo.includes('AM') && !payload.timeTo.includes('PM')) {
        payload.timeTo = `${payload.timeTo} ${payload.timeToAMPM}`;
      }
      
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/events', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success("Event Created Successfully!");
        setEventForm({ title: '', description: '', rules: '', date: '', timeFrom: '', timeFromAMPM: 'AM', timeTo: '', timeToAMPM: 'PM', venue: '', banner: '' });
        setActiveTab('upcoming-events');
      }
    } catch {} finally {
      setCreateLoading(false);
    }
  };

  const handleToggleAttendance = async (eventId: string, userId: string) => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/events/attendance', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ eventId, userId })
      });
      if (res.ok) {
        const updatedEvent = await res.json();
        setData((prev: any[]) => prev.map(ev => ev._id === eventId ? updatedEvent : ev));
      }
    } catch {}
  };

  const handleMoveToPast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showMovePastModal || archiveLoading) return;
    
    setArchiveLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/events/${showMovePastModal}/past`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ winnersData: pastForm.winners, gallery: pastForm.galleryURLs })
      });
      if (res.ok) {
        setShowMovePastModal(null);
        setPastForm({ winners: [{ usn: '', title: '', image: '' }], galleryURLs: [] });
        fetchData('upcoming-events'); 
      }
    } catch {} finally {
      setArchiveLoading(false);
    }
  };

  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCertLoading(true);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/certificates', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify(certForm)
      });
      if (res.ok) {
        toast.success("Certificate issued successfully!");
        setCertForm({ usn: '', description: '', fileData: '' });
        fetchData('certificates');
      } else {
        const d = await res.json();
        toast.error(d.message || "Failed to issue certificate.");
      }
    } catch { toast.error("Network error."); } finally { setCertLoading(false); }
  };

  const handleDeleteCertificate = (id: string) => {
    setConfirmModal({
      title: 'Delete Certificate',
      message: 'Permanently remove this certificate record?',
      onConfirm: async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/certificates/${id}`, { method: 'DELETE', credentials: 'include' });
          if (res.ok) {
             toast.success("Certificate deleted successfully!");
             fetchData('certificates');
          }
        } catch {}
        setConfirmModal(null);
      }
    });
  };

  // PROFILE HANDLERS
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return toast.error("File size must be less than 2MB.");
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setProfileMessage('');
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/users/me', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify(profileData),
      });
      if (res.ok) {
        const d = await res.json();
        setUser(d);
        setProfileMessage('Profile updated successfully!');
      } else {
        setProfileMessage('Failed to update profile.');
      }
    } catch {
      setProfileMessage('Network error.');
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassMessage("New passwords don't match");
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

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin w-8 h-8 text-black" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 text-black flex overflow-hidden font-sans">
      
      {/* Mobile Top Header containing Hamburger */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white border-b border-gray-100 z-20 px-6 py-4 flex items-center justify-between">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <div className="font-bold text-xl tracking-tight">KLECET<span className="text-amber-500">.</span></div>
      </div>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}

      {/* Admin Sidebar Layout */}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-black text-white border-r border-gray-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-gray-900">
           <div>
             <div className="font-bold text-2xl tracking-tight text-white">ADMIN<span className="text-amber-500">.</span></div>
             <p className="text-[10px] text-gray-400 tracking-widest font-semibold uppercase mt-1">Control Center</p>
           </div>
           <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-gray-400 hover:text-white">
             <X className="w-5 h-5" />
           </button>
        </div>
        
        <div className="p-6 flex flex-col gap-2 flex-grow overflow-y-auto">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-3">Events Hub</p>
          <button onClick={() => { setActiveTab('create-event'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'create-event' ? 'bg-white text-black shadow-lg shadow-black/10' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <PlusSquare className="w-5 h-5" /> Add Event
          </button>
          <button onClick={() => { setActiveTab('upcoming-events'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'upcoming-events' ? 'bg-white text-black shadow-lg shadow-black/10' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <CalendarDays className="w-5 h-5" /> Upcoming Events
          </button>
          <button onClick={() => { setActiveTab('past-events'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'past-events' ? 'bg-white text-black shadow-lg shadow-black/10' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <CheckCircle className="w-5 h-5" /> Past Archive
          </button>

          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-3 mt-4">Database</p>
          <button onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'users' ? 'bg-white text-black shadow-lg shadow-black/10' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <Users className="w-5 h-5" /> Members Directory
          </button>
          <button onClick={() => { setActiveTab('feedbacks'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'feedbacks' ? 'bg-white text-black shadow-lg shadow-black/10' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <MessageSquare className="w-5 h-5" /> Feedbacks
          </button>
          <button onClick={() => { setActiveTab('queries'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'queries' ? 'bg-white text-black shadow-lg shadow-black/10' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <Mail className="w-5 h-5" /> Queries
          </button>

          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-3 mt-4">System</p>
          <button onClick={() => { setActiveTab('certificates'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'certificates' ? 'bg-white text-black shadow-lg shadow-black/10' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <Award className="w-5 h-5" /> Gen Certificates
          </button>
          <button onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'settings' ? 'bg-white text-black shadow-lg shadow-black/10' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <SettingsIcon className="w-5 h-5" /> Global Settings
          </button>
          <button onClick={() => { setActiveTab('team'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'team' ? 'bg-white text-black shadow-lg shadow-black/10' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <Users className="w-5 h-5" /> Core Team
          </button>
          <button onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'profile' ? 'bg-white text-black shadow-lg shadow-black/10' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <UserIcon className="w-5 h-5" /> Manage Profile
          </button>
        </div>

        <div className="p-6 border-t border-gray-800 bg-gray-900">
           <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-700 text-sm font-bold text-gray-400 hover:bg-black hover:text-white hover:border-black transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
           </button>
        </div>
      </div>

      {/* Main Content View */}
      <div className="flex-1 h-screen overflow-y-auto pt-20 md:pt-0 bg-gray-50">
        <div className="p-6 md:p-12 max-w-6xl mx-auto w-full">
           
           {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
           ) : (
             <>
               {/* ADD EVENT */}
               {activeTab === 'create-event' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                   <h1 className="text-3xl font-bold mb-2">Publish Event</h1>
                   <p className="text-gray-500 mb-8">Create a new Live Event for your members to see.</p>
                   
                   <form onSubmit={handleCreateEvent} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                     <div className="space-y-6">
                       <div><label className="text-xs font-bold text-gray-400 uppercase">Title</label><input required value={eventForm.title} onChange={e=>setEventForm({...eventForm, title: e.target.value})} className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 mt-1 outline-none focus:border-black"/></div>
                       <div><label className="text-xs font-bold text-gray-400 uppercase">Venue</label><input required value={eventForm.venue} onChange={e=>setEventForm({...eventForm, venue: e.target.value})} className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 mt-1 outline-none focus:border-black"/></div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div><label className="text-xs font-bold text-gray-400 uppercase">Date</label><input type="date" required value={eventForm.date} onChange={e=>setEventForm({...eventForm, date: e.target.value})} className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 mt-1 outline-none focus:border-black"/></div>
                         <div className="flex gap-4">
                           <div className="w-1/2"><label className="text-xs font-bold text-gray-400 uppercase">From</label>
                             <div className="flex mt-1">
                               <input type="text" placeholder="10:30" required value={eventForm.timeFrom} onChange={e=>setEventForm({...eventForm, timeFrom: e.target.value})} className="w-2/3 border border-gray-200 bg-gray-50 rounded-l-lg p-3 outline-none focus:border-black"/>
                               <select value={eventForm.timeFromAMPM} onChange={e=>setEventForm({...eventForm, timeFromAMPM: e.target.value})} className="w-1/3 border-t border-b border-r border-gray-200 bg-white rounded-r-lg px-1 outline-none cursor-pointer font-bold text-xs"><option value="AM">AM</option><option value="PM">PM</option></select>
                             </div>
                           </div>
                           <div className="w-1/2"><label className="text-xs font-bold text-gray-400 uppercase">To</label>
                             <div className="flex mt-1">
                               <input type="text" placeholder="12:30" required value={eventForm.timeTo} onChange={e=>setEventForm({...eventForm, timeTo: e.target.value})} className="w-2/3 border border-gray-200 bg-gray-50 rounded-l-lg p-3 outline-none focus:border-black"/>
                               <select value={eventForm.timeToAMPM} onChange={e=>setEventForm({...eventForm, timeToAMPM: e.target.value})} className="w-1/3 border-t border-b border-r border-gray-200 bg-white rounded-r-lg px-1 outline-none cursor-pointer font-bold text-xs"><option value="AM">AM</option><option value="PM">PM</option></select>
                             </div>
                           </div>
                         </div>
                       </div>
                       
                       <div>
                         <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Event Banner Image (Optional)</label>
                         <div className="flex items-center gap-4">
                           <input type="file" accept="image/*" onChange={(e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                               const reader = new FileReader();
                               reader.onloadend = () => setEventForm({...eventForm, banner: reader.result as string});
                               reader.readAsDataURL(file);
                             }
                           }} className="text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-black hover:file:bg-gray-200 cursor-pointer w-full" />
                           {eventForm.banner && <div className="w-16 h-12 rounded-lg bg-black shrink-0 overflow-hidden"><img src={eventForm.banner} className="w-full h-full object-cover"/></div>}
                         </div>
                       </div>

                       <div><label className="text-xs font-bold text-gray-400 uppercase">Description</label><textarea required value={eventForm.description} onChange={e=>setEventForm({...eventForm, description: e.target.value})} className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 mt-1 h-32 outline-none focus:border-black"/></div>
                       <div><label className="text-xs font-bold text-gray-400 uppercase">Rules & Requirements</label><textarea required value={eventForm.rules} onChange={e=>setEventForm({...eventForm, rules: e.target.value})} className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 mt-1 h-32 outline-none focus:border-black"/></div>
                       <button type="submit" disabled={createLoading} className="w-full bg-black text-white font-bold py-4 rounded-xl mt-4 hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                         {createLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                         {createLoading ? 'Launching...' : 'Launch Event to Dashboard'}
                       </button>
                     </div>
                   </form>
                 </motion.div>
               )}

               {/* UPCOMING EVENTS & ATTENDANCE */}
               {activeTab === 'upcoming-events' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                   <h1 className="text-3xl font-bold mb-2">Upcoming Events</h1>
                   <p className="text-gray-500 mb-8">Manage active events, mark attendance, and shift to past archives.</p>
                   
                   <div className="grid grid-cols-1 gap-6">
                     {(Array.isArray(data) ? data : []).filter((e: any) => e.status === 'upcoming').length === 0 && (
                       <div className="p-12 text-center text-gray-500 bg-white border border-gray-200 rounded-2xl">No upcoming events are currently live.</div>
                     )}
                     {(Array.isArray(data) ? data : []).filter((e: any) => e.status === 'upcoming').map((ev: any) => (
                       <div key={ev._id} className="border border-gray-200 p-8 rounded-2xl flex flex-col lg:flex-row gap-8 justify-between bg-white shadow-sm">
                         {ev.banner && (
                            <div className="w-full lg:w-48 h-48 lg:h-auto shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                               <img src={ev.banner} className="w-full h-full object-cover" />
                            </div>
                         )}
                         <div className="flex-1">
                           <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">{ev.title} <span className="text-[10px] bg-green-100 text-green-800 px-3 py-1 rounded-full uppercase tracking-wider font-bold">LIVE</span></h3>
                           <p className="text-gray-500 mb-6">{ev.description}</p>
                           <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-600">
                             <span className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"><CalendarDays className="w-4 h-4"/>{ev.date}</span>
                             <span className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"><Clock className="w-4 h-4"/>{ev.timeFrom} - {ev.timeTo}</span>
                             <span className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"><MapPin className="w-4 h-4"/>{ev.venue}</span>
                           </div>
                         </div>
                         <div className="flex flex-col gap-3 justify-center min-w-[220px]">
                            <button onClick={() => setShowAttendanceModal(showAttendanceModal === ev._id ? null : ev._id)} className="w-full px-5 py-3 bg-black text-white font-bold rounded-xl text-sm transition-transform hover:-translate-y-0.5">
                              {showAttendanceModal === ev._id ? 'Close Roster' : 'Mark Attendance'}
                            </button>
                            <button onClick={() => setShowMovePastModal(ev._id)} className="w-full px-5 py-3 border-2 border-dashed border-gray-300 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 hover:border-gray-400">Archive Event</button>
                            <button onClick={() => handleDeleteEvent(ev)} className="w-full px-5 py-3 border-2 border-red-50 text-red-600 font-bold text-sm rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2 mt-2">
                               <Trash2 className="w-4 h-4" /> Purge Event
                            </button>
                         </div>
                       </div>
                     ))}
                   </div>
                  </motion.div>
                )}

                {/* PAST EVENTS */}
                {activeTab === 'past-events' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-bold mb-2">Past Archives</h1>
                    <p className="text-gray-500 mb-8">Manage historical events. You can permanently delete an event from the secure database.</p>
                    
                    <div className="grid grid-cols-1 gap-6">
                      {(Array.isArray(data) ? data : []).filter((e: any) => e.status === 'past').length === 0 && (
                        <div className="p-12 text-center text-gray-500 bg-white border border-gray-200 rounded-2xl">No archived events are present.</div>
                      )}
                      {(Array.isArray(data) ? data : []).filter((e: any) => e.status === 'past').map((ev: any) => (
                        <div key={ev._id} className="border border-gray-200 p-8 rounded-2xl flex flex-col lg:flex-row gap-8 justify-between bg-white shadow-sm opacity-90">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-3 flex items-center gap-3 text-gray-800">{ev.title} <span className="text-[10px] bg-gray-100 text-gray-600 px-3 py-1 rounded-full uppercase tracking-wider font-bold border border-gray-200">ARCHIVED</span></h3>
                            <p className="text-gray-500 mb-6 text-sm line-clamp-2">{ev.description}</p>
                            <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-500">
                              <span className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"><CalendarDays className="w-4 h-4"/>{ev.date}</span>
                              <span className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"><MapPin className="w-4 h-4"/>{ev.venue}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-3 justify-center min-w-[220px]">
                             <button onClick={() => setShowAttendanceModal(showAttendanceModal === ev._id ? null : ev._id)} className="w-full px-5 py-3 border-2 border-dashed border-gray-300 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 hover:border-gray-400">
                               {showAttendanceModal === ev._id ? 'Close Roster' : 'Edit Attendance'}
                             </button>
                             <button onClick={() => handleDeleteEvent(ev)} className="w-full px-5 py-3 border-2 border-red-50 text-red-600 font-bold text-sm rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                               <Trash2 className="w-4 h-4" /> Purge Event Data
                             </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* MEMBERS DIRECTORY */}
               {activeTab === 'users' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                     <div>
                       <h1 className="text-3xl font-bold mb-2">Members Directory</h1>
                       <p className="text-gray-500">Query your database, suspend accounts, and permanently delete users.</p>
                     </div>
                     <form onSubmit={handleSearchUsers} className="flex shadow-sm">
                       <input type="text" placeholder="Search Names or USNs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="px-5 py-3 border border-gray-200 rounded-l-xl focus:outline-none focus:border-black w-full md:w-64 bg-white" />
                       <button type="submit" className="px-5 py-3 bg-black text-white rounded-r-xl"><Search className="w-5 h-5"/></button>
                     </form>
                   </div>
                   
                   <div className="bg-white border border-gray-200 rounded-2xl overflow-x-auto shadow-sm">
                     <table className="w-full text-left border-collapse">
                       <thead>
                         <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                           <th className="p-5 font-bold text-black">Member Profile</th>
                           <th className="p-5 font-bold text-black">Academic Node</th>
                           <th className="p-5 font-bold text-black">Authentication Status</th>
                           <th className="p-5 font-bold text-black text-right">Moderator Logic</th>
                         </tr>
                       </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(Array.isArray(data) ? data : []).filter((u: any) => u.role !== 'admin').map((u: any) => (
                            <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                             <td className="p-5">
                               <div className="font-bold text-lg">{u.fullName}</div>
                               <div className="text-sm text-gray-500">{u.email} <span className="text-gray-300 mx-2">•</span> {u.mobile || <span className="text-gray-300 italic text-xs">No Mobile</span>}</div>
                             </td>
                             <td className="p-5">
                               <div className="font-mono font-bold text-sm bg-gray-100 inline-block px-2 py-1 rounded">{u.usn}</div>
                               <div className="text-sm font-bold text-gray-400 mt-2">{u.branch} — <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">Sem {u.sem}</span></div>
                             </td>
                             <td className="p-5">
                               {u.isSuspended ? (
                                 <span className="bg-red-50 border border-red-200 text-red-700 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center w-max gap-1"><ShieldAlert className="w-3 h-3"/>Suspended</span>
                               ) : (
                                 <span className="bg-green-50 border border-green-200 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center w-max gap-1"><ShieldCheck className="w-3 h-3"/>Verified</span>
                               )}
                               <div className="text-[10px] text-gray-400 uppercase font-bold mt-2 tracking-widest ">Role: {u.role}</div>
                             </td>
                             <td className="p-5 text-right">
                               <div className="flex justify-end gap-3 border-l border-gray-100 pl-4 py-2">
                                 {u.role !== 'admin' && (
                                   <>
                                     <button onClick={() => handleSuspendUser(u._id)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${u.isSuspended ? 'bg-white border-green-200 text-green-600 hover:bg-green-50' : 'bg-white border-amber-200 text-amber-600 hover:bg-amber-50'}`}>
                                       {u.isSuspended ? 'Reacticate' : 'Revoke Box'}
                                     </button>
                                     <button onClick={() => handleDeleteUser(u._id)} className="p-2 border border-red-200 bg-white text-red-500 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                   </>
                                 )}
                               </div>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 </motion.div>
               )}

               {/* FEEDBACKS */}
               {activeTab === 'feedbacks' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                   <h1 className="text-3xl font-bold mb-2">Feedbacks Inbox</h1>
                   <p className="text-gray-500 mb-8">Public feedback drops via the unauthenticated Landing Page layout.</p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {(Array.isArray(data) ? data : []).map((fb: any) => (
                       <div key={fb._id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative group">
                         <button onClick={() => handleDeleteQueryFeedback(fb._id, 'feedbacks')} className="absolute top-4 right-4 bg-red-50 text-red-500 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
                         <h4 className="font-bold text-lg mb-1">{fb.studentName || fb.name || 'Anonymous User'}</h4>
                         <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-4">{fb.branch || 'Unknown'} - Sem {fb.sem || ''}</p>
                         <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 italic text-gray-600 text-sm">
                           "{fb.feedback || fb.message || fb.text || ''}"
                         </div>
                       </div>
                     ))}
                   </div>
                 </motion.div>
               )}

               {/* QUERIES */}
               {activeTab === 'queries' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                   <h1 className="text-3xl font-bold mb-2">Contact Queries</h1>
                   <p className="text-gray-500 mb-8">Direct messages from the Support Route.</p>
                   
                   <div className="space-y-4">
                     {(Array.isArray(data) ? data : []).map((q: any) => (
                       <div key={q._id} className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col md:flex-row gap-6 shadow-sm">
                         <div className="md:w-1/3">
                           <h4 className="font-bold text-lg">{q.studentName}</h4>
                           <p className="text-sm font-medium text-gray-500 mt-1">{q.branch} — <span className="text-gray-400">Sem {q.sem}</span></p>
                         </div>
                         <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 relative group">
                           <p className="text-gray-700 leading-relaxed font-serif whitespace-pre-wrap">{q.description}</p>
                           <button onClick={() => handleDeleteQueryFeedback(q._id, 'queries')} className="absolute top-0 right-0 p-2 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
                         </div>
                       </div>
                     ))}
                   </div>
                 </motion.div>
               )}

               {/* CERTIFICATES */}
               {activeTab === 'certificates' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                   <h1 className="text-3xl font-bold mb-2">Issue Certificates</h1>
                   <p className="text-gray-500 mb-8">Generate official certificates bound to student identities.</p>

                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-1">
                         <form onSubmit={handleCreateCertificate} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-6">
                            <h3 className="font-black text-xl mb-4">New Certificate</h3>
                            <div className="space-y-4">
                              <div><label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Student USN</label><input required value={certForm.usn} onChange={e=>setCertForm({...certForm, usn: e.target.value.toUpperCase()})} placeholder="e.g. 2AG21CS0XX" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm uppercase focus:outline-none focus:border-black"/></div>
                              <div><label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Achievement / Title</label><input required value={certForm.description} onChange={e=>setCertForm({...certForm, description: e.target.value})} placeholder="Hackathon Winner 2026" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm focus:outline-none focus:border-black"/></div>
                              <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Asset Document (Img/PDF)</label>
                                <input type="file" required accept="image/*,application/pdf" onChange={(e) => {
                                   const file = e.target.files?.[0];
                                   if(file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                         if (file.type.startsWith('image/')) {
                                            const img = new Image();
                                            img.onload = () => {
                                               const canvas = document.createElement('canvas');
                                               const MAX_WIDTH = 1600;
                                               let w = img.width, h = img.height;
                                               if(w > MAX_WIDTH) { h = h * (MAX_WIDTH / w); w = MAX_WIDTH; }
                                               canvas.width = w; canvas.height = h;
                                               canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
                                               setCertForm({...certForm, fileData: canvas.toDataURL('image/jpeg', 0.8)});
                                            };
                                            img.src = reader.result as string;
                                         } else {
                                            setCertForm({...certForm, fileData: reader.result as string});
                                         }
                                      };
                                      reader.readAsDataURL(file);
                                   }
                                }} className="text-xs w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-black hover:file:bg-gray-200 cursor-pointer mb-2" />
                                {certForm.fileData && <div className="text-[10px] font-bold text-green-600 uppercase flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Asset loaded</div>}
                              </div>
                              <button type="submit" disabled={certLoading} className="w-full bg-black text-white font-black py-3 rounded-xl mt-4 hover:bg-gray-900 transition-colors disabled:opacity-50 flex justify-center items-center gap-2">
                                {certLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Award className="w-4 h-4"/>} {certLoading ? 'Issuing...' : 'Issue Certificate'}
                              </button>
                            </div>
                         </form>
                      </div>
                      
                      <div className="lg:col-span-2 space-y-4">
                        {(Array.isArray(data) ? data : []).length === 0 && (
                          <div className="p-8 text-center text-gray-400 font-bold bg-white border border-gray-200 rounded-2xl">No certificates issued yet.</div>
                        )}
                        {(Array.isArray(data) ? data : []).map((c: any) => (
                          <div key={c._id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-6 justify-between items-center hover:border-black transition-colors">
                             <div className="flex-1 w-full">
                               <h3 className="font-bold text-lg">{c.description}</h3>
                               <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">Issued to: <span className="text-black font-black">{c.user?.fullName}</span> <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[10px] ml-2">{c.usn}</span></p>
                               <p className="text-[10px] font-bold text-gray-400 uppercase mt-3 tracking-widest">{new Date(c.issuedAt).toLocaleDateString()}</p>
                             </div>
                             <div className="flex gap-3 shrink-0">
                               <a href={c.fileData} download={`Certificate-${c.usn}`} className="p-3 text-black bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2">View</a>
                               <button onClick={() => handleDeleteCertificate(c._id)} className="p-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl"><Trash2 className="w-5 h-5"/></button>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>
                 </motion.div>
               )}

               {/* GLOBAL SETTINGS */}
               {activeTab === 'settings' && settingsForm && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                   <div className="flex justify-between items-end mb-8">
                     <div>
                       <h1 className="text-3xl font-bold mb-2">Content Management</h1>
                       <p className="text-gray-500">Override hardcoded sections of the live landing page.</p>
                     </div>
                     <button onClick={handleUpdateSettings} disabled={loading} className="px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-colors shadow-lg shadow-black/10 flex items-center gap-2">
                       {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : null} Publish All Changes
                     </button>
                   </div>
                   
                   <div className="space-y-8 pb-20">
                     
                     {/* HERO SECTION */}
                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                       <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><SettingsIcon className="w-5 h-5 text-amber-500"/> Hero Section</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                         <div>
                           <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Main Headline</label>
                           <input value={settingsForm.heroText?.title || ''} onChange={e => setSettingsForm({...settingsForm, heroText: {...settingsForm.heroText, title: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:outline-none focus:border-black" />
                         </div>
                         <div>
                           <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Subtitle</label>
                           <input value={settingsForm.heroText?.subtitle || ''} onChange={e => setSettingsForm({...settingsForm, heroText: {...settingsForm.heroText, subtitle: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black" />
                         </div>
                       </div>
                       
                       <h4 className="text-sm font-bold text-gray-600 mb-4">Live Metrics Map</h4>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {settingsForm.heroCounts?.map((hero: any, idx: number) => (
                           <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
                             <input value={hero.title} onChange={e => {
                               const newC = [...settingsForm.heroCounts]; newC[idx].title = e.target.value; setSettingsForm({...settingsForm, heroCounts: newC});
                             }} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:border-black mb-3" />
                             <input type="number" value={hero.count} onChange={e => {
                               const newC = [...settingsForm.heroCounts]; newC[idx].count = Number(e.target.value); setSettingsForm({...settingsForm, heroCounts: newC});
                             }} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-lg font-mono text-amber-600 font-bold focus:outline-none focus:border-black" />
                           </div>
                         ))}
                       </div>
                     </div>

                     {/* MISSION & VISION */}
                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                       <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Users className="w-5 h-5 text-amber-500"/> Our Story (Mission & Vision)</h3>
                       <div className="flex flex-col lg:flex-row gap-8">
                         <div className="lg:w-1/3">
                           <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Section Image</label>
                           <div className="aspect-[4/5] bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group">
                             {settingsForm.mission?.image ? <img src={settingsForm.mission.image} className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-gray-400" />}
                             <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                               <span className="text-white text-xs font-bold">Replace Image</span>
                               <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                                 const file = e.target.files?.[0];
                                 if (file) {
                                   const reader = new FileReader();
                                   reader.onload = () => setSettingsForm({...settingsForm, mission: {...settingsForm.mission, image: reader.result}});
                                   reader.readAsDataURL(file);
                                 }
                               }}/>
                             </div>
                           </div>
                         </div>
                         <div className="lg:w-2/3 space-y-4">
                           <div>
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Heading Title</label>
                             <input value={settingsForm.mission?.title || ''} onChange={e => setSettingsForm({...settingsForm, mission: {...settingsForm.mission, title: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:outline-none focus:border-black" />
                           </div>
                           <div>
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Paragraph 1</label>
                             <textarea rows={4} value={settingsForm.mission?.description1 || ''} onChange={e => setSettingsForm({...settingsForm, mission: {...settingsForm.mission, description1: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black resize-none" />
                           </div>
                                                       <div>
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Paragraph 2</label>
                              <textarea rows={4} value={settingsForm.mission?.description2 || ''} onChange={e => setSettingsForm({...settingsForm, mission: {...settingsForm.mission, description2: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black resize-none" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                              <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Vision Tagline</label>
                                <textarea rows={3} value={settingsForm.mission?.visionText || ''} onChange={e => setSettingsForm({...settingsForm, mission: {...settingsForm.mission, visionText: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black resize-none" />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Mission Tagline</label>
                                <textarea rows={3} value={settingsForm.mission?.missionText || ''} onChange={e => setSettingsForm({...settingsForm, mission: {...settingsForm.mission, missionText: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black resize-none" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                     {/* WHY JOIN US CARDS */}
                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                       <div className="flex justify-between items-center mb-6">
                         <h3 className="font-bold text-xl flex items-center gap-2"><Activity className="w-5 h-5 text-amber-500"/> Why Join Us Cards</h3>
                         <button onClick={() => setSettingsForm({...settingsForm, whyJoinUs: [...(settingsForm.whyJoinUs || []), {title: 'New Card', description: 'Description here'}]})} className="px-4 py-2 bg-amber-100 text-amber-800 font-bold rounded-lg hover:bg-amber-200 text-xs">+ Add Card</button>
                       </div>
                       <p className="text-sm text-gray-500 mb-6">Cards are automatically numbered based on their sequence (01, 02...). Removing a card shifts the rest up.</p>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {settingsForm.whyJoinUs?.map((card: any, idx: number) => (
                           <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative group">
                             <button onClick={() => {
                               const arr = [...settingsForm.whyJoinUs]; arr.splice(idx, 1); setSettingsForm({...settingsForm, whyJoinUs: arr});
                             }} className="absolute top-2 right-2 p-2 z-10 bg-red-100 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
                             
                             <div className="flex items-center gap-4 mb-4">
                               <div className="text-4xl font-black text-gray-200">{String(idx + 1).padStart(2, '0')}</div>
                               <div className="mr-auto"></div>
                               {/* Image Uploader */}
                               <div className="w-16 h-16 rounded-xl bg-gray-200 border border-gray-300 flex items-center justify-center relative overflow-hidden group/img shrink-0 shadow-sm">
                                 {card.image ? <img src={card.image} className="w-full h-full object-cover" /> : <Camera className="w-6 h-6 text-gray-400" />}
                                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer">
                                   <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                                     const file = e.target.files?.[0];
                                     if (file) {
                                       const reader = new FileReader();
                                       reader.onload = () => {
                                         const arr = [...settingsForm.whyJoinUs]; 
                                         arr[idx].image = reader.result; 
                                         setSettingsForm({...settingsForm, whyJoinUs: arr});
                                       };
                                       reader.readAsDataURL(file);
                                     }
                                   }}/>
                                 </div>
                               </div>
                             </div>

                             <input value={card.title} onChange={e => {
                               const arr = [...settingsForm.whyJoinUs]; arr[idx].title = e.target.value; setSettingsForm({...settingsForm, whyJoinUs: arr});
                             }} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:border-black mb-3" placeholder="Card Title"/>
                             <textarea rows={3} value={card.description} onChange={e => {
                               const arr = [...settingsForm.whyJoinUs]; arr[idx].description = e.target.value; setSettingsForm({...settingsForm, whyJoinUs: arr});
                             }} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black resize-none" placeholder="Description..."/>
                           </div>
                         ))}
                       </div>
                     </div>

                     {/* PRINCIPAL MESSAGE */}
                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                       <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><UserIcon className="w-5 h-5 text-amber-500"/> Principal Message</h3>
                       <div className="flex flex-col md:flex-row gap-8 items-start">
                         <div className="flex-shrink-0">
                           <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Display Photo</label>
                           <div className="w-32 h-32 rounded-full border-4 border-gray-100 bg-gray-50 flex items-center justify-center relative overflow-hidden group">
                             {settingsForm.principal?.image ? <img src={settingsForm.principal.image} className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-gray-300" />}
                             <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                               <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                                 const file = e.target.files?.[0];
                                 if (file) {
                                   const reader = new FileReader();
                                   reader.onload = () => setSettingsForm({...settingsForm, principal: {...settingsForm.principal, image: reader.result}});
                                   reader.readAsDataURL(file);
                                 }
                               }}/>
                               <span className="text-white text-[10px] font-bold">Replace</span>
                             </div>
                           </div>
                         </div>
                         <div className="flex-grow space-y-4 w-full">
                           <div>
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Name & Title</label>
                             <input value={settingsForm.principal?.name || ''} onChange={e => setSettingsForm({...settingsForm, principal: {...settingsForm.principal, name: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:outline-none focus:border-black" />
                           </div>
                           <div>
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Quote / Message</label>
                             <textarea rows={4} value={settingsForm.principal?.message || ''} onChange={e => setSettingsForm({...settingsForm, principal: {...settingsForm.principal, message: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black resize-none" />
                           </div>
                         </div>
                       </div>
                     </div>

                     {/* FOOTER CONFIGURATION */}
                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                       <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><SettingsIcon className="w-5 h-5 text-amber-500"/> Footer Attributes</h3>
                       
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                         {/* Contacts */}
                         <div>
                           <h4 className="text-sm font-bold text-gray-600 mb-4 uppercase tracking-wider">Contact Info Visibility</h4>
                           <div className="space-y-4">
                             {['phone', 'email', 'address'].map(field => (
                               <div key={field} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                 <button onClick={(e) => {
                                   e.preventDefault();
                                   const newContact = {...settingsForm.footer?.contact};
                                   newContact[field].visible = !newContact[field].visible;
                                   setSettingsForm({...settingsForm, footer: {...settingsForm.footer, contact: newContact}});
                                 }} className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 ${settingsForm.footer?.contact?.[field]?.visible ? 'bg-green-500' : 'bg-gray-300'}`}>
                                   <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settingsForm.footer?.contact?.[field]?.visible ? 'translate-x-6' : 'translate-x-0'}`} />
                                 </button>
                                 <div className="flex-grow">
                                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{field}</label>
                                   <input value={field === 'address' ? settingsForm.footer?.contact?.[field]?.name || '' : settingsForm.footer?.contact?.[field]?.value || ''} onChange={e => {
                                     const newContact = {...settingsForm.footer?.contact};
                                     if (field === 'address') {
                                       newContact[field].name = e.target.value;
                                     } else {
                                       newContact[field].value = e.target.value;
                                     }
                                     setSettingsForm({...settingsForm, footer: {...settingsForm.footer, contact: newContact}});
                                   }} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
                                 </div>
                               </div>
                             ))}
                           </div>
                         </div>

                         {/* Quick Links & Logo */}
                         <div className="space-y-8">
                           <div>
                             <h4 className="text-sm font-bold text-gray-600 mb-4 uppercase tracking-wider">Club Logo Overwrite</h4>
                             <div className="flex items-center gap-6">
                               <div className="w-20 h-20 bg-black rounded-xl flex items-center justify-center p-2 relative overflow-hidden group">
                                 {settingsForm.footer?.logo ? <img src={settingsForm.footer.logo} className="w-full h-full object-contain" /> : <span className="text-white text-xs font-bold text-center">Default Logo</span>}
                                 <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                                   const file = e.target.files?.[0];
                                   if (file) {
                                     const reader = new FileReader();
                                     reader.onload = () => setSettingsForm({...settingsForm, footer: {...settingsForm.footer, logo: reader.result}});
                                     reader.readAsDataURL(file);
                                   }
                                 }}/>
                               </div>
                               <p className="text-xs text-gray-500 max-w-xs">Upload a custom logo to inject into the footer. If left empty, falls back to default. Replaces the white circle background.</p>
                             </div>
                           </div>

                           {/* Quick Links manager removed by request */}
                         </div>
                       </div>
                     </div>

                   </div>
                 </motion.div>
               )}

               {/* CORE TEAM TAB */}
               {activeTab === 'team' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                   <h1 className="text-3xl font-bold mb-2">Core Team Configuration</h1>
                   <p className="text-gray-500 mb-8">Manage Principal details, Faculty Advisers, and Student Coordinators.</p>
                   
                   <form onSubmit={handleUpdateTeam} className="space-y-8 max-w-5xl">
                     {/* Principal */}
                     <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm">
                       <h3 className="font-black text-xl mb-6">Principal Configuration</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Name</label>
                           <input required value={teamForm.principal?.name || ''} onChange={e => setTeamForm({...teamForm, principal: {...teamForm.principal, name: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none font-bold" />
                         </div>
                         <div>
                           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Title</label>
                           <input required value={teamForm.principal?.title || ''} onChange={e => setTeamForm({...teamForm, principal: {...teamForm.principal, title: e.target.value}})} placeholder="e.g. Chief Patron, Principal" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none font-bold" />
                         </div>
                         <div className="md:col-span-2">
                           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Message</label>
                           <textarea required value={teamForm.principal?.message || ''} onChange={e => setTeamForm({...teamForm, principal: {...teamForm.principal, message: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none h-24 font-medium" />
                         </div>
                         <div className="md:col-span-2 flex items-center gap-4">
                           <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200 relative group cursor-pointer">
                             {teamForm.principal?.image ? <img src={teamForm.principal.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center text-gray-400"><Camera className="w-6 h-6"/></div>}
                             <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e)=>{
                               const file=e.target.files?.[0];
                               if(file){ const reader=new FileReader(); reader.onload=()=>setTeamForm({...teamForm, principal: {...teamForm.principal, image: reader.result}}); reader.readAsDataURL(file); }
                             }} />
                           </div>
                           <p className="text-xs text-gray-500 font-bold max-w-xs">Upload Principal portrait. Optimal aspect ratio 1:1.</p>
                         </div>
                       </div>
                     </div>

                     {/* Faculty */}
                     <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm">
                       <div className="flex justify-between items-center mb-6">
                         <h3 className="font-black text-xl">Faculty Advisers</h3>
                         <button type="button" onClick={() => setTeamForm({...teamForm, faculties: [...(teamForm.faculties || []), {name: '', image: ''}]})} className="text-xs font-bold bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">Add Faculty</button>
                       </div>
                       <div className="space-y-4">
                         {(teamForm.faculties || []).map((fac: any, idx: number) => (
                           <div key={idx} className="flex flex-col md:flex-row items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                             <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200 relative cursor-pointer">
                                {fac.image ? <img src={fac.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><Camera className="w-5 h-5"/></div>}
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e)=>{
                                   const file=e.target.files?.[0];
                                   if(file){ const reader=new FileReader(); reader.onload=()=>{
                                      const newFac = [...teamForm.faculties]; newFac[idx].image = reader.result; setTeamForm({...teamForm, faculties: newFac});
                                   }; reader.readAsDataURL(file); }
                                }} />
                             </div>
                             <input required value={fac.name} placeholder="Faculty Name" onChange={e => {
                                const newFac = [...teamForm.faculties]; newFac[idx].name = e.target.value; setTeamForm({...teamForm, faculties: newFac});
                             }} className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-black outline-none font-bold text-sm w-full md:w-auto" />
                             <button type="button" onClick={() => {
                                const newFac = teamForm.faculties.filter((_:any, i:number) => i !== idx); setTeamForm({...teamForm, faculties: newFac});
                             }} className="p-3 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 className="w-5 h-5"/></button>
                           </div>
                         ))}
                         {(!teamForm.faculties || teamForm.faculties.length === 0) && <p className="text-sm text-gray-500 text-center py-4 font-bold">No Faculty Advisers added.</p>}
                       </div>
                     </div>

                     {/* Coordinators */}
                     <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm">
                       <div className="flex justify-between items-center mb-6">
                         <div>
                           <h3 className="font-black text-xl">Student Coordinators</h3>
                           <p className="text-xs font-bold text-gray-400 mt-1">Provide USN and Title. System fetches photo & branch details dynamically.</p>
                         </div>
                         <button type="button" onClick={() => setTeamForm({...teamForm, coordinators: [...(teamForm.coordinators || []), {usn: '', title: ''}]})} className="text-xs font-bold bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">Add Coordinator</button>
                       </div>
                       <div className="space-y-4">
                         {(teamForm.coordinators || []).map((coord: any, idx: number) => (
                           <div key={idx} className="flex flex-col md:flex-row items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                             <input required value={coord.usn} placeholder="Student USN" onChange={e => {
                                const newCoord = [...teamForm.coordinators]; newCoord[idx].usn = e.target.value.toUpperCase(); setTeamForm({...teamForm, coordinators: newCoord});
                             }} className="w-full md:w-1/3 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-black outline-none font-bold text-sm uppercase" />
                             <input required value={coord.title} placeholder="Title (e.g. President)" onChange={e => {
                                const newCoord = [...teamForm.coordinators]; newCoord[idx].title = e.target.value; setTeamForm({...teamForm, coordinators: newCoord});
                             }} className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-black outline-none font-bold text-sm w-full md:w-auto" />
                             <button type="button" onClick={() => {
                                const newCoord = teamForm.coordinators.filter((_:any, i:number) => i !== idx); setTeamForm({...teamForm, coordinators: newCoord});
                             }} className="p-3 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 className="w-5 h-5"/></button>
                           </div>
                         ))}
                         {(!teamForm.coordinators || teamForm.coordinators.length === 0) && <p className="text-sm text-gray-500 text-center py-4 font-bold">No Student Coordinators added.</p>}
                       </div>
                     </div>

                     <div className="text-right">
                       <button type="submit" disabled={teamLoading} className="px-10 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-colors shadow-xl shadow-black/10 inline-flex items-center gap-3 disabled:opacity-50">
                         {teamLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5"/>}
                         {teamLoading ? 'Synchronizing...' : 'Save Core Team'}
                       </button>
                     </div>
                   </form>
                 </motion.div>
               )}

               {/* PROFILE TAB */}
               {activeTab === 'profile' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                   <h1 className="text-3xl font-bold mb-2">Admin Identity Layer</h1>
                   <p className="text-gray-500 mb-8">Manage your database credential signatures.</p>
                   
                   <form onSubmit={handleProfileUpdate} className="max-w-3xl bg-white border border-gray-200 p-10 rounded-3xl shadow-sm">
                     <div className="mb-10 flex flex-col sm:flex-row items-center gap-8 pb-10 border-b border-gray-100">
                       <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                         {profileData.profileImage ? (
                            <img src={profileData.profileImage} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-gray-50 shadow-xl group-hover:opacity-75 transition-opacity" />
                         ) : (
                            <div className="w-32 h-32 rounded-full bg-black flex flex-col items-center justify-center text-white border-4 border-gray-50 shadow-xl group-hover:opacity-75 transition-opacity">
                              <UserIcon className="w-10 h-10 opacity-50 mb-1" />
                            </div>
                         )}
                         <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-8 h-8 text-white mb-1" />
                         </div>
                         <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                       </div>
                       <div className="text-center sm:text-left">
                         <h3 className="font-black text-2xl">Identity Avatar</h3>
                         <p className="text-sm text-gray-500 mt-2 max-w-sm leading-relaxed">System Avatar injected across active components resolving this root identity node.</p>
                         {profileData.profileImage && (
                           <button type="button" onClick={() => setProfileData({ ...profileData, profileImage: '' })} className="text-xs text-red-500 font-bold mt-4 px-4 py-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                             Scrub Graphic
                           </button>
                         )}
                       </div>
                     </div>

                     <div className="space-y-6 bg-gray-50 border border-gray-100 rounded-2xl p-8 mb-8">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Root Administrator Handle</label>
                         <input name="fullName" value={profileData.fullName} onChange={handleProfileChange} required className="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Root Dispatch Email</label>
                         <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} required className="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900" />
                       </div>
                     </div>

                     {profileMessage && (
                       <div className={`mb-4 p-4 rounded-xl text-sm font-bold border ${profileMessage.includes('success') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                         {profileMessage}
                       </div>
                     )}

                     <div className="mt-4 text-right">
                       <button type="submit" disabled={updating} className="px-10 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-colors shadow-xl shadow-black/10 inline-flex items-center gap-3 disabled:opacity-50">
                         {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5"/>}
                         {updating ? 'Persisting...' : 'Seal Changes'}
                       </button>
                     </div>
                   </form>

                   <form onSubmit={handleChangePassword} className="max-w-3xl bg-white border border-gray-200 p-10 rounded-3xl shadow-sm mt-8">
                     <div className="mb-8">
                        <h3 className="font-black text-2xl flex items-center gap-3"><ShieldAlert className="w-6 h-6 text-amber-500" /> Security Overrides</h3>
                        <p className="text-sm text-gray-500 mt-2">Modify the master passkey for the root administrator account.</p>
                     </div>

                     <div className="space-y-6 bg-gray-50 border border-gray-100 rounded-2xl p-8">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Current Terminal Key</label>
                         <input type="password" required value={passForm.oldPassword} onChange={e=>setPassForm({...passForm, oldPassword: e.target.value})} className="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900" />
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">New Passkey</label>
                           <input type="password" required value={passForm.newPassword} onChange={e=>setPassForm({...passForm, newPassword: e.target.value})} className="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Confirm Security Passkey</label>
                           <input type="password" required value={passForm.confirmPassword} onChange={e=>setPassForm({...passForm, confirmPassword: e.target.value})} className="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900" />
                         </div>
                       </div>
                       <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Requires 1 uppercase, 1 lowercase, 1 number, & 1 special character.</div>
                     </div>

                     {passMessage && (
                       <div className={`mt-8 p-4 rounded-xl text-sm font-bold border ${passMessage.includes('success') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                         {passMessage.replace('success: ', '')}
                       </div>
                     )}

                     <div className="mt-8 text-right">
                       <button type="submit" disabled={passLoading} className="px-10 py-4 border-2 border-black bg-white text-black font-black rounded-xl hover:bg-black hover:text-white transition-all inline-flex items-center gap-3 disabled:opacity-50">
                         {passLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                         {passLoading ? 'Updating Cryptography...' : 'Commit Passkey'}
                       </button>
                     </div>
                   </form>
                 </motion.div>
               )}

             </>
           )}
        </div>
      </div>

      {/* Floating Attendance Modal Overlay */}
      <AnimatePresence>
        {showAttendanceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h2 className="text-2xl font-black flex items-center gap-3"><CheckCircle className="text-green-500 w-6 h-6"/> Centralized Roster Sheet</h2>
                  <p className="text-sm text-gray-500 mt-2">Log presence instantly into the centralized database layer.</p>
                </div>
                <button onClick={() => setShowAttendanceModal(null)} className="p-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-black hover:text-white transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto">
                {(() => {
                  const currentEvent = (data || []).find((e:any) => e._id === showAttendanceModal);
                  const attendeeSet = new Set(currentEvent?.attendees?.map((a:any) => typeof a === 'object' ? a._id : a));
                  return globalUsers.filter(u=> u.role !== 'admin').map((u) => {
                    const isPresent = attendeeSet.has(u._id);
                    return (
                      <div key={u._id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isPresent ? 'bg-green-50/50 border-green-200 shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                        <div className="w-full pr-4 overflow-hidden">
                          <p className="font-bold text-sm truncate">{u.fullName}</p>
                          <p className="text-[10px] text-gray-500 font-mono mt-1">{u.usn}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => handleToggleAttendance(showAttendanceModal, u._id)} disabled={isPresent} className={`w-10 h-10 rounded-xl font-black transition-all ${isPresent ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>P</button>
                          <button onClick={() => handleToggleAttendance(showAttendanceModal, u._id)} disabled={!isPresent} className={`w-10 h-10 rounded-xl font-black transition-all ${!isPresent ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>A</button>
                        </div>
                      </div>
                    )
                  });
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Move To Past Archive Modal */}
      <AnimatePresence>
        {showMovePastModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="p-8 border-b border-amber-100 flex justify-between items-center bg-amber-50">
                <div>
                  <h2 className="text-2xl font-black text-amber-900 flex items-center gap-3">Close Active Session</h2>
                  <p className="text-sm text-amber-700/70 mt-2 font-medium">Render this event into the unauthenticated public archives.</p>
                </div>
                <button onClick={() => setShowMovePastModal(null)} className="p-2 bg-white text-gray-400 rounded-xl shadow-sm border border-transparent hover:border-gray-200 hover:text-black transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleMoveToPast} className="p-8 space-y-8 max-h-[75vh] overflow-y-auto">
                <div>
                  <div className="flex justify-between items-center mb-4">
                     <div>
                       <label className="text-sm font-black text-black block uppercase tracking-wide">Session Winners</label>
                       <p className="text-xs text-gray-500 mt-1">Add recognized performers.</p>
                     </div>
                     <button type="button" onClick={() => setPastForm({ ...pastForm, winners: [...pastForm.winners, { usn: '', title: '', image: '' }] })} className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-2 rounded-lg hover:bg-amber-200">+ Add Winner</button>
                  </div>
                  
                  <div className="space-y-4">
                    {pastForm.winners.map((win, idx) => (
                      <div key={idx} className="p-4 border border-gray-200 bg-gray-50 rounded-xl flex flex-col gap-3 relative">
                         {pastForm.winners.length > 1 && (
                            <button type="button" onClick={() => {
                               const newW = [...pastForm.winners];
                               newW.splice(idx, 1);
                               setPastForm({...pastForm, winners: newW});
                            }} className="absolute top-2 right-2 text-red-500 p-1 hover:bg-red-50 rounded"><X className="w-4 h-4"/></button>
                         )}
                         <input required value={win.usn} onChange={e => {
                            const newW = [...pastForm.winners];
                            newW[idx].usn = e.target.value;
                            setPastForm({...pastForm, winners: newW});
                         }} placeholder="Winner USN" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-black uppercase" />
                         
                         <input value={win.title} onChange={e => {
                            const newW = [...pastForm.winners];
                            newW[idx].title = e.target.value;
                            setPastForm({...pastForm, winners: newW});
                         }} placeholder="Title (e.g. 1st Place, Best Speaker)" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:border-black" />
                         
                         <div className="flex items-center gap-3">
                           <input type="file" accept="image/*" onChange={(e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                               const reader = new FileReader();
                               reader.onloadend = () => {
                                 const newW = [...pastForm.winners];
                                 newW[idx].image = reader.result as string;
                                 setPastForm({...pastForm, winners: newW});
                               };
                               reader.readAsDataURL(file);
                             }
                           }} className="text-xs w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer" />
                           {win.image && <div className="w-10 h-10 shrink-0 border border-gray-200 rounded-lg overflow-hidden"><img src={win.image} className="w-full h-full object-cover"/></div>}
                         </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                     <div>
                       <label className="text-sm font-black text-black block uppercase tracking-wide">Event Gallery</label>
                       <p className="text-xs text-gray-500 mt-1">Upload multiple photos from your device.</p>
                     </div>
                  </div>
                  <input type="file" multiple accept="image/*" onChange={(e) => {
                     const files = Array.from(e.target.files || []);
                     files.forEach(file => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                           const img = new Image();
                           img.onload = () => {
                             const canvas = document.createElement('canvas');
                             const MAX_WIDTH = 1200;
                             let width = img.width;
                             let height = img.height;
                             if (width > MAX_WIDTH) {
                               height = height * (MAX_WIDTH / width);
                               width = MAX_WIDTH;
                             }
                             canvas.width = width;
                             canvas.height = height;
                             const ctx = canvas.getContext('2d');
                             ctx?.drawImage(img, 0, 0, width, height);
                             const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                             setPastForm(prev => ({ ...prev, galleryURLs: [...prev.galleryURLs, dataUrl] }));
                           };
                           img.src = reader.result as string;
                        };
                        reader.readAsDataURL(file);
                     });
                  }} className="text-sm w-full text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-black hover:file:bg-gray-200 cursor-pointer mb-4" />
                  
                  {pastForm.galleryURLs.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                       {pastForm.galleryURLs.map((img, idx) => (
                         <div key={idx} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                           <img src={img} className="w-full h-full object-cover"/>
                           <button type="button" onClick={() => {
                             const newG = [...pastForm.galleryURLs];
                             newG.splice(idx, 1);
                             setPastForm({...pastForm, galleryURLs: newG});
                           }} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100"><X className="w-5 h-5"/></button>
                         </div>
                       ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4 border-t border-amber-100">
                  <button type="button" onClick={() => setShowMovePastModal(null)} className="flex-1 py-4 bg-gray-100 text-black font-black hover:bg-gray-200 rounded-xl transition-colors">Abort Changes</button>
                  <button type="submit" disabled={archiveLoading} className="flex-[2] flex justify-center items-center gap-2 py-4 bg-amber-500 text-white font-black rounded-xl hover:bg-amber-600 shadow-xl shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50">
                    {archiveLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : null}
                    {archiveLoading ? 'Archiving...' : 'Hard Archive Event Execution'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-200 overflow-hidden">
              <div className="p-8 border-b border-red-100 flex justify-between items-center bg-red-50">
                <div>
                  <h2 className="text-2xl font-black text-red-900 flex items-center gap-3">Critical Warning</h2>
                  <p className="text-sm text-red-700/70 mt-2 font-medium">You are about to permanently purge this event.</p>
                </div>
                <button type="button" onClick={() => setShowDeleteModal(null)} className="p-2 bg-white text-gray-400 rounded-xl shadow-sm border border-transparent hover:border-gray-200 hover:text-black transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleConfirmDelete} className="p-8 space-y-6">
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm font-medium text-gray-700">
                  Type the exact title <span className="font-black text-black select-all">"{showDeleteModal.title}"</span> below to verify this destructive action.
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Confirm Title Match</label>
                  <input required value={deleteInput} onChange={e => setDeleteInput(e.target.value)} placeholder="Wait! Type title here..." className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 font-bold" />
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setShowDeleteModal(null)} className="flex-1 py-4 bg-gray-100 text-black font-black hover:bg-gray-200 rounded-xl transition-colors">Abort</button>
                  <button type="submit" disabled={deleteLoading || !deleteInput} className="flex-[2] flex justify-center items-center gap-2 py-4 bg-red-500 text-white font-black rounded-xl hover:bg-red-600 shadow-xl shadow-red-500/20 transition-all active:scale-95 disabled:opacity-50">
                    {deleteLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Trash2 className="w-5 h-5"/>}
                    {deleteLoading ? 'Purging...' : 'Confirm Purge Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
