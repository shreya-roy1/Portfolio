import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Send, 
  Check, 
  X, 
  RefreshCw, 
  Briefcase, 
  Building2, 
  FileText,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

interface AiStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyLatex: (latex: string) => void;
  currentLatex: string;
  masterContext: string;
}

export const AiStudioModal: React.FC<AiStudioModalProps> = ({
  isOpen,
  onClose,
  onApplyLatex,
  currentLatex,
  masterContext,
}) => {
  const [activeTab, setActiveTab] = useState<'tailor' | 'chat'>('tailor');
  
  // Tailor Tab State
  const [targetRole, setTargetRole] = useState('Full-Stack Software Engineer');
  const [targetCompany, setTargetCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  
  // Chat Refine Tab State
  const [refinePrompt, setRefinePrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);

  // Common State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLatex, setGeneratedLatex] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await axios.post('/api/ai/generate', {
        masterContext,
        targetRole,
        targetCompany,
        jobDescription,
        templateLatex: currentLatex,
      });

      if (res.data?.latex) {
        setGeneratedLatex(res.data.latex);
        setChatHistory((prev) => [
          ...prev,
          { role: 'user', text: `Tailor for ${targetRole} at ${targetCompany || 'Target Company'}` },
          { role: 'assistant', text: 'Resume successfully tailored for ATS optimization.' },
        ]);
      } else {
        setError('No LaTeX code returned by Gemini AI.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinePrompt.trim()) return;

    const promptText = refinePrompt.trim();
    setRefinePrompt('');
    setIsGenerating(true);
    setError(null);

    setChatHistory((prev) => [...prev, { role: 'user', text: promptText }]);

    try {
      const res = await axios.post('/api/ai/refine', {
        currentLatex: generatedLatex || currentLatex,
        prompt: promptText,
      });

      if (res.data?.latex) {
        setGeneratedLatex(res.data.latex);
        setChatHistory((prev) => [
          ...prev,
          { role: 'assistant', text: 'Changes applied to resume code.' },
        ]);
      } else {
        setError('No updated LaTeX returned.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Refinement failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedLatex) {
      onApplyLatex(generatedLatex);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-white/10 bg-[#0a0a0f] text-[#E2E8F0] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#030305]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">AI Resume Studio</h3>
              <p className="text-xs text-slate-400">ATS Tailoring & Conversational Refinement via Gemini 2.5</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('tailor')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'tailor' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase size={14} />
                Tailor to JD
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'chat' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare size={14} />
                Chat Refine
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="px-6 py-2.5 bg-red-500/10 border-b border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'tailor' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Role
                  </label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Cybersecurity Specialist, Full-Stack Engineer"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Company (Optional)
                  </label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                      placeholder="e.g. Google, CrowdStrike, Palo Alto Networks"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Job Description (Paste requirements, responsibilities, keywords)
                </label>
                <textarea
                  rows={6}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job listing or required qualifications here..."
                  className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none font-mono"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-indigo-400" />
                  <span>Master Career Context: <strong className="text-white">{masterContext?.length || 0}</strong> chars loaded</span>
                </div>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating || !jobDescription.trim()}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Optimizing ATS...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Generate Tailored Resume
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-64 overflow-y-auto space-y-3 p-4 rounded-xl bg-black/40 border border-white/10">
                {chatHistory.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-10">
                    No refinement instructions yet. Ask Gemini to rephrase bullet points, highlight specific skills, or trim spacing.
                  </p>
                ) : (
                  chatHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        item.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] px-3.5 py-2 rounded-xl text-xs ${
                          item.role === 'user'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        {item.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleRefine} className="flex gap-2">
                <input
                  type="text"
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  placeholder="e.g. Make Phishing-Sentinel bullets focus on latency & accuracy..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={isGenerating || !refinePrompt.trim()}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </form>
            </div>
          )}

          {/* Code Preview if generated */}
          {generatedLatex && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-400">Generated Code Preview</span>
                <span className="text-slate-500 font-mono">{generatedLatex.length} characters</span>
              </div>
              <pre className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-emerald-400 font-mono text-xs max-h-48 overflow-y-auto whitespace-pre-wrap">
                {generatedLatex.slice(0, 800)}...
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#030305]">
          <span className="text-xs text-slate-500">
            {generatedLatex ? 'Resume ready to apply into editor.' : 'Enter details above to tailor resume.'}
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!generatedLatex}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Check size={14} />
              Apply to Editor
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
