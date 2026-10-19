import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  Download,
  Maximize2,
  Copy,
  Check,
  Film,
  Volume2,
  VolumeX,
  Code,
  RefreshCw
} from 'lucide-react';

export function VideoPlayer({ item, onRemix }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPayload, setShowPayload] = useState(false);

  if (!item) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) { videoRef.current.pause(); setIsPlaying(false); }
    else { videoRef.current.play(); setIsPlaying(true); }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleCopyPrompt = () => {
    if (!item.prompt) return;
    navigator.clipboard.writeText(item.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!item.url) return;
    const a = document.createElement('a');
    a.href = item.url;
    a.download = `puhhfield-wan21-${item.id || 'video'}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) videoRef.current.requestFullscreen();
  };

  return (
    <div className="w-full rounded-2xl border border-white/5 bg-hf-surface overflow-hidden">
      {/* Video */}
      <div className="relative group aspect-video bg-black overflow-hidden">
        <video
          ref={videoRef}
          src={item.url}
          className="w-full h-full object-contain"
          autoPlay loop muted={isMuted} playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <span className="px-1.5 py-0.5 rounded-md bg-hf-lime text-[10px] font-bold text-hf-ink">
              {item.model || 'Wan 2.1'}
            </span>
            <button onClick={handleFullscreen} className="hf-btn hf-btn-soft hf-icon-btn bg-black/50 backdrop-blur-sm">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={togglePlay} className="p-2 rounded-full bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button onClick={toggleMute} className="p-2 rounded-full bg-black/40 text-white/70 hover:text-white">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
            <button onClick={handleDownload} className="btn-lime py-1.5 px-3 text-xs">
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-white/60 mb-1">Scene Prompt</div>
            <p className="text-sm text-white/80 leading-relaxed">{item.prompt}</p>
          </div>
          <button onClick={handleCopyPrompt} className="btn-ghost p-2 shrink-0 mt-2">
            {copied ? <Check className="w-4 h-4 text-[var(--lime)]" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 text-[11px] text-hf-muted font-mono">
            <span>ID: {item.id ? item.id.substring(0, 16) : 'task'}...</span>
            {item.isDemo && (
              <span className="px-1.5 py-0.5 rounded bg-[var(--lime-dim)] text-[var(--lime)] text-[9px] font-bold">Demo</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onRemix && (
              <button onClick={() => onRemix(item)} className="btn-ghost text-xs">
                <RefreshCw className="w-3.5 h-3.5 text-[var(--lime)]" />
                <span>Recreate</span>
              </button>
            )}
            <button onClick={() => setShowPayload(!showPayload)} className="btn-ghost text-xs p-1.5">
              <Code className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {showPayload && (
          <div className="rounded-xl bg-hf-panel p-3 text-[11px] font-mono text-zinc-400">
            <div className="text-[var(--lime)] font-semibold mb-1">Task Details</div>
            <pre className="overflow-x-auto p-2 bg-black/50 rounded text-[10px]">
              {JSON.stringify(item.rawOutput || item, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
