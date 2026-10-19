import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Download,
  RefreshCw,
  Film,
  Key,
  X
} from 'lucide-react';
import { generateImage, alibabaConfig, generationStorage, ALIBABA_IMAGE_MODELS } from '../services/alibabaApi';
import { STYLE_PRESETS } from '../data/curatedPresets';

const IMAGE_ASPECTS = [
  { id: '1:1', label: '1:1 Square', size: '1024*1024' },
  { id: '16:9', label: '16:9 Wide', size: '1280*720' },
  { id: '9:16', label: '9:16 Portrait', size: '720*1280' }
];

export function ImageStudio({ onSendToVideo, onOpenSettings, initialModel, onModelChange }) {
  const hasKey = alibabaConfig.hasValidKey();
  const modelRoles = alibabaConfig.getModelRoles();
  const [model, setModel] = useState(initialModel || modelRoles.image || 'wanx2.1-t2i-plus');

  React.useEffect(() => {
    if (initialModel) setModel(initialModel);
  }, [initialModel]);

  const [prompt, setPrompt] = useState('Photorealistic cinematic portrait of a cyberpunk rebel wearing illuminated neon glasses in a rainy alley, volumetric fog, Kodak Portra 400 color tones, 8k resolution.');
  const [negativePrompt, setNegativePrompt] = useState('blurry, bad anatomy, low quality, distorted, watermark');
  const [aspect, setAspect] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setErrorMessage(null);

    const activeAspect = IMAGE_ASPECTS.find(a => a.id === aspect);
    const size = activeAspect ? activeAspect.size : '1024*1024';

    try {
      const res = await generateImage({ model, prompt, negativePrompt, size });
      setCurrentImage(res);
      generationStorage.save(res);
    } catch (err) {
      setErrorMessage(err.message || 'Image generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!currentImage?.url) return;
    const a = document.createElement('a');
    a.href = currentImage.url;
    a.download = `puhhfield-wanx-${currentImage.id || 'image'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // When no API key is configured, hide all models and show empty state
  if (!hasKey) {
    return (
      <div className="w-full flex flex-col items-center justify-center pt-16 pb-24 px-4">
        <div className="text-center mb-8 max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white mb-2">
            Create AI Images
          </h1>
          <p className="text-sm text-zinc-400">
            Photorealistic text-to-image synthesis powered by Alibaba Cloud Wanx 2.1.
          </p>
        </div>

        <div className="w-full max-w-xl mx-auto p-8 rounded-3xl border border-white/[0.08] bg-[#121316] text-center flex flex-col items-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-4 text-[var(--lime)]">
            <Key className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white font-display">Connect AI Provider to Start Generating</h2>
          <p className="text-sm text-zinc-400 mt-2 max-w-md leading-relaxed">
            Import your Alibaba Cloud Model Studio API key in AI Models to unlock Wanx 2.1 Image Plus, Turbo, and Qwen-VL models.
          </p>
          <button
            onClick={onOpenSettings}
            className="mt-6 px-6 py-3 rounded-2xl bg-[var(--lime)] hover:bg-[#b8e600] text-black text-sm font-bold transition-all shadow-lg shadow-lime-950/20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>Import AI Provider API Key</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-10">
      <div className="text-center mb-8 max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white mb-2">
          Create AI Images
        </h1>
        <p className="text-sm text-zinc-400">
          Photorealistic synthesis with Alibaba Cloud Wanx 2.1 — Dense textures, precise lighting, cinematic cameras.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Panel */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl border border-white/[0.08] bg-[#121316] p-6 shadow-2xl space-y-5">
            {/* Header + Model Select */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[var(--lime)]" />
                <span className="text-sm font-semibold text-white font-display">Image Studio</span>
              </div>
              <select
                value={model}
                onChange={(e) => {
                  setModel(e.target.value);
                  onModelChange?.(e.target.value);
                }}
                className="bg-[#18191e] border border-white/[0.08] text-white text-xs rounded-xl px-3 py-1.5 focus:border-[var(--lime)]/50 focus:outline-none font-medium"
              >
                {ALIBABA_IMAGE_MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.badge})</option>
                ))}
              </select>
            </div>

            {/* Prompt */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Prompt</label>
              <div className="rounded-2xl border border-white/[0.06] bg-[#18191e] p-3.5 focus-within:border-[var(--lime)]/40 transition-colors">
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your image..."
                  className="w-full bg-transparent text-white text-sm leading-relaxed placeholder:text-zinc-600 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Negative Prompt */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Negative Prompt</label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                className="w-full bg-[#18191e] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[var(--lime)]/50"
              />
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {IMAGE_ASPECTS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAspect(a.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      aspect === a.id
                        ? 'border-[var(--lime)]/50 bg-[var(--lime-dim)] text-white'
                        : 'border-white/[0.04] bg-[#18191e] text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-semibold">{a.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Styles */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Styles</label>
              <div className="flex flex-wrap gap-1.5">
                {STYLE_PRESETS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setPrompt((p) => `${p}, ${s.promptAddition}`)}
                    className="px-2.5 py-1 rounded-lg border border-white/[0.04] bg-[#18191e] text-[11px] text-zinc-400 hover:text-white hover:border-white/10 transition-colors"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Action */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-3 rounded-xl bg-[var(--lime)] hover:bg-[#b8e600] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-lime-950/30 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Image...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>Generate Image</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-6">
          <div className="rounded-3xl border border-white/[0.08] bg-[#121316] p-6 shadow-2xl min-h-[440px] flex flex-col items-center justify-center text-center relative overflow-hidden">
            {isGenerating ? (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full border-2 border-[var(--lime)] border-t-transparent animate-spin mx-auto" />
                <div className="text-sm font-semibold text-white">Rendering with Alibaba Wanx 2.1...</div>
                <div className="text-xs text-zinc-500">Processing diffuse lighting and high-res details</div>
              </div>
            ) : currentImage ? (
              <div className="space-y-4 w-full">
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black aspect-square max-w-md mx-auto">
                  <img src={currentImage.url} alt="Generated" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 rounded-xl bg-[#18191e] border border-white/[0.08] hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                  {onSendToVideo && (
                    <button
                      onClick={() => onSendToVideo(currentImage.url)}
                      className="px-4 py-2 rounded-xl bg-[var(--lime)] hover:bg-[#b8e600] text-black text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Animate with Wan 2.1</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-w-xs">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto text-zinc-500">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-zinc-300">Your image will appear here</div>
                <div className="text-xs text-zinc-500 leading-relaxed">
                  Enter a prompt on the left and click Generate to run Alibaba Wanx 2.1.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
