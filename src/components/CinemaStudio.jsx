import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Film,
  Upload,
  X,
  Play,
  RefreshCw,
  ChevronDown,
  Cpu,
  Check,
  Camera,
  Key
} from 'lucide-react';
import {
  generateVideo,
  enhancePrompt,
  ALIBABA_VIDEO_MODELS,
  alibabaConfig,
  generationStorage
} from '../services/alibabaApi';
import { ASPECT_RATIOS, CAMERA_PRESETS } from '../data/curatedPresets';
import { VideoPlayer } from './VideoPlayer';

export function CinemaStudio({ onOpenSettings, onGenerationComplete, initialModel, initialMode, onModelChange }) {
  const hasKey = alibabaConfig.hasValidKey();
  const modelRoles = alibabaConfig.getModelRoles();
  const [mode, setMode] = useState(initialMode || (initialModel?.includes('i2v') ? 'i2v' : 't2v'));
  const [selectedModel, setSelectedModel] = useState(initialModel || modelRoles.video || 'wan2.1-t2v-plus');

  useEffect(() => {
    if (initialModel) setSelectedModel(initialModel);
    if (initialMode) setMode(initialMode);
  }, [initialModel, initialMode]);

  const [prompt, setPrompt] = useState('Cinematic low-angle camera push through a neon-lit futuristic alley at night, rain reflections on pavement, volumetric teal and magenta fog, 35mm anamorphic.');
  const [negativePrompt, setNegativePrompt] = useState('blurry, distorted, bad anatomy, low quality, artifacts');
  const [showNegative, setShowNegative] = useState(false);
  const [selectedAspect, setSelectedAspect] = useState('16:9');
  const [selectedCamera, setSelectedCamera] = useState('dolly-in');
  const [motionSpeed, setMotionSpeed] = useState(5);
  const [showCameraPicker, setShowCameraPicker] = useState(false);
  const [showAspectPicker, setShowAspectPicker] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);

  const [referenceImage, setReferenceImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    const newModel = newMode === 't2v' ? 'wan2.1-t2v-plus' : 'wan2.1-i2v-plus';
    setSelectedModel(newModel);
    onModelChange?.(newModel);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setReferenceImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEnhance = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await enhancePrompt(prompt, { cameraMovement: selectedCamera });
      if (res.enhancedPrompt) setPrompt(res.enhancedPrompt);
    } catch (err) {
      console.warn('Enhance failed:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorMessage('Please enter a scene prompt.');
      return;
    }
    if (mode === 'i2v' && !referenceImage) {
      setErrorMessage('Please upload a starting image for Image-to-Video.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationProgress({ status: 'STARTING', progress: 5, message: 'Initiating GPU allocation...' });

    const activeAspect = ASPECT_RATIOS.find(a => a.id === selectedAspect);
    const sizeWan = activeAspect ? activeAspect.sizeWan : '1280*720';

    try {
      const result = await generateVideo({
        model: selectedModel,
        prompt,
        negativePrompt: showNegative ? negativePrompt : '',
        imageUrl: referenceImage,
        size: sizeWan,
        duration: 5,
        promptExtend: true,
        onProgress: (prog) => setGenerationProgress(prog)
      });

      setCurrentResult(result);
      generationStorage.save(result);
      onGenerationComplete?.();
    } catch (err) {
      setErrorMessage(err.message || 'Generation failed. Check your API key.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(null);
    }
  };

  const handleRemix = (item) => {
    setPrompt(item.prompt);
    if (item.model) setSelectedModel(item.model);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!isGenerating) handleGenerate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prompt, selectedModel, referenceImage, mode, isGenerating]);

  // When no API provider is connected, hide all models and show only prompt to connect
  if (!hasKey) {
    return (
      <div className="w-full flex flex-col items-center justify-center pt-16 pb-24 px-4">
        <div className="text-center mb-8 max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white mb-2">
            Create AI Videos
          </h1>
          <p className="text-sm text-zinc-400">
            Direct camera, animate scenes, and generate cinema-grade video with Alibaba Cloud Wan 2.1.
          </p>
        </div>

        <div className="w-full max-w-xl mx-auto p-8 rounded-3xl border border-white/[0.08] bg-[#121316] text-center flex flex-col items-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-4 text-[var(--lime)]">
            <Key className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white font-display">Connect AI Provider to Start Generating</h2>
          <p className="text-sm text-zinc-400 mt-2 max-w-md leading-relaxed">
            Import your Alibaba Cloud Model Studio API key in AI Models to activate Wan 2.1 Video Plus, Turbo, and Image-to-Video models.
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

  const activeModelObj = ALIBABA_VIDEO_MODELS.find(m => m.id === selectedModel) || ALIBABA_VIDEO_MODELS[0];
  const activeCameraObj = CAMERA_PRESETS.find(c => c.id === selectedCamera) || CAMERA_PRESETS[0];

  return (
    <div className="w-full flex flex-col items-center pt-10 pb-24 px-4">
      {/* Hero Title */}
      <div className="text-center mb-8 max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white mb-2">
          Create AI Videos
        </h1>
        <p className="text-sm text-zinc-400">
          Powered by <strong className="text-white font-semibold">Alibaba Cloud {activeModelObj.name}</strong> — Type your prompt, direct camera, generate cinema-grade video.
        </p>
      </div>

      {/* Composer Card — 1:1 Rounded 3XL Higgsfield Style */}
      <div className="w-full max-w-3xl mx-auto rounded-3xl border border-white/[0.08] bg-[#121316] p-6 sm:p-7 shadow-2xl space-y-5">
        {/* Mode Tabs + Model Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#18191e] border border-white/[0.05]">
            <button
              onClick={() => handleModeChange('t2v')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                mode === 't2v'
                  ? 'bg-white/10 text-[var(--lime)] shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Text → Video
            </button>
            <button
              onClick={() => handleModeChange('i2v')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                mode === 'i2v'
                  ? 'bg-white/10 text-[var(--lime)] shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Image → Video
            </button>
          </div>

          {/* Model Picker */}
          <div className="relative">
            <button
              onClick={() => setShowModelPicker(!showModelPicker)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#18191e] border border-white/[0.08] text-xs font-medium text-white hover:border-[var(--lime)]/40 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-[var(--lime)]" />
              <span>{activeModelObj.name}</span>
              <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${showModelPicker ? 'rotate-180' : ''}`} />
            </button>

            {showModelPicker && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-[#141518] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  Alibaba Cloud Models
                </div>
                <div className="space-y-1 mt-1">
                  {ALIBABA_VIDEO_MODELS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedModel(m.id);
                        onModelChange?.(m.id);
                        setShowModelPicker(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        selectedModel === m.id
                          ? 'bg-white/10 text-white font-semibold'
                          : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-white">{m.name}</div>
                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{m.badge}</div>
                      </div>
                      {selectedModel === m.id && <Check className="w-4 h-4 text-[var(--lime)]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image Upload (I2V mode) */}
        {mode === 'i2v' && (
          <div className="p-3.5 rounded-2xl bg-[#18191e] border border-white/[0.06]">
            {referenceImage ? (
              <div className="relative w-32 h-24 rounded-xl overflow-hidden border border-white/15 bg-black shrink-0">
                <img src={referenceImage} alt="Ref" className="w-full h-full object-cover" />
                <button
                  onClick={() => setReferenceImage(null)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/80 text-white hover:bg-red-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-3.5 px-4 py-3.5 border border-dashed border-white/15 rounded-2xl hover:border-[var(--lime)]/50 cursor-pointer transition-colors w-full">
                <Upload className="w-5 h-5 text-[var(--lime)]" />
                <div>
                  <div className="text-xs font-semibold text-white">Upload Reference Frame</div>
                  <div className="text-[11px] text-zinc-400">Wan 2.1 will animate this image</div>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
        )}

        {/* Prompt Area */}
        <div className="rounded-2xl bg-[#18191e] border border-white/[0.06] p-4 focus-within:border-[var(--lime)]/40 transition-colors">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your scene in cinematic detail..."
            className="w-full bg-transparent text-white text-sm leading-relaxed placeholder:text-zinc-600 focus:outline-none resize-none"
          />
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Aspect Ratio */}
            <div className="relative">
              <button
                onClick={() => setShowAspectPicker(!showAspectPicker)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#18191e] border border-white/[0.08] text-xs font-medium text-white hover:border-white/20 transition-colors"
              >
                <span className="font-mono text-[var(--lime)] text-[11px]">{selectedAspect}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>
              {showAspectPicker && (
                <div className="absolute left-0 top-full mt-2 w-48 rounded-2xl bg-[#141518] border border-white/10 shadow-2xl p-2 z-50">
                  {ASPECT_RATIOS.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => { setSelectedAspect(a.id); setShowAspectPicker(false); }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs ${
                        selectedAspect === a.id
                          ? 'bg-white/10 text-white font-semibold'
                          : 'text-zinc-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{a.label}</span>
                      <span className="text-[10px] font-mono text-zinc-500">{a.sizeWan}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Camera */}
            <div className="relative">
              <button
                onClick={() => setShowCameraPicker(!showCameraPicker)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#18191e] border border-white/[0.08] text-xs font-medium text-white hover:border-white/20 transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-[var(--lime)]" />
                <span>{activeCameraObj.name}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>
              {showCameraPicker && (
                <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl bg-[#141518] border border-white/10 shadow-2xl p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] mb-2">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Camera Movement</span>
                    <button onClick={() => setShowCameraPicker(false)} className="text-zinc-500 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {CAMERA_PRESETS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => { setSelectedCamera(c.id); setShowCameraPicker(false); }}
                        className={`p-2 rounded-xl text-left text-xs transition-colors ${
                          selectedCamera === c.id
                            ? 'bg-white/10 text-white font-semibold'
                            : 'text-zinc-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="truncate">{c.name}</div>
                        <div className="text-[9px] text-zinc-500">{c.category}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#18191e] border border-white/[0.08] text-xs text-zinc-400">
              <span>Duration:</span>
              <span className="font-mono text-white font-semibold text-[11px]">5s</span>
            </div>

            {/* Enhance Button */}
            <button
              onClick={handleEnhance}
              disabled={isEnhancing || !prompt.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#18191e] border border-white/[0.08] text-xs text-zinc-300 hover:border-[var(--lime)]/40 hover:text-[var(--lime)] transition-colors"
            >
              {isEnhancing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-[var(--lime)]" />
              )}
              <span>{isEnhancing ? 'Enhancing...' : 'Director AI'}</span>
            </button>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-[var(--lime)] hover:bg-[#b8e600] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-lime-950/30 flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black" />
                <span>Generate Video</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="w-full max-w-3xl mt-4 p-3.5 rounded-2xl border border-red-500/20 bg-red-950/20 text-red-400 text-xs flex items-center gap-2">
          <X className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Generation Progress / Result */}
      <div className="w-full max-w-3xl mt-6">
        {isGenerating && generationProgress ? (
          <div className="w-full aspect-video rounded-3xl border border-white/[0.08] bg-[#121316] flex flex-col items-center justify-center p-8 space-y-5 text-center relative overflow-hidden shadow-2xl">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-white/10" />
              <div className="absolute inset-0 rounded-full border-2 border-[var(--lime)] border-t-transparent animate-spin" />
              <Film className="w-6 h-6 text-[var(--lime)]" />
            </div>

            <div className="z-10 space-y-1">
              <div className="text-sm font-bold text-white font-display">{generationProgress.message}</div>
              <div className="text-[11px] text-zinc-500 font-mono">
                {generationProgress.taskId ? `Task ID: ${generationProgress.taskId}` : 'Allocating Alibaba GPU...'}
              </div>
            </div>

            <div className="w-48 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-[var(--lime)] rounded-full transition-all duration-300" style={{ width: `${generationProgress.progress}%` }} />
            </div>
            <div className="text-xs font-mono font-bold text-[var(--lime)]">
              {generationProgress.progress}%
            </div>
          </div>
        ) : currentResult ? (
          <VideoPlayer item={currentResult} onRemix={handleRemix} />
        ) : null}
      </div>
    </div>
  );
}
