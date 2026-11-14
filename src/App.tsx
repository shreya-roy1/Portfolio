import { AdminApp } from './components/Admin/AdminApp';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, Mail, MessageSquare, Send, X, CheckCircle2, Home, User, Briefcase, Share2, Download, FileText } from 'lucide-react';
import { PdfViewer } from './components/PdfViewer';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import TechMatrixSection from './sections/TechMatrixSection';
import ProjectsSection from './sections/ProjectsSection';
import FooterSection from './sections/FooterSection';

export const App: React.FC = () => {
  // Simple path routing for admin portal
  const [isAdminPath, setIsAdminPath] = useState(() => 
    typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
  );

  useEffect(() => {
    const handlePopState = () => {
      setIsAdminPath(window.location.pathname.startsWith('/admin'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (isAdminPath) {
    return <AdminApp />;
  }
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic resume route state (e.g. /resumes/Shreya_s_Resume.pdf)
  const [resumeRouteState, setResumeRouteState] = useState<{
    isActive: boolean;
    loading: boolean;
    found: boolean;
    requestedName: string;
    resume: {
      id: string;
      title: string;
      safe_title: string;
      pdf_url: string;
      target_role?: string;
      target_company?: string;
    } | null;
    availableResumes: Array<{ title: string; url: string }>;
  }>(() => {
    const isResume = typeof window !== 'undefined' && window.location.pathname.startsWith('/resumes');
    const slug = typeof window !== 'undefined' ? window.location.pathname.replace(/^\/resumes\/?/, '') : '';
    return {
      isActive: isResume,
      loading: isResume,
      found: false,
      requestedName: slug,
      resume: null,
      availableResumes: [],
    };
  });

  useEffect(() => {
    if (resumeRouteState.isActive && resumeRouteState.loading) {
      axios
        .get('/api/resumes/resolve?filename=' + encodeURIComponent(resumeRouteState.requestedName))
        .then((res) => {
          if (res.data?.found) {
            setResumeRouteState((prev) => ({
              ...prev,
              loading: false,
              found: true,
              resume: res.data.resume,
              availableResumes: [],
            }));
          } else {
            setResumeRouteState((prev) => ({
              ...prev,
              loading: false,
              found: false,
              availableResumes: res.data?.available_resumes || [],
            }));
          }
        })
        .catch(() => {
          setResumeRouteState((prev) => ({
            ...prev,
            loading: false,
            found: false,
            availableResumes: [],
          }));
        });
    }
  }, [resumeRouteState.isActive, resumeRouteState.loading, resumeRouteState.requestedName]);
  
  // Header animation states
  const [activeTab, setActiveTab] = useState<string>('home');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  // Contact form fields
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Viewport scroll references
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSocials = () => {
    const el = document.getElementById('resume');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll observer to automatically sync active tab
  useEffect(() => {
    const sections = ['home', 'about', 'projects', 'resume'];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveTab(id === 'resume' ? 'socials' : id);
            }
          });
        },
        { threshold: 0.25 }
      );
      
      observer.observe(el);
      return { observer, el };
    });
    
    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsContactOpen(false);
      setFormData({ name: '', email: '', message: '' });
      showToast('Message sent successfully!');
    }, 1500);
  };

  const handleResumePreview = (e?: React.MouseEvent<HTMLAnchorElement>) => {
    e?.preventDefault();
    setIsResumeOpen(true);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <main className="main-wrapper relative select-none bg-[#030305] text-[#E2E8F0]">
      
      {/* GLOBAL STICKY HEADER NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-[#030305]/65 backdrop-blur-lg border-b border-white/5 font-mono select-none">
        {/* Left: Brand */}
        <a 
          href="#home" 
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('home');
            scrollToHome();
          }}
          className="text-xs md:text-sm tracking-widest text-[#E2E8F0] font-black uppercase hover:text-indigo-400 transition-all duration-300 relative group"
        >
          <span>portfolio</span>
          <span className="absolute bottom-[-4px] left-0 w-0 h-[1.5px] bg-indigo-400 group-hover:w-full transition-all duration-300" />
        </a>

        {/* Right: Headings in a floating glass pill container */}
        <div className="flex gap-1 sm:gap-2 border border-white/5 bg-white/[0.02] backdrop-blur-md rounded-full px-2 py-1 relative">
          {[
            { id: 'home', label: 'home', icon: Home, action: scrollToHome },
            { id: 'about', label: 'about', icon: User, action: scrollToAbout },
            { id: 'projects', label: 'projects', icon: Briefcase, action: scrollToProjects },
            { id: 'socials', label: 'socials', icon: Share2, action: scrollToSocials },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onMouseEnter={() => setHoveredTab(item.id)}
                onMouseLeave={() => setHoveredTab(null)}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item.id);
                  item.action();
                }}
                className={`relative px-3 py-1.5 rounded-full text-[10px] md:text-xs font-semibold uppercase tracking-wider transition-all duration-300 z-10 flex items-center gap-1.5 group select-none ${
                  activeTab === item.id 
                    ? 'text-indigo-400 font-bold' 
                    : 'text-[#E2E8F0]/50 hover:text-[#E2E8F0]'
                }`}
              >
                {/* Sliding glass capsule hover background */}
                {hoveredTab === item.id && (
                  <motion.div
                    layoutId="navHoverCapsule"
                    className="absolute inset-0 bg-white/[0.04] border border-white/5 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
                
                {/* Sliding active underline indicator */}
                {activeTab === item.id && (
                  <motion.div
                    layoutId="navActiveLine"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-indigo-400 to-indigo-600 -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}

                <Icon size={12} className="shrink-0 text-indigo-400/70 group-hover:text-indigo-400 transition-colors duration-300" />
                <span className="hidden sm:inline">{item.label}</span>
              </a>
            );
          })}
        </div>
      </header>

      {/* 1. Hero Section (Antigravity Research Lab) */}
      <div id="home">
        <HeroSection 
          onResumeClick={handleResumePreview}
        />
      </div>

      {/* 2. About Section (Overview & split globe) */}
      <AboutSection />

      {/* 2.5 Technical Capabilities Section (The Tech Matrix) */}
      <div id="architecture">
        <TechMatrixSection />
      </div>

      {/* 3. Projects Section (Research Paper Slide deck stacking) */}
      <div id="projects" ref={projectsRef}>
        <ProjectsSection />
      </div>

      {/* 4. Footer Section (Socials & Resume download) */}
      <div ref={contactRef}>
        <FooterSection onResumeClick={handleResumePreview} />
      {/* Hidden Admin Access */}
      <div className="fixed bottom-3 left-3 z-30 opacity-20 hover:opacity-100 transition-opacity">
        <a 
          href="/admin" 
          className="p-1.5 rounded-full bg-black/60 border border-white/10 text-slate-400 hover:text-indigo-400 flex items-center justify-center text-[10px]"
          title="Admin Portal"
        >
          <Lock size={12} />
        </a>
      </div>
      </div>

      {/* Resume Preview Modal */}
      <AnimatePresence>
        {(isResumeOpen || (resumeRouteState.isActive && resumeRouteState.found && !!resumeRouteState.resume)) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div
              onClick={() => {
                setIsResumeOpen(false);
                if (resumeRouteState.isActive) {
                  window.history.pushState({}, '', '/');
                  setResumeRouteState((prev) => ({ ...prev, isActive: false }));
                }
              }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 w-full max-w-6xl rounded-3xl border border-white/10 bg-[#030305]/95 p-3 md:p-4 shadow-[0_30px_80px_rgba(0,0,0,0.9)]"
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-indigo-400">Resume Preview</p>
                  <h3 className="text-sm md:text-base font-semibold text-[#E2E8F0]">
                    {resumeRouteState.resume ? `Shreya Roy — ${resumeRouteState.resume.title}` : 'Shreya Roy — CV'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={resumeRouteState.resume?.pdf_url || '/api/resumes/published-pdf'}
                    download={resumeRouteState.resume ? `${resumeRouteState.resume.safe_title}.pdf` : 'Shreya_Roy_Resume.pdf'}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-widest text-[#E2E8F0] hover:bg-white/10 hover:text-indigo-400 transition-colors"
                  >
                    <Download size={14} />
                    Download
                  </a>
                  <button
                    onClick={() => {
                      setIsResumeOpen(false);
                      if (resumeRouteState.isActive) {
                        window.history.pushState({}, '', '/');
                        setResumeRouteState((prev) => ({ ...prev, isActive: false }));
                      }
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#E2E8F0] hover:bg-white/10 hover:text-indigo-400 transition-colors"
                    aria-label="Close resume preview"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-3 overflow-hidden rounded-2xl h-[70vh] min-h-[420px]">
                <PdfViewer
                  url={resumeRouteState.resume?.pdf_url || '/api/resumes/published-pdf'}
                  title={resumeRouteState.resume ? resumeRouteState.resume.safe_title : 'Shreya_Roy_Resume'}
                  className="h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Resume Loading Overlay */}
      <AnimatePresence>
        {resumeRouteState.isActive && resumeRouteState.loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
            <div className="relative z-10 flex flex-col items-center gap-3 p-8 rounded-3xl bg-[#030305]/95 border border-white/10 shadow-2xl">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <p className="text-xs font-mono uppercase tracking-widest text-indigo-400">Loading Resume...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Resume 404 Modal */}
      <AnimatePresence>
        {resumeRouteState.isActive && !resumeRouteState.found && !resumeRouteState.loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div
              onClick={() => {
                window.history.pushState({}, '', '/');
                setResumeRouteState((prev) => ({ ...prev, isActive: false }));
              }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-[#0a0a0f]/95 p-6 md:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.9)] backdrop-blur-xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400">
                    404 // RESUME NOT FOUND
                  </span>
                </div>
                <button
                  onClick={() => {
                    window.history.pushState({}, '', '/');
                    setResumeRouteState((prev) => ({ ...prev, isActive: false }));
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Resume Document Not Found</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The requested resume <code className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-rose-300 font-mono text-[11px]">{resumeRouteState.requestedName}</code> could not be located in our database.
                </p>
              </div>

              {resumeRouteState.availableResumes.length > 0 && (
                <div className="space-y-3 pt-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                    Available Resumes:
                  </p>
                  <div className="flex flex-col gap-2">
                    {resumeRouteState.availableResumes.map((item) => (
                      <a
                        key={item.url}
                        href={item.url}
                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-indigo-500/50 text-white text-xs transition-all group"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText size={14} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                          <span className="font-medium group-hover:text-indigo-300 transition-colors">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono group-hover:text-indigo-400 transition-colors">
                          Open PDF →
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <button
                  onClick={() => {
                    window.history.pushState({}, '', '/');
                    setResumeRouteState((prev) => ({ ...prev, isActive: false }));
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-colors"
                >
                  Explore Full Portfolio
                </button>
                <span className="text-[11px] text-slate-500 font-mono">Shreya Roy</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glassmorphic Contact Dialog / Modal */}
      <AnimatePresence>
        {isContactOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 25 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#030305]/95 p-6 md:p-10 text-[#E2E8F0] shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-10 overflow-hidden font-mono"
            >
              {/* Corner decorative light cyan blur */}
              <div 
                className="absolute top-0 right-0 w-[140px] h-[140px] rounded-full blur-[70px] opacity-15 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, #6366f1 0%, transparent 100%)',
                }}
              />

              {/* Close Button */}
              <button
                onClick={() => setIsContactOpen(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>

              {/* Title prompt */}
              <div className="flex items-center gap-2.5 mb-5 select-none">
                <MessageSquare className="text-indigo-400 shrink-0" size={24} />
                <h3 className="text-lg md:text-xl font-bold tracking-wide text-white">
                  Get in Touch
                </h3>
              </div>

              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Have a question or want to work together? Send me a message below.
              </p>

              {/* Message Compiler Form */}
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-4.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 select-none">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-indigo-500/80 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 select-none">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-indigo-500/80 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 select-none">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-indigo-500/80 transition-all resize-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-bold uppercase tracking-wider text-white text-sm transition-all duration-300 active:scale-95 disabled:opacity-50 select-none shadow-[inset_0_2px_8px_rgba(255,255,255,0.15)] bg-gradient-to-r from-indigo-500 to-indigo-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send size={16} />
                </button>
              </form>

              {/* Direct Mail Info */}
              <div className="mt-5 pt-5 border-t border-white/5 flex items-center gap-2 text-[10px] font-bold tracking-wider text-[#E2E8F0]/40 uppercase justify-center select-none">
                <Mail size={12} />
                <span>Or dial directly:</span>
                <a href="mailto:shreya.roy1818@gmail.com" className="text-[#E2E8F0] hover:underline font-mono">
                  shreya.roy1818@gmail.com
                </a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cybernetic Micro-Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border border-indigo-500/30 bg-[#030305]/95 text-white shadow-[0_15px_40px_rgba(0,0,0,0.85)] backdrop-blur-md text-sm font-semibold tracking-wide select-none border-l-4 border-l-indigo-500"
          >
            <CheckCircle2 className="text-indigo-400 shrink-0" size={18} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
};

export default App;
