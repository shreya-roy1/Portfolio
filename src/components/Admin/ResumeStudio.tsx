import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Sparkles, 
  Play, 
  Save, 
  RefreshCw, 
  FileText, 
  Check, 
  AlertCircle,
  FileCode,
  BookOpen
} from 'lucide-react';
import axios from 'axios';
import { TEMPLATES, JAKE_RESUME_TEMPLATE } from './templates';
import { AiStudioModal } from './AiStudioModal';

interface ResumeStudioProps {
  initialResumeId?: string | null;
}

export const ResumeStudio: React.FC<ResumeStudioProps> = ({ initialResumeId }) => {
  // Active document
  const [activeFileKey, setActiveFileKey] = useState<string>('template:jake-resume');
  const [currentCode, setCurrentCode] = useState<string>(JAKE_RESUME_TEMPLATE);
  const [documentTitle, setDocumentTitle] = useState<string>('Shreya_Roy_Resume.tex');
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);

  // Saved resumes and master context
  const [savedResumes, setSavedResumes] = useState<Array<{ id: string; title: string }>>([]);
  const [masterContext, setMasterContext] = useState<string>('');

  // Compiler state
  const [isCompiling, setIsCompiling] = useState(false);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [compilationDuration, setCompilationDuration] = useState<string | null>(null);
  const [compilerError, setCompilerError] = useState<string | null>(null);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  const [saveAsName, setSaveAsName] = useState('');

  // AI Modal
  const [showAiModal, setShowAiModal] = useState(false);

  useEffect(() => {
    loadSavedResumes();
    loadMasterContext();
    if (initialResumeId) {
      loadResumeById(initialResumeId);
    } else {
      // Compile starter template on first mount
      handleCompile(JAKE_RESUME_TEMPLATE);
    }
  }, [initialResumeId]);

  const loadSavedResumes = async () => {
    try {
      const res = await axios.get('/api/resumes');
      if (Array.isArray(res.data?.resumes)) {
        setSavedResumes(res.data.resumes.map((r: any) => ({ id: r.id, title: r.title })));
      }
    } catch (e) {}
  };

  const loadMasterContext = async () => {
    try {
      const res = await axios.get('/api/storage/master-context');
      if (res.data?.content) {
        setMasterContext(res.data.content);
      }
    } catch (e) {}
  };

  const loadResumeById = async (id: string) => {
    try {
      const res = await axios.get('/api/resumes');
      const resumes = res.data?.resumes || [];
      const match = resumes.find((r: any) => r.id === id);
      if (match) {
        // Fetch raw tex code
        // fetch resume metadata
await axios.get(`/api/resumes/preview-pdf?id=${id}`, { responseType: 'blob' });
        setActiveFileKey(`resume:${id}`);
        setDocumentTitle(match.title);
        setCurrentResumeId(match.id);
        // Note: For preview, we compile or fetch
      }
    } catch (e) {}
  };

  const handleSelectTemplate = (template: { key: string; name: string; template: string }) => {
    setActiveFileKey(`template:${template.key}`);
    setDocumentTitle(`${template.name.replace(/[^a-zA-Z0-9]/g, '_')}.tex`);
    setCurrentResumeId(null);
    setCurrentCode(template.template);
    handleCompile(template.template);
  };

  const handleSelectMasterContext = () => {
    setActiveFileKey('master-context');
    setDocumentTitle('shreya_master_context.md');
    setCurrentResumeId(null);
    setCurrentCode(masterContext);
  };

  const handleCompile = async (codeToCompile?: string) => {
    const code = codeToCompile || currentCode;
    if (!code) return;

    setIsCompiling(true);
    setCompilerError(null);
    try {
      const res = await axios.post('/api/compile', { code });
      if (res.data?.pdfBase64) {
        setPdfBase64(res.data.pdfBase64);
        setCompilationDuration(res.data.duration);
      } else {
        setCompilerError('Compilation succeeded but no PDF returned.');
      }
    } catch (err: any) {
      setCompilerError(err.response?.data?.error || err.message || 'LaTeX compilation failed.');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleSave = async () => {
    if (activeFileKey === 'master-context') {
      // Save Master Context
      setIsSaving(true);
      try {
        await axios.post('/api/storage/master-context', { content: currentCode });
        setMasterContext(currentCode);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      } catch (err: any) {
        alert('Failed to save master context: ' + err.message);
      } finally {
        setIsSaving(false);
      }
      return;
    }

    if (!currentResumeId) {
      // Not yet saved in DB -> open Save As
      setSaveAsName(documentTitle.replace(/\.tex$/i, ''));
      setShowSaveAsModal(true);
      return;
    }

    // Overwrite existing resume
    setIsSaving(true);
    try {
      await axios.put('/api/resumes', {
        id: currentResumeId,
        title: documentTitle,
        latex: currentCode,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: any) {
      alert('Failed to update resume: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveAsName.trim()) return;

    setIsSaving(true);
    try {
      const res = await axios.post('/api/resumes', {
        title: saveAsName.trim(),
        latex: currentCode,
      });

      if (res.data?.resume) {
        setCurrentResumeId(res.data.resume.id);
        setActiveFileKey(`resume:${res.data.resume.id}`);
        setDocumentTitle(res.data.resume.title);
        setShowSaveAsModal(false);
        loadSavedResumes();
      }
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[82vh] rounded-2xl bg-[#0a0a0f] border border-white/10 overflow-hidden shadow-2xl">
      
      {/* Studio Header Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#030305] text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono">
            <FileCode size={14} className="text-indigo-400" />
            <span>{documentTitle}</span>
          </div>

          <button
            onClick={() => setShowAiModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all"
          >
            <Sparkles size={14} />
            AI Resume Tailor & Chat
          </button>
        </div>

        <div className="flex items-center gap-2">
          {compilationDuration && (
            <span className="text-[11px] text-slate-500 font-mono">
              Compiled in {compilationDuration}
            </span>
          )}

          {/* Recompile Button */}
          <button
            onClick={() => handleCompile()}
            disabled={isCompiling}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {isCompiling ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} />}
            Recompile
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {saveSuccess ? <Check size={13} /> : <Save size={13} />}
            {saveSuccess ? 'Saved' : 'Save'}
          </button>

          {/* Save As Button */}
          <button
            onClick={() => {
              setSaveAsName(documentTitle.replace(/\.tex$/i, '') + ' (Copy)');
              setShowSaveAsModal(true);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-medium"
          >
            Save As...
          </button>
        </div>
      </div>

      {/* 3-Panel Main Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Panel 1: File Explorer */}
        <div className="w-60 border-r border-white/10 bg-[#06060a] p-4 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            
            {/* Templates */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Starter Templates
              </span>
              <div className="space-y-1">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.key}
                    onClick={() => handleSelectTemplate(tmpl)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                      activeFileKey === `template:${tmpl.key}`
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <FileText size={13} />
                    <span className="truncate">{tmpl.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Resumes */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Saved Resumes ({savedResumes.length})
              </span>
              <div className="space-y-1">
                {savedResumes.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => loadResumeById(r.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                      activeFileKey === `resume:${r.id}`
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <FileCode size={13} />
                    <span className="truncate">{r.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Master Career Context */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Knowledge Base
              </span>
              <button
                onClick={handleSelectMasterContext}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                  activeFileKey === 'master-context'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <BookOpen size={13} />
                <span className="truncate">Career Context (.md)</span>
              </button>
            </div>

          </div>

          <div className="pt-3 border-t border-white/5">
            <span className="text-[10px] text-slate-600 font-mono block">
              Overleaf-style TeX IDE
            </span>
          </div>
        </div>

        {/* Panel 2: Monaco Editor */}
        <div className="flex-1 flex flex-col border-r border-white/10 bg-[#1e1e1e]">
          <Editor
            height="100%"
            language={activeFileKey === 'master-context' ? 'markdown' : 'latex'}
            value={currentCode}
            onChange={(val) => setCurrentCode(val || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              wordWrap: 'on',
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Panel 3: Live PDF Preview */}
        <div className="flex-1 flex flex-col bg-neutral-900">
          {compilerError ? (
            <div className="p-6 bg-red-500/10 border-b border-red-500/20 text-red-400 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-xs">
                <AlertCircle size={16} />
                <span>Compilation Error</span>
              </div>
              <pre className="text-xs font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                {compilerError}
              </pre>
            </div>
          ) : null}

          <div className="flex-1 relative">
            {pdfBase64 ? (
              <iframe
                src={`data:application/pdf;base64,${pdfBase64}`}
                title="Resume Preview"
                className="w-full h-full border-0"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                <RefreshCw size={24} className="animate-spin text-indigo-400" />
                <span className="text-xs">Rendering live PDF preview...</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Save As Modal */}
      {showSaveAsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form
            onSubmit={handleSaveAsSubmit}
            className="w-full max-w-md p-6 rounded-2xl bg-[#0a0a0f] border border-white/10 text-[#E2E8F0] shadow-2xl space-y-4"
          >
            <h3 className="font-bold text-base text-white">Save Resume As</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Resume Title
              </label>
              <input
                type="text"
                required
                value={saveAsName}
                onChange={(e) => setSaveAsName(e.target.value)}
                placeholder="e.g. Shreya_Roy_Cybersecurity_2026"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSaveAsModal(false)}
                className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                {isSaving ? 'Saving...' : 'Save Document'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AI Tailoring Modal */}
      <AiStudioModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onApplyLatex={(newLatex) => {
          setCurrentCode(newLatex);
          handleCompile(newLatex);
        }}
        currentLatex={currentCode}
        masterContext={masterContext}
      />

    </div>
  );
};
