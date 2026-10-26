import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  FileCheck2, 
  Sparkles, 
  Lock, 
  LogOut, 
  ArrowLeft, 
   
  AlertCircle,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import { ProjectManagement } from './ProjectManagement';
import { ResumeDisplay } from './ResumeDisplay';
import { ResumeStudio } from './ResumeStudio';

export const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ id: string; email: string; name: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'resume_display' | 'resume_studio'>('projects');
  const [selectedStudioResumeId, setSelectedStudioResumeId] = useState<string | null>(null);

  // Login form state
  const [email, setEmail] = useState('shreya.roy1818@gmail.com');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await axios.get('/api/auth/session');
      if (res.data?.authenticated && res.data?.user) {
        setIsAuthenticated(true);
        setUser(res.data.user);
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data?.success && res.data?.user) {
        setIsAuthenticated(true);
        setUser(res.data.user);
      } else {
        setLoginError('Invalid credentials');
      }
    } catch (err: any) {
      setLoginError(err.response?.data?.error || err.message || 'Login failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (e) {}
    setIsAuthenticated(false);
    setUser(null);
  };

  // Loading session
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#030305] flex items-center justify-center text-slate-400">
        <RefreshCw size={24} className="animate-spin text-indigo-500 mr-3" />
        <span>Verifying Neon Auth session...</span>
      </div>
    );
  }

  // Auth Wall Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030305] text-[#E2E8F0] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        
        {/* Ambient Glow */}
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 100%)' }}
        />

        <div className="relative w-full max-w-md p-8 md:p-10 rounded-3xl bg-[#0a0a0f]/90 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
              <Lock size={26} />
            </div>
            <h1 className="font-bold text-2xl text-white tracking-tight">Admin Portal</h1>
            <p className="text-xs text-slate-400">
              Secured with Neon Auth. Only authorized administrators may proceed.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Authorized Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="shreya.roy1818@gmail.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loginLoading ? <RefreshCw size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              {loginLoading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          <div className="text-center pt-2">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <ArrowLeft size={13} />
              Return to Public Portfolio
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Portal View
  return (
    <div className="min-h-screen bg-[#030305] text-[#E2E8F0] font-sans">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/90 border-b border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <h1 className="font-bold text-base text-white tracking-wide">
                Shreya Roy <span className="text-indigo-400 font-mono text-xs">/ Admin</span>
              </h1>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'projects'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FolderGit2 size={14} />
                Projects
              </button>

              <button
                onClick={() => setActiveTab('resume_display')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'resume_display'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCheck2 size={14} />
                Public Resume
              </button>

              <button
                onClick={() => setActiveTab('resume_studio')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'resume_studio'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles size={14} />
                AI Resume Studio
              </button>
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              <ArrowLeft size={13} />
              Portfolio
            </a>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
              <span className="text-slate-500">user:</span> {user?.email}
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>

        </div>

        {/* Mobile Tab Bar */}
        <div className="md:hidden flex border-t border-white/5 px-4 py-2 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1 rounded-lg ${activeTab === 'projects' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('resume_display')}
            className={`px-3 py-1 rounded-lg ${activeTab === 'resume_display' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Resume
          </button>
          <button
            onClick={() => setActiveTab('resume_studio')}
            className={`px-3 py-1 rounded-lg ${activeTab === 'resume_studio' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Studio
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'projects' && <ProjectManagement />}
        {activeTab === 'resume_display' && (
          <ResumeDisplay
            onOpenStudioWithResume={(id) => {
              setSelectedStudioResumeId(id);
              setActiveTab('resume_studio');
            }}
            onSwitchToStudio={() => {
              setSelectedStudioResumeId(null);
              setActiveTab('resume_studio');
            }}
          />
        )}
        {activeTab === 'resume_studio' && (
          <ResumeStudio initialResumeId={selectedStudioResumeId} />
        )}
      </main>

    </div>
  );
};
