import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Eye, 
  Trash2, 
  Download, 
  RefreshCw, 
  X,
  ExternalLink,
  Plus
} from 'lucide-react';
import axios from 'axios';

interface ResumeRecord {
  id: string;
  title: string;
  s3_key: string;
  template_name?: string;
  target_role?: string;
  target_company?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface ResumeDisplayProps {
  onOpenStudioWithResume: (resumeId: string) => void;
  onSwitchToStudio: () => void;
}

export const ResumeDisplay: React.FC<ResumeDisplayProps> = ({
  onOpenStudioWithResume,
  onSwitchToStudio,
}) => {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/resumes');
      if (Array.isArray(res.data?.resumes)) {
        setResumes(res.data.resumes);
      }
    } catch (err: any) {
      console.error('Failed to fetch resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPublished = async (resumeId: string) => {
    setPublishingId(resumeId);
    try {
      await axios.put('/api/resumes', { id: resumeId, is_published: true });
      setResumes((prev) =>
        prev.map((r) => ({
          ...r,
          is_published: r.id === resumeId,
        }))
      );
    } catch (err: any) {
      alert('Failed to publish resume: ' + (err.response?.data?.error || err.message));
    } finally {
      setPublishingId(null);
    }
  };

  const handleDelete = async (resumeId: string) => {
    if (!window.confirm('Delete this resume document?')) return;
    try {
      await axios.delete(`/api/resumes?id=${resumeId}`);
      setResumes((prev) => prev.filter((r) => r.id !== resumeId));
    } catch (err: any) {
      alert('Failed to delete resume: ' + (err.response?.data?.error || err.message));
    }
  };

  const publishedResume = resumes.find((r) => r.is_published);

  return (
    <div className="space-y-6">
      {/* Banner / Public Status Card */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-[#0e0e1a] to-purple-900/30 border border-indigo-500/30 shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Active Public Resume
              </span>
            </div>
            <h2 className="font-bold text-xl text-white">
              {publishedResume ? publishedResume.title : 'No resume published yet'}
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              This is the live compiled PDF served to portfolio visitors when clicking "Resume" or downloading from the modal.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/api/resumes/published-pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <ExternalLink size={14} />
              Open Live PDF
            </a>
            <button
              onClick={onSwitchToStudio}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
            >
              <Plus size={14} />
              Create in Studio
            </button>
          </div>
        </div>
      </div>

      {/* Resumes Grid */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-300 uppercase tracking-wider">
          Saved Resumes ({resumes.length})
        </h3>
        <button
          onClick={fetchResumes}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-16 text-slate-400">
          <RefreshCw size={20} className="animate-spin text-indigo-400 mr-2" />
          <span>Loading saved resumes...</span>
        </div>
      ) : resumes.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0a0a0f] border border-white/10 space-y-3">
          <p className="text-sm text-slate-400">No resumes saved in database yet.</p>
          <button
            onClick={onSwitchToStudio}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Open AI Resume Studio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resumes.map((resume) => {
            const isPub = resume.is_published;
            return (
              <div
                key={resume.id}
                className={`flex flex-col justify-between p-5 rounded-2xl bg-[#0a0a0f] border transition-all duration-300 ${
                  isPub
                    ? 'border-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.15)] bg-gradient-to-b from-[#0f0f1c] to-[#0a0a0f]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-white line-clamp-1">{resume.title}</h4>
                    {isPub && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold tracking-wide shrink-0">
                        LIVE
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs text-slate-400">
                    {resume.target_role && (
                      <p className="line-clamp-1">
                        <strong className="text-slate-300">Role:</strong> {resume.target_role}
                      </p>
                    )}
                    {resume.target_company && (
                      <p className="line-clamp-1">
                        <strong className="text-slate-300">Company:</strong> {resume.target_company}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500">
                      Updated {new Date(resume.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setPreviewId(resume.id);
                        setPreviewTitle(resume.title);
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Preview PDF"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => onOpenStudioWithResume(resume.id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-indigo-400 hover:text-indigo-300 transition-colors"
                      title="Edit in Studio"
                    >
                      <Sparkles size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleSetPublished(resume.id)}
                    disabled={isPub || publishingId === resume.id}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isPub
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {publishingId === resume.id ? (
                      <RefreshCw size={12} className="animate-spin" />
                    ) : isPub ? (
                      'Published'
                    ) : (
                      'Make Public'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PDF Preview Modal */}
      {previewId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl h-[85vh] rounded-2xl border border-white/10 bg-[#0a0a0f] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#030305]">
              <h3 className="font-bold text-sm text-white">{previewTitle}</h3>
              <div className="flex items-center gap-2">
                <a
                  href={`/api/resumes/preview-pdf?id=${previewId}`}
                  download={`${previewTitle}.pdf`}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium flex items-center gap-1.5"
                >
                  <Download size={14} />
                  Download
                </a>
                <button
                  onClick={() => setPreviewId(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-neutral-900">
              <iframe
                src={`/api/resumes/preview-pdf?id=${previewId}`}
                title={previewTitle}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
