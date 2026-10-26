import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown, 
  Save, 
  ExternalLink, 
  RefreshCw, 
  
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import axios from 'axios';
import { formatImageUrl } from '../../utils/imageUrl';

interface Project {
  repo_name: string;
  display_title: string | null;
  custom_description: string | null;
  custom_image_url: string | null;
  demo_url: string | null;
  is_visible: boolean;
  priority: number;
  stars_count?: number;
  forks_count?: number;
  language?: string;
  topics?: string[];
  html_url?: string;
}

export const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRepo, setExpandedRepo] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ [key: string]: 'idle' | 'saving' | 'saved' }>({});
  const [orderSaving, setOrderSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/projects');
      if (Array.isArray(res.data)) {
        // Sort by priority ascending
        const sorted = res.data.sort((a: Project, b: Project) => (a.priority ?? 0) - (b.priority ?? 0));
        setProjects(sorted);
      }
    } catch (err: any) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (repo_name: string, field: keyof Project, value: any) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.repo_name === repo_name) {
          return { ...p, [field]: value };
        }
        return p;
      })
    );
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newProjects = [...projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    // Recalculate priority based on list index
    const reindexed = newProjects.map((p, idx) => ({ ...p, priority: idx }));
    setProjects(reindexed);
  };

  const handleSaveSingle = async (project: Project) => {
    setSaveStatus((prev) => ({ ...prev, [project.repo_name]: 'saving' }));
    try {
      // Auto sanitize image URL before save
      const sanitizedImage = formatImageUrl(project.custom_image_url || '');
      await axios.post('/api/projects', {
        ...project,
        custom_image_url: sanitizedImage || null,
      });

      setSaveStatus((prev) => ({ ...prev, [project.repo_name]: 'saved' }));
      setTimeout(() => {
        setSaveStatus((prev) => ({ ...prev, [project.repo_name]: 'idle' }));
      }, 2500);
    } catch (err: any) {
      alert('Failed to save project: ' + (err.response?.data?.error || err.message));
      setSaveStatus((prev) => ({ ...prev, [project.repo_name]: 'idle' }));
    }
  };

  const handleSaveAllPriorities = async () => {
    setOrderSaving(true);
    try {
      const batchPayload = projects.map((p, idx) => ({
        repo_name: p.repo_name,
        display_title: p.display_title || p.repo_name,
        priority: idx,
      }));

      await axios.post('/api/projects', batchPayload);
      setMessage('Project order successfully saved to database!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert('Failed to save order: ' + (err.response?.data?.error || err.message));
    } finally {
      setOrderSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-slate-400">
        <RefreshCw size={24} className="animate-spin text-indigo-400 mr-3" />
        <span>Loading projects from database...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0a0a0f] border border-white/10 shadow-lg">
        <div>
          <h2 className="font-bold text-xl text-white flex items-center gap-2">
            <FolderGit2 className="text-indigo-400" size={22} />
            Project Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Reorder priority, customize titles, add screenshots, and toggle portfolio visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProjects}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <button
            onClick={handleSaveAllPriorities}
            disabled={orderSaving}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.25)] disabled:opacity-50"
          >
            {orderSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            Save Order ({projects.length})
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-3">
        {projects.map((project, index) => {
          const isExpanded = expandedRepo === project.repo_name;
          const status = saveStatus[project.repo_name] || 'idle';
          const sanitizedImg = formatImageUrl(project.custom_image_url || '');

          return (
            <div
              key={project.repo_name}
              className="rounded-2xl bg-[#0a0a0f] border border-white/10 overflow-hidden transition-all duration-200 hover:border-white/20"
            >
              {/* Card Header Row */}
              <div className="flex items-center justify-between p-4 gap-3 bg-[#0c0c14]">
                <div className="flex items-center gap-3">
                  {/* Order Controls */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 hover:bg-white/5"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === projects.length - 1}
                      className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 hover:bg-white/5"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  {/* Priority Badge */}
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
                    #{index + 1}
                  </span>

                  {/* Visibility Quick Toggle */}
                  <button
                    onClick={() => {
                      const updated = !project.is_visible;
                      handleFieldChange(project.repo_name, 'is_visible', updated);
                      handleSaveSingle({ ...project, is_visible: updated });
                    }}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      project.is_visible
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'
                    }`}
                    title={project.is_visible ? 'Visible on portfolio' : 'Hidden from portfolio'}
                  >
                    {project.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>

                  {/* Title & Repo */}
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      {project.display_title || project.repo_name}
                      {project.repo_name !== project.display_title && (
                        <span className="text-[10px] font-mono text-slate-500">
                          ({project.repo_name})
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 max-w-lg">
                      {project.custom_description || 'No description configured.'}
                    </p>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedRepo(isExpanded ? null : project.repo_name)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-medium transition-colors"
                  >
                    {isExpanded ? 'Collapse' : 'Configure'}
                  </button>
                </div>
              </div>

              {/* Accordion Edit Panel */}
              {isExpanded && (
                <div className="p-5 border-t border-white/10 bg-[#08080d] space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Display Title
                      </label>
                      <input
                        type="text"
                        value={project.display_title || ''}
                        onChange={(e) => handleFieldChange(project.repo_name, 'display_title', e.target.value)}
                        placeholder={project.repo_name}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Live Demo URL (Overrides GitHub Homepage)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={project.demo_url || ''}
                          onChange={(e) => handleFieldChange(project.repo_name, 'demo_url', e.target.value)}
                          placeholder="https://..."
                          className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                        />
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center justify-center"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Custom Description
                    </label>
                    <textarea
                      rows={2}
                      value={project.custom_description || ''}
                      onChange={(e) => handleFieldChange(project.repo_name, 'custom_description', e.target.value)}
                      placeholder="Highlights, achievements, tech stack..."
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  {/* Screenshot Image URL with Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Custom Screenshot / Cover Image URL (GitHub blob or direct image)
                      </label>
                      <input
                        type="url"
                        value={project.custom_image_url || ''}
                        onChange={(e) => handleFieldChange(project.repo_name, 'custom_image_url', e.target.value)}
                        placeholder="https://github.com/.../blob/main/public/preview.png"
                        className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        GitHub blob URLs are automatically rewritten to raw format.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Live Thumbnail Preview
                      </label>
                      <div className="h-20 w-full rounded-xl border border-white/10 bg-black/40 overflow-hidden flex items-center justify-center">
                        {sanitizedImg ? (
                          <img
                            src={sanitizedImg}
                            alt="Preview"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center text-slate-600 text-[10px]">
                            <ImageIcon size={18} className="mb-0.5" />
                            <span>No cover image</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Save row */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={project.is_visible}
                          onChange={(e) => handleFieldChange(project.repo_name, 'is_visible', e.target.checked)}
                          className="rounded border-white/20 bg-white/5 text-indigo-600 focus:ring-0"
                        />
                        <span>Visible on Public Portfolio</span>
                      </label>
                    </div>

                    <button
                      onClick={() => handleSaveSingle(project)}
                      disabled={status === 'saving'}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                        status === 'saved'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {status === 'saving' && <RefreshCw size={14} className="animate-spin" />}
                      {status === 'saved' && <CheckCircle2 size={14} />}
                      {status === 'idle' && <Save size={14} />}
                      {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved!' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
