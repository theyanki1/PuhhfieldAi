import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Film,
  Image as ImageIcon,
  Volume2,
  Upload,
  X,
  Play,
  Pause,
  Download,
  Check,
  ChevronRight,
  ChevronDown,
  Clock,
  RectangleHorizontal,
  Smile,
  Pencil,
  Ban,
  Folder,
  ArrowRight,
  RefreshCw,
  Mic,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Plane,
  RotateCw,
  Focus,
  Video
} from 'lucide-react';
import {
  generateVideo,
  generateImage,
  generateAudio,
  enhancePrompt,
  alibabaConfig,
  generationStorage
} from '../services/alibabaApi';
import {
  AI_PROVIDERS,
  providersStorage,
  ProviderLogos
} from '../services/aiProviders';
import { ASPECT_RATIOS, CAMERA_PRESETS, STYLE_PRESETS } from '../data/curatedPresets';
import { VideoPlayer } from './VideoPlayer';

const MODES = [
  { id: 't2v', label: 'Text to Video', category: 'video' },
  { id: 'i2v', label: 'Image to Video', category: 'video' },
  { id: 't2i', label: 'Text to Image', category: 'image' },
  { id: 't2a', label: 'Text to Audio', category: 'audio' }
];

const CATEGORY_TABS = [
  { id: 'video', label: 'Video', mode: 't2v' },
  { id: 'image', label: 'Image', mode: 't2i' },
  { id: 'audio', label: 'Audio', mode: 't2a' }
];

const AUDIO_VOICES = [
  { id: 'longxiaochun', name: 'Longxiaochun', gender: 'Female', desc: 'Warm natural narrator voice' },
  { id: 'longwan', name: 'Longwan', gender: 'Female', desc: 'Crisp professional broadcast voice' },
  { id: 'longcheng', name: 'Longcheng', gender: 'Male', desc: 'Deep authoritative cinematic narrator' },
  { id: 'longhua', name: 'Longhua', gender: 'Male', desc: 'Energetic casual young male' }
];

const AUDIO_EMOTIONS = ['Dramatic', 'Natural', 'Energetic', 'Calm', 'Storyteller', 'Whisper'];

const CAMERA_ICONS = { ZoomIn, ZoomOut, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Plane, RotateCw, Focus, Clock, Video };

const TAG_CLASS = { TOP: 'hf-tag-top', NEW: 'hf-tag-new', FAST: 'hf-tag-fast' };
const ICON_CLASS = { TOP: 'is-top', NEW: 'is-new', FAST: 'is-fast' };

// Accent glow behind the preset card per category
const CATEGORY_ACCENT = { video: '#d1fe17', image: '#9333ea', audio: '#3cd8ff' };

export function StudioLanding({
  onOpenSettings,
  onOpenAiModels,
  onGenerationComplete,
  onToggleHistory,
  historyCount = 0,
  selectedModelFromNav,
  selectedCategoryFromNav,
  onSelectMedia
}) {
  // Current Generation Mode: 't2v' | 'i2v' | 't2i' | 't2a'
  const [activeMode, setActiveMode] = useState('t2v');

  // Track connected providers
  const [connectedProviders, setConnectedProviders] = useState(() => providersStorage.getConnectedProviders());
  const hasAnyProvider = connectedProviders.length > 0 || alibabaConfig.hasValidKey();

  // Selected Models per Category
  const [videoModel, setVideoModel] = useState('wan-2.7');
  const [imageModel, setImageModel] = useState('wanx2.1-t2i-plus');
  const [audioModel, setAudioModel] = useState('cosyvoice-v1');

  // Prompts
  const [videoPrompt, setVideoPrompt] = useState('Cinematic low-angle camera push through a neon-lit futuristic alley at night, rain reflections on pavement, volumetric teal and magenta fog, 35mm anamorphic.');
  const [imagePrompt, setImagePrompt] = useState('Photorealistic cinematic portrait of an astronaut looking at glowing crystal monoliths on Mars at golden hour, shallow depth of field, 8k resolution, Hasselblad medium format.');
  const [audioPrompt, setAudioPrompt] = useState('Welcome to PuhhfieldAi. Next-generation open-source AI video, image, and expressive audio generation studio.');

  // Negative Prompts
  const [negativePrompt, setNegativePrompt] = useState('blurry, distorted, bad anatomy, low quality, artifacts, watermark');
  const [showNegative, setShowNegative] = useState(false);

  // Common Parameters
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [cameraMovement, setCameraMovement] = useState('dolly-in');
  const [duration, setDuration] = useState('5s');
  const [stylePreset, setStylePreset] = useState('cinematic-film');
  const [audioVoice, setAudioVoice] = useState('longxiaochun');
  const [audioEmotion, setAudioEmotion] = useState('Dramatic');

  // Image to Video Keyframes
  const [firstFrameImage, setFirstFrameImage] = useState(null);
  const [lastFrameImage, setLastFrameImage] = useState(null);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Audio Playback
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioInstance, setAudioInstance] = useState(null);

  // Open picker popover: null | 'model' | 'preset' | 'duration' | 'aspect' | 'emotion'
  const [openPicker, setOpenPicker] = useState(null);
  const togglePicker = (name) => setOpenPicker(prev => (prev === name ? null : name));

  // Sync when user selects a model from top nav dropdown
  useEffect(() => {
    if (selectedModelFromNav && selectedCategoryFromNav) {
      if (selectedCategoryFromNav === 'video') {
        setVideoModel(selectedModelFromNav);
        if (selectedModelFromNav.includes('i2v')) {
          setActiveMode('i2v');
        } else {
          setActiveMode('t2v');
        }
      } else if (selectedCategoryFromNav === 'image') {
        setImageModel(selectedModelFromNav);
        setActiveMode('t2i');
      } else if (selectedCategoryFromNav === 'audio') {
        setAudioModel(selectedModelFromNav);
        setActiveMode('t2a');
      }
    }
  }, [selectedModelFromNav, selectedCategoryFromNav]);

  // Refresh connected providers periodically or on focus
  useEffect(() => {
    const refresh = () => setConnectedProviders(providersStorage.getConnectedProviders());
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);

  // Compute current active media category: 'video' | 'image' | 'audio'
  const currentCategory = MODES.find(m => m.id === activeMode)?.category || 'video';

  // Dynamic heading word: Videos | Images | Audio
  const headingWord =
    currentCategory === 'video' ? 'Videos' :
    currentCategory === 'image' ? 'Images' : 'Audio';

  // Get active prompt based on mode
  const currentPrompt =
    currentCategory === 'video' ? videoPrompt :
    currentCategory === 'image' ? imagePrompt : audioPrompt;

  const setCurrentPrompt = (val) => {
    if (currentCategory === 'video') setVideoPrompt(val);
    else if (currentCategory === 'image') setImagePrompt(val);
    else setAudioPrompt(val);
  };

  // Get active model ID
  const activeModelId =
    currentCategory === 'video' ? videoModel :
    currentCategory === 'image' ? imageModel : audioModel;

  const setActiveModelId = (id) => {
    if (currentCategory === 'video') setVideoModel(id);
    else if (currentCategory === 'image') setImageModel(id);
    else setAudioModel(id);
  };

  // Find models available for current category across connected providers (or all for preview)
  const connectedModels = providersStorage.getConnectedModelsByCategory(currentCategory);
  const allAvailableModels = providersStorage.getAllModelsByCategory(currentCategory);
  const displayModels = connectedModels.length > 0 ? connectedModels : allAvailableModels;
  const currentModelObj = displayModels.find(m => m.id === activeModelId) || displayModels[0];

  // Mode switching (keeps the I2V / T2V model pairing)
  const selectMode = (modeId) => {
    setActiveMode(modeId);
    if (modeId === 'i2v' && !videoModel.includes('i2v')) {
      setVideoModel('wan2.1-i2v-plus');
    } else if (modeId === 't2v' && videoModel.includes('i2v')) {
      setVideoModel('wan-2.7');
    }
  };

  // Active preset shown on the panel card (camera / style / voice)
  const activeCamera = CAMERA_PRESETS.find(c => c.id === cameraMovement) || CAMERA_PRESETS[0];
  const activeStyle = STYLE_PRESETS.find(s => s.id === stylePreset) || STYLE_PRESETS[0];
  const activeVoice = AUDIO_VOICES.find(v => v.id === audioVoice) || AUDIO_VOICES[0];
  const activeAspect = ASPECT_RATIOS.find(a => a.id === aspectRatio) || ASPECT_RATIOS[0];

  const presetTitle =
    currentCategory === 'video' ? activeCamera.name :
    currentCategory === 'image' ? activeStyle.name : activeVoice.name;

  const presetAccent = currentCategory === 'image' ? activeStyle.previewColor : CATEGORY_ACCENT[currentCategory];

  // Image Upload Handlers
  const handleFirstFrameUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFirstFrameImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLastFrameUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLastFrameImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Director Prompt Enhancement
  const handleEnhance = async () => {
    if (!currentPrompt.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await enhancePrompt(currentPrompt, {
        cameraMovement,
        category: currentCategory
      });
      if (res.enhancedPrompt) {
        setCurrentPrompt(res.enhancedPrompt);
      }
    } catch (err) {
      console.warn('Enhancement notice:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Generate Execution
  const handleGenerate = async () => {
    if (!currentPrompt.trim()) {
      setErrorMessage(`Please enter a prompt for ${headingWord.toLowerCase()} generation.`);
      return;
    }
    if (activeMode === 'i2v' && !firstFrameImage) {
      setErrorMessage('Please upload a starting image for Image-to-Video animation.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setCurrentResult(null);

    const activeAspect = ASPECT_RATIOS.find(a => a.id === aspectRatio);
    const sizeWan = activeAspect ? activeAspect.sizeWan : '1280*720';

    try {
      if (currentCategory === 'video') {
        setGenerationProgress({ status: 'STARTING', progress: 5, message: 'Allocating video GPU cluster...' });
        const result = await generateVideo({
          model: videoModel,
          prompt: videoPrompt,
          negativePrompt: showNegative ? negativePrompt : '',
          imageUrl: firstFrameImage,
          size: sizeWan,
          duration: duration === '10s' ? 10 : 5,
          promptExtend: true,
          onProgress: (prog) => setGenerationProgress(prog)
        });
        setCurrentResult(result);
        generationStorage.save(result);
      } else if (currentCategory === 'image') {
        setGenerationProgress({ status: 'PROCESSING', progress: 40, message: 'Synthesizing high-res image...' });
        const size = activeAspect ? (activeAspect.id === '1:1' ? '1024*1024' : activeAspect.sizeWan) : '1024*1024';
        const result = await generateImage({
          model: imageModel,
          prompt: imagePrompt,
          negativePrompt: showNegative ? negativePrompt : '',
          size
        });
        setCurrentResult(result);
        generationStorage.save(result);
      } else if (currentCategory === 'audio') {
        setGenerationProgress({ status: 'PROCESSING', progress: 50, message: 'Synthesizing neural audio...' });
        const result = await generateAudio({
          model: audioModel,
          prompt: audioPrompt,
          voice: audioVoice
        });
        setCurrentResult(result);
        generationStorage.save(result);
      }

      onGenerationComplete?.();
    } catch (err) {
      setErrorMessage(err.message || `Generation failed. Check your API provider key in AI Models.`);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(null);
    }
  };

  // Audio Playback Toggle
  const handleTogglePlayAudio = () => {
    if (!currentResult?.url) return;
    if (isPlayingAudio) {
      audioInstance?.pause();
      setIsPlayingAudio(false);
    } else {
      const audio = audioInstance || new Audio(currentResult.url);
      if (!audioInstance) {
        setAudioInstance(audio);
        audio.onended = () => setIsPlayingAudio(false);
      }
      audio.play();
      setIsPlayingAudio(true);
    }
  };

  // Keyboard shortcut Ctrl+Enter to generate
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!isGenerating) handleGenerate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPrompt, activeMode, videoModel, imageModel, audioModel, firstFrameImage, isGenerating]);

  // ─── Render helpers ──────────────────────────────────────────────────────
  const getModelLogoKey = (model) => {
    if (model.logoKey) return model.logoKey;
    const provider = AI_PROVIDERS.find(p => p.name === model.providerName || p.models.some(m => m.id === model.id));
    return provider?.logoKey || 'alibaba';
  };

  const renderModelIcon = (model) => {
    const Logo = ProviderLogos[getModelLogoKey(model)];
    return (
      <div className={`hf-model-icon ${ICON_CLASS[model.badge] || ''}`}>
        {model.badge && (
          <span className={`hf-tag ${TAG_CLASS[model.badge] || 'hf-tag-new'}`}>{model.badge}</span>
        )}
        {Logo ? <Logo className="w-6 h-6" /> : <Sparkles className="w-6 h-6 text-white/70" />}
      </div>
    );
  };

  // Fly-out next to the panel on desktop, dropdown below on mobile
  const flyoutClass = 'absolute z-40 left-0 right-0 top-full mt-2 lg:right-auto lg:mt-0 lg:top-0 lg:left-[calc(100%+12px)] lg:w-[420px] max-h-[70vh] lg:max-h-[calc(100vh-76px)] overflow-y-auto no-scrollbar';

  // Small popover opening above a chip
  const renderOptionPopover = (options, selectedId, onSelect) => (
    <div className="hf-popover hf-popover-sm absolute z-40 bottom-full left-0 mb-2 min-w-full w-max max-w-[280px]">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => {
            onSelect(opt.id);
            setOpenPicker(null);
          }}
          className={`hf-menu-item gap-3 ${selectedId === opt.id ? 'selected' : ''}`}
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-hf-text">{opt.label}</p>
            {opt.desc && <p className="text-xs text-hf-muted truncate">{opt.desc}</p>}
          </div>
          {selectedId === opt.id && <Check className="w-4 h-4 text-hf-lime shrink-0" />}
        </button>
      ))}
    </div>
  );

  // Preset picker items per category (camera / style / voice)
  const renderPresetPicker = () => {
    let label = 'Camera presets';
    let items = [];

    if (currentCategory === 'video') {
      items = CAMERA_PRESETS.map((cam) => {
        const Icon = CAMERA_ICONS[cam.icon] || Video;
        return {
          id: cam.id,
          title: cam.name,
          desc: `${cam.category} • ${cam.description}`,
          icon: <div className="hf-model-icon"><Icon className="w-5 h-5 text-white/80" /></div>,
          selected: cameraMovement === cam.id,
          onSelect: () => setCameraMovement(cam.id)
        };
      });
    } else if (currentCategory === 'image') {
      label = 'Style presets';
      items = STYLE_PRESETS.map((st) => ({
        id: st.id,
        title: st.name,
        desc: `${st.badge} • ${st.promptSnippet}`,
        icon: (
          <div
            className="hf-model-icon"
            style={{ background: `radial-gradient(circle at 30% 20%, ${st.previewColor} 0%, #23262a 75%)` }}
          />
        ),
        selected: stylePreset === st.id,
        onSelect: () => setStylePreset(st.id)
      }));
    } else {
      label = 'Voices';
      items = AUDIO_VOICES.map((v) => ({
        id: v.id,
        title: v.name,
        desc: `${v.gender} • ${v.desc}`,
        icon: <div className="hf-model-icon"><Mic className="w-5 h-5 text-white/80" /></div>,
        selected: audioVoice === v.id,
        onSelect: () => setAudioVoice(v.id)
      }));
    }

    return (
      <div className={`hf-popover ${flyoutClass}`}>
        <div className="pt-3 pr-2 pb-2">
          <p className="hf-popover-label pt-0">{label}</p>
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                item.onSelect();
                setOpenPicker(null);
              }}
              className={`hf-menu-item ${item.selected ? 'selected' : ''}`}
            >
              {item.icon}
              <div className="flex-1 min-w-0">
                <p className="hf-menu-title truncate">{item.title}</p>
                <p className="hf-menu-desc line-clamp-1">{item.desc}</p>
              </div>
              {item.selected && <Check className="w-4 h-4 text-hf-lime shrink-0" />}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderModelPicker = () => (
    <div className={`hf-popover ${flyoutClass}`}>
      <div className="pt-3 pr-2 pb-2">
        <div className="flex items-center justify-between">
          <p className="hf-popover-label pt-0">Models</p>
          <span className="text-xs text-hf-muted">
            {connectedModels.length > 0 ? `${connectedModels.length} active` : 'Preview'}
          </span>
        </div>
        {displayModels.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setActiveModelId(m.id);
              setOpenPicker(null);
            }}
            className={`hf-menu-item ${activeModelId === m.id ? 'selected' : ''}`}
          >
            {renderModelIcon(m)}
            <div className="flex-1 min-w-0">
              <p className="hf-menu-title truncate">{m.name}</p>
              <p className="hf-menu-desc line-clamp-1">{m.desc}</p>
            </div>
            {activeModelId === m.id && <Check className="w-4 h-4 text-hf-lime shrink-0" />}
          </button>
        ))}
      </div>
    </div>
  );

  // Keyframe upload tile (Image to Video)
  const renderFrameTile = ({ image, onUpload, onRemove, title, hint, Icon }) => (
    image ? (
      <div className="relative h-[92px] rounded-xl overflow-hidden group">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 text-[10px] font-semibold text-white">
          {title}
        </span>
        <button
          onClick={onRemove}
          className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/60 hover:bg-black text-white transition-colors"
          title="Remove image"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    ) : (
      <label className="flex flex-col items-center justify-center h-[92px] rounded-xl hover:bg-white/[0.03] cursor-pointer transition-colors text-center">
        <span className="w-8 h-8 rounded-full bg-hf-card border border-white/10 flex items-center justify-center mb-1.5">
          <Icon className="w-3.5 h-3.5 text-white/80" />
        </span>
        <span className="text-sm font-medium text-hf-muted leading-5">{title}</span>
        <span className="text-xs font-medium text-white/60 leading-[18px]">{hint}</span>
        <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
      </label>
    )
  );

  // ─── "How it works" steps (canvas empty state) ───────────────────────────
  // Selected preset in the middle, its neighbours on the sides
  const presetList =
    currentCategory === 'video' ? CAMERA_PRESETS :
    currentCategory === 'image' ? STYLE_PRESETS : AUDIO_VOICES;
  const presetIndex = Math.max(0, presetList.findIndex(p => p.name === presetTitle));
  const presetNames = [-1, 0, 1].map(offset => presetList[(presetIndex + offset + presetList.length) % presetList.length].name);

  const steps = [
    activeMode === 'i2v'
      ? { title: 'Add image', desc: 'Upload a start frame to begin your animation' }
      : currentCategory === 'audio'
      ? { title: 'Write a script', desc: 'Enter dialogue or story text to synthesize' }
      : { title: 'Write a prompt', desc: 'Describe your scene, subject, lighting and mood' },
    currentCategory === 'video'
      ? { title: 'Choose preset', desc: 'Pick a camera preset to control movement' }
      : currentCategory === 'image'
      ? { title: 'Choose style', desc: 'Pick a style preset for the final look' }
      : { title: 'Choose voice', desc: 'Pick a voice actor and vocal emotion' },
    { title: `Get ${currentCategory}`, desc: `Click generate to create your final ${currentCategory}!` }
  ];

  const renderStepVisual = (index) => {
    if (index === 0) {
      return (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          {activeMode === 'i2v' ? (
            <div className="w-full h-full rounded-xl border border-dashed border-white/15 flex flex-col items-center justify-center gap-3">
              <ImageIcon className="w-9 h-9 text-white/80" strokeWidth={1.5} />
              <span className="hf-display text-xl text-hf-text">Start frame</span>
            </div>
          ) : (
            <div className="w-full max-w-[300px] rounded-2xl bg-hf-surface border border-white/5 p-3 space-y-3 shadow-2xl">
              <p className="text-xs text-white/70 leading-relaxed line-clamp-2">{currentPrompt || 'Describe your scene...'}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <span className="hf-mini-chip text-[10px]">{currentCategory === 'audio' ? activeVoice.name : activeAspect.label}</span>
                  <span className="hf-mini-chip text-[10px]">{currentModelObj?.name || activeModelId}</span>
                </div>
                <span className="w-7 h-7 rounded-lg bg-hf-lime text-hf-ink flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (index === 1) {
      return (
        <div className="absolute inset-0 flex items-center justify-center gap-3 px-4">
          {presetNames.map((name, i) => (
            <div
              key={name}
              className={`relative flex items-end h-[72%] rounded-xl overflow-hidden p-2.5 ${
                i === 1 ? 'w-[42%] border border-hf-lime' : 'w-[26%] border border-white/5 opacity-50'
              }`}
              style={{ background: `linear-gradient(160deg, ${presetAccent}${i === 1 ? '40' : '1f'} 0%, #16181a 70%)` }}
            >
              <span className="hf-display text-xs leading-4 text-hf-text">{name}</span>
            </div>
          ))}
        </div>
      );
    }

    const ResultIcon = currentCategory === 'video' ? Play : currentCategory === 'image' ? ImageIcon : Volume2;
    return (
      <div className="absolute inset-0 p-5">
        <div
          className="w-full h-full rounded-2xl border-[3px] border-white flex items-center justify-center"
          style={{ background: `radial-gradient(circle at 50% 40%, ${presetAccent}33 0%, #0f1113 70%)` }}
        >
          <span className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <ResultIcon className="w-6 h-6 text-white" />
          </span>
        </div>
      </div>
    );
  };

  // ─── Layout ──────────────────────────────────────────────────────────────
  return (
    <div className="w-full flex flex-col lg:flex-row gap-2 px-2 sm:px-4 pb-4 min-h-[calc(100vh-52px)]">
      {/* Click-away layer for open pickers */}
      {openPicker && (
        <div className="fixed inset-0 z-30" onClick={() => setOpenPicker(null)} />
      )}

      {/* ═══ Left control panel ═══════════════════════════════════════════ */}
      <aside className="hf-panel relative w-full lg:w-[320px] shrink-0 flex flex-col gap-2 p-2">
        {/* Category tabs */}
        <nav className="flex items-center gap-4 px-2 pt-1">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (currentCategory !== tab.id) selectMode(tab.mode);
              }}
              className={`hf-tab ${currentCategory === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Preset card */}
        <div className="relative lg:static">
          <div
            className="relative h-[106px] rounded-xl overflow-hidden"
            style={{
              background: `radial-gradient(120% 140% at 100% 0%, ${presetAccent}59 0%, transparent 55%), linear-gradient(160deg, #2b2e33 0%, #15171a 100%)`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <button
              onClick={() => togglePicker('preset')}
              className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md text-xs font-medium text-white hover:bg-black/60 transition-colors"
            >
              <Pencil className="w-3 h-3" />
              <span>Change</span>
            </button>
            <div className="absolute left-3 right-3 bottom-2.5">
              <p className="hf-display text-xl leading-7 text-hf-lime truncate">{presetTitle}</p>
              <p className="text-xs leading-[18px] text-white/80 truncate">{currentModelObj?.name || activeModelId}</p>
            </div>
          </div>
          {openPicker === 'preset' && renderPresetPicker()}
        </div>

        {/* Video sub-mode segmented control */}
        {currentCategory === 'video' && (
          <div className="hf-segment">
            {MODES.filter(m => m.category === 'video').map((mode) => (
              <button
                key={mode.id}
                onClick={() => selectMode(mode.id)}
                className={`hf-segment-item ${activeMode === mode.id ? 'active' : ''}`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        )}

        {/* Image to Video: First & Last frame */}
        {activeMode === 'i2v' && (
          <div className="rounded-2xl border border-dashed border-white/[0.08] bg-hf-surface p-2">
            <div className="grid grid-cols-2 gap-2">
              {renderFrameTile({
                image: firstFrameImage,
                onUpload: handleFirstFrameUpload,
                onRemove: () => setFirstFrameImage(null),
                title: 'Start frame',
                hint: 'Required',
                Icon: Upload
              })}
              {renderFrameTile({
                image: lastFrameImage,
                onUpload: handleLastFrameUpload,
                onRemove: () => setLastFrameImage(null),
                title: 'End frame',
                hint: 'Optional',
                Icon: Film
              })}
            </div>
            {videoModel.includes('2.7') && (
              <p className="px-1 pt-2 text-[11px] font-medium text-hf-lime">
                Wan 2.7 first & last frame control active
              </p>
            )}
          </div>
        )}

        {/* Prompt box */}
        <div>
          <div className="relative rounded-t-xl bg-hf-surface border border-[var(--border-faint)] border-b-0">
            <span className="absolute top-3 left-3 text-sm font-medium text-hf-muted pointer-events-none">
              Prompt
            </span>
            <textarea
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              rows={4}
              placeholder={
                currentCategory === 'video'
                  ? 'Describe your cinematic scene, camera movement, lighting, atmosphere...'
                  : currentCategory === 'image'
                  ? 'Describe your visual concept, subject, lighting, mood, camera gear...'
                  : 'Enter dialogue, speech script, or story text to synthesize...'
              }
              className="block w-full bg-transparent pt-9 px-3 pb-2 text-sm leading-5 text-hf-text placeholder:text-white/35 resize-none focus:outline-none"
            />

            {showNegative && (
              <div className="px-3 pb-2">
                <label className="block text-xs font-medium text-hf-muted mb-1">
                  Negative prompt
                </label>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="blurry, distorted, bad anatomy, low quality, artifacts, watermark"
                  className="w-full bg-hf-panel rounded-lg px-2.5 py-1.5 text-xs text-hf-text placeholder:text-white/30 focus:outline-none"
                />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-2 rounded-b-xl bg-hf-surface px-3 pt-2 pb-3">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleEnhance}
                disabled={isEnhancing || !currentPrompt.trim()}
                className="hf-mini-chip"
                title="Enhance prompt with director reasoning"
              >
                <Sparkles className={isEnhancing ? 'animate-spin' : ''} />
                <span>{isEnhancing ? 'Enhancing...' : 'Enhance'}</span>
              </button>
              <button
                onClick={() => setShowNegative(!showNegative)}
                className={`hf-mini-chip ${showNegative ? 'active' : ''}`}
              >
                <Ban />
                <span>Negative</span>
              </button>
            </div>
            <span className="text-[11px] text-white/40 tabular-nums">{currentPrompt.length}</span>
          </div>
        </div>

        {/* Model selector */}
        <div className="relative lg:static">
          <button onClick={() => togglePicker('model')} className="hf-field-btn">
            <div className="min-w-0">
              <div className="hf-field-label">Model</div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-white min-w-0">
                <span className="truncate">{currentModelObj?.name || activeModelId}</span>
                {currentModelObj?.badge && (
                  <span className={`hf-tag ${TAG_CLASS[currentModelObj.badge] || 'hf-tag-new'}`}>
                    {currentModelObj.badge}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40 shrink-0" />
          </button>
          {openPicker === 'model' && renderModelPicker()}
        </div>

        {/* Parameter chips */}
        {currentCategory === 'video' && (
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <button onClick={() => togglePicker('duration')} className="hf-chip">
                <Clock />
                <span>{duration}</span>
              </button>
              {openPicker === 'duration' && renderOptionPopover(
                [{ id: '5s', label: '5s' }, { id: '10s', label: '10s' }],
                duration,
                setDuration
              )}
            </div>
            <div className="relative">
              <button onClick={() => togglePicker('aspect')} className="hf-chip">
                <RectangleHorizontal />
                <span>{activeAspect.label}</span>
              </button>
              {openPicker === 'aspect' && renderOptionPopover(
                ASPECT_RATIOS.map(a => ({ id: a.id, label: a.label, desc: a.desc })),
                aspectRatio,
                setAspectRatio
              )}
            </div>
          </div>
        )}

        {currentCategory === 'image' && (
          <div className="relative">
            <button onClick={() => togglePicker('aspect')} className="hf-chip">
              <RectangleHorizontal />
              <span className="flex-1 text-left">Aspect ratio</span>
              <span className="hf-nav-badge text-xs leading-4">{activeAspect.label}</span>
              <ChevronDown className="w-4 h-4 text-white/40" />
            </button>
            {openPicker === 'aspect' && renderOptionPopover(
              ASPECT_RATIOS.map(a => ({ id: a.id, label: a.label, desc: a.desc })),
              aspectRatio,
              setAspectRatio
            )}
          </div>
        )}

        {currentCategory === 'audio' && (
          <div className="relative">
            <button onClick={() => togglePicker('emotion')} className="hf-chip">
              <Smile />
              <span className="flex-1 text-left">Emotion</span>
              <span className="hf-nav-badge text-xs leading-4">{audioEmotion}</span>
              <ChevronDown className="w-4 h-4 text-white/40" />
            </button>
            {openPicker === 'emotion' && renderOptionPopover(
              AUDIO_EMOTIONS.map(emo => ({ id: emo, label: emo })),
              audioEmotion,
              setAudioEmotion
            )}
          </div>
        )}

        {/* Generate */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="hf-generate mt-1"
          title="Ctrl + Enter"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <span>Generate</span>
              <Sparkles className="w-4 h-4 fill-current" />
            </>
          )}
        </button>

        {errorMessage && (
          <div className="px-3 py-2.5 rounded-xl bg-rose-500/10 text-rose-300 text-xs leading-relaxed">
            {errorMessage}
          </div>
        )}
      </aside>

      {/* ═══ Canvas ══════════════════════════════════════════════════════ */}
      <section className="hf-canvas flex-1 min-w-0 flex flex-col">
        {/* Canvas header */}
        <header className="flex items-center justify-between gap-3 px-4 pt-2 pb-3">
          <button
            onClick={onToggleHistory}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Folder className="w-3.5 h-3.5" />
            <span>History</span>
            {historyCount > 0 && <span className="text-hf-muted">{historyCount}</span>}
          </button>

          {hasAnyProvider ? (
            <button
              onClick={onOpenAiModels}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/10 text-xs font-medium text-white min-w-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-hf-lime shrink-0" />
              <span className="truncate">
                {connectedProviders.map(p => p.name).join(', ') || 'Alibaba Cloud (Wan 2.7)'}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAiModels}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--lime-dim)] text-xs font-medium text-hf-lime"
            >
              <span>Connect AI Provider</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </header>

        <div className="flex-1 flex flex-col px-4 sm:px-8 pb-8">
          {/* Generating */}
          {isGenerating && (
            <div className="flex-1 flex items-center justify-center py-16">
              <div className="w-full max-w-md text-center">
                <RefreshCw className="w-6 h-6 text-hf-lime animate-spin mx-auto mb-5" />
                <p className="hf-display text-2xl text-hf-text">Generating {headingWord}</p>
                <p className="text-sm text-hf-muted mt-1">
                  {generationProgress?.message || 'Processing task...'}
                </p>
                <div className="hf-progress mt-6">
                  <div
                    className="hf-progress-bar"
                    style={{ width: `${generationProgress?.progress || 25}%` }}
                  />
                </div>
                <p className="text-xs text-hf-muted mt-2 tabular-nums">{generationProgress?.progress || 25}%</p>
              </div>
            </div>
          )}

          {/* Result */}
          {!isGenerating && currentResult && (
            <div className="w-full max-w-5xl mx-auto pt-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-hf-lime" />
                  <span className="hf-display text-base text-hf-text">
                    {headingWord} generation complete
                  </span>
                </div>
                <span className="text-xs text-hf-muted font-mono truncate">
                  {currentResult.model || activeModelId}
                </span>
              </div>

              {/* Video Result Player */}
              {currentResult.type === 'video' && currentResult.url && (
                <div className="space-y-3">
                  <VideoPlayer item={currentResult} />
                  <div className="flex items-center justify-end">
                    <a
                      href={currentResult.url}
                      download="puhhfield-ai-video.mp4"
                      className="hf-btn hf-btn-soft"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download MP4</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Image Result */}
              {currentResult.type === 'image' && currentResult.url && (
                <div className="space-y-3">
                  <div className="rounded-2xl overflow-hidden border border-white/5 max-h-[640px] flex items-center justify-center bg-black">
                    <img src={currentResult.url} alt="Generated visual" className="w-full h-auto object-contain max-h-[640px]" />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setFirstFrameImage(currentResult.url);
                        setActiveMode('i2v');
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className="hf-btn hf-btn-tint"
                    >
                      <Film className="w-4 h-4" />
                      <span>Animate to Video</span>
                    </button>
                    <a
                      href={currentResult.url}
                      download="puhhfield-ai-image.png"
                      className="hf-btn hf-btn-soft"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PNG</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Audio Result */}
              {currentResult.type === 'audio' && currentResult.url && (
                <div className="p-5 rounded-2xl bg-hf-surface flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <button
                      onClick={handleTogglePlayAudio}
                      className="w-14 h-14 shrink-0 rounded-full bg-hf-lime text-hf-ink flex items-center justify-center transition-transform hover:scale-105"
                    >
                      {isPlayingAudio ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                    </button>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-hf-text">Synthesized Audio Track</div>
                      <div className="text-xs text-hf-muted mt-0.5 line-clamp-1">{currentResult.prompt}</div>
                    </div>
                  </div>
                  <a
                    href={currentResult.url}
                    download="puhhfield-ai-speech.mp3"
                    className="hf-btn hf-btn-soft shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Audio</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Empty state: How it works */}
          {!isGenerating && !currentResult && (
            <div className="flex-1 flex flex-col justify-center py-10">
              <h1 className="hf-display text-[32px] leading-10 sm:text-[40px] sm:leading-[48px] text-hf-text">
                Create AI {headingWord}
              </h1>
              <p className="text-sm text-hf-muted mt-2">
                with PuhhfieldAi opensource solution
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-8">
                {steps.map((step, i) => (
                  <div key={step.title}>
                    <div className="relative aspect-[4/3] rounded-2xl bg-hf-panel overflow-hidden">
                      {renderStepVisual(i)}
                    </div>
                    <p className="hf-display text-base leading-6 text-hf-text mt-4">{step.title}</p>
                    <p className="text-sm text-hf-muted mt-1">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
