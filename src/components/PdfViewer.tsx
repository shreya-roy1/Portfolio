import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ZoomIn, ZoomOut, RotateCcw, Download, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

// Configure Mozilla PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

interface PdfViewerProps {
  url: string;
  title?: string;
  className?: string;
  showDownload?: boolean;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  url,
  title = 'Resume',
  className = '',
  showDownload = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        const ua = navigator.userAgent || '';
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        setIsMobile(mobileRegex.test(ua) || window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Fetch & load the PDF document
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setPdfDoc(null);

    async function fetchDoc() {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url,
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (!active) return;

        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setLoading(false);
      } catch (err: any) {
        if (!active) return;
        console.error('PDF.js document load error:', err);
        setError(err.message || 'Unable to render PDF preview.');
        setLoading(false);
      }
    }

    fetchDoc();

    return () => {
      active = false;
    };
  }, [url]);

  // Render all pages to high-DPI canvas whenever pdfDoc or zoom changes
  const renderPages = useCallback(async () => {
    if (!pdfDoc || !canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    container.innerHTML = '';

    const containerWidth = container.clientWidth || (window.innerWidth > 640 ? 600 : window.innerWidth - 48);

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      try {
        const page = await pdfDoc.getPage(pageNum);
        const unscaledViewport = page.getViewport({ scale: 1 });

        // Calculate scale to fit container width, multiplied by user zoom level
        const baseScale = (containerWidth / unscaledViewport.width) * 0.98;
        const finalScale = Math.max(baseScale * zoom, 0.4);

        // High-DPI device pixel ratio (sharp on Retina & OLED screens)
        const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2.5) : 1;

        const viewport = page.getViewport({ scale: finalScale * dpr });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        // CSS display size (unscaled by DPR)
        const displayWidth = Math.floor(viewport.width / dpr);
        const displayHeight = Math.floor(viewport.height / dpr);
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;
        canvas.style.maxWidth = '100%';
        canvas.style.margin = '0 auto 20px auto';
        canvas.style.display = 'block';
        canvas.style.borderRadius = '12px';
        canvas.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.65)';
        canvas.style.border = '1px solid rgba(255, 255, 255, 0.12)';
        canvas.style.backgroundColor = '#ffffff';

        container.appendChild(canvas);

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (renderErr) {
        console.warn(`Error rendering page ${pageNum}:`, renderErr);
      }
    }
  }, [pdfDoc, zoom]);

  useEffect(() => {
    if (pdfDoc) {
      renderPages();
    }
  }, [pdfDoc, zoom, renderPages]);

  // Handle resize re-render
  useEffect(() => {
    if (!pdfDoc) return;
    const handleResize = () => {
      renderPages();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pdfDoc, renderPages]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  // Compute absolute URL for download and external viewing
  const absoluteUrl = typeof window !== 'undefined' ? new URL(url, window.location.origin).href : url;

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col w-full h-full bg-[#030305]/90 rounded-2xl overflow-hidden border border-white/10 ${className}`}
    >
      {/* Mobile-Friendly Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 bg-[#0a0a0f] border-b border-white/10 z-10 select-none">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {totalPages > 0 && (
            <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              {totalPages} {totalPages === 1 ? 'Page' : 'Pages'}
            </span>
          )}

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/5">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <span className="text-[10px] font-mono text-slate-300 px-1 min-w-[36px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 2.5}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            {zoom !== 1 && (
              <button
                onClick={handleResetZoom}
                className="p-1 rounded text-indigo-400 hover:text-indigo-300 transition-colors ml-0.5"
                title="Reset Zoom"
                aria-label="Reset Zoom"
              >
                <RotateCcw size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <a
            href={absoluteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] font-medium transition-colors"
            title="Open in new window"
          >
            <ExternalLink size={12} />
            <span className="hidden sm:inline">New Tab</span>
          </a>

          {showDownload && (
            <a
              href={absoluteUrl}
              download={`${title.replace(/\.pdf$/i, '')}.pdf`}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold shadow-[0_0_12px_rgba(99,102,241,0.3)] transition-colors"
            >
              <Download size={12} />
              <span>Download</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="relative flex-1 w-full overflow-y-auto overflow-x-auto p-3 sm:p-5 flex justify-center bg-[#07070b]">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <RefreshCw size={26} className="animate-spin text-indigo-400" />
            <p className="text-xs font-mono uppercase tracking-widest text-slate-300">
              {isMobile ? 'Rendering Mobile Preview...' : 'Loading Resume PDF...'}
            </p>
            <span className="text-[11px] text-slate-500">Vectorizing layout & typography</span>
          </div>
        )}

        {/* Error / Fallback State */}
        {error && (
          <div className="flex flex-col items-center justify-center p-6 sm:p-8 max-w-md my-auto text-center rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
            <div className="p-3 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertCircle size={28} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Mobile PDF Renderer Notice</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct in-app rendering couldn't initialize on this browser engine. You can still view or download the crisp PDF directly.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full pt-2">
              <a
                href={absoluteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink size={14} />
                Open Fullscreen
              </a>
              <a
                href={absoluteUrl}
                download={`${title.replace(/\.pdf$/i, '')}.pdf`}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <Download size={14} />
                Save PDF
              </a>
            </div>
          </div>
        )}

        {/* Canvas Render Output Container */}
        <div
          ref={canvasContainerRef}
          className={`w-full max-w-3xl flex flex-col items-center transition-opacity duration-300 ${
            loading || error ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
          }`}
        />
      </div>

      {/* Mobile Footer helper prompt */}
      {isMobile && !loading && !error && (
        <div className="py-1.5 px-3 bg-[#0a0a0f] border-t border-white/5 text-center text-[10px] text-slate-500 font-mono">
          Tip: Tap + / - above to zoom, or tap Download for print-ready copy
        </div>
      )}
    </div>
  );
};
