import React, { useState } from 'react';
import { Volume2, Play, Pause, Download, Sparkles, Key } from 'lucide-react';
import { generateAudio, alibabaConfig, generationStorage, ALIBABA_AUDIO_MODELS } from '../services/alibabaApi';

const VOICES = [
  { id: 'longxiaochun', name: 'Longxiaochun', desc: 'Warm natural female voice' },
  { id: 'longwan', name: 'Longwan', desc: 'Crisp broadcast female voice' },
  { id: 'longcheng', name: 'Longcheng', desc: 'Authoritative male narrator' },
  { id: 'longhua', name: 'Longhua', desc: 'Energetic young male voice' }
];

export function AudioStudio({ onOpenSettings, initialModel, onModelChange }) {
  const hasKey = alibabaConfig.hasValidKey();
  const modelRoles = alibabaConfig.getModelRoles();
  const [model, setModel] = useState(initialModel || modelRoles.audio || 'cosyvoice-v1');

  React.useEffect(() => {
    if (initialModel) setModel(initialModel);
  }, [initialModel]);

  const [text, setText] = useState('Welcome to PuhhfieldAi. Ultra-realistic audio and speech generated directly with Alibaba Cloud models.');
  const [voice, setVoice] = useState('longxiaochun');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const res = await generateAudio({
        model,
        prompt: text,
        voice
      });
      setCurrentAudio(res);
      generationStorage.save(res);
    } catch (err) {
      setErrorMessage(err.message || 'Audio synthesis failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayToggle = () => {
    if (!currentAudio?.url) return;
    if (isPlaying) {
      audioElement?.pause();
      setIsPlaying(false);
    } else {
      const audio = audioElement || new Audio(currentAudio.url);
      if (!audioElement) {
        setAudioElement(audio);
        audio.onended = () => setIsPlaying(false);
      }
      audio.play();
      setIsPlaying(true);
    }
  };

  // When no API key is configured, hide all models and show empty state
  if (!hasKey) {
    return (
      <div className="w-full flex flex-col items-center justify-center pt-16 pb-24 px-4">
        <div className="text-center mb-8 max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white mb-2">
            Audio Studio
          </h1>
          <p className="text-sm text-zinc-400">
            Expressive neural voice & audio synthesis powered by Alibaba CosyVoice & Sambert.
          </p>
        </div>

        <div className="w-full max-w-xl mx-auto p-8 rounded-3xl border border-white/[0.08] bg-[#121316] text-center flex flex-col items-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-4 text-cyan-400">
            <Key className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white font-display">Connect AI Provider to Start Generating</h2>
          <p className="text-sm text-zinc-400 mt-2 max-w-md leading-relaxed">
            Import your Alibaba Cloud Model Studio API key in AI Models to unlock CosyVoice and Sambert neural speech models.
          </p>
          <button
            onClick={onOpenSettings}
            className="mt-6 px-6 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black text-sm font-bold transition-all shadow-lg shadow-cyan-950/20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>Import AI Provider API Key</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center mb-8 max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white mb-2">
          Audio Studio
        </h1>
        <p className="text-sm text-zinc-400">
          Expressive neural voice & audio synthesis powered by Alibaba CosyVoice & Sambert.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border border-white/[0.08] bg-[#121316] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-white">Speech Synthesis</span>
              </div>
              <select
                value={model}
                onChange={(e) => {
                  setModel(e.target.value);
                  onModelChange?.(e.target.value);
                }}
                className="bg-[#18191e] border border-white/[0.08] text-white text-xs rounded-xl px-3 py-1.5 focus:border-cyan-400/50 focus:outline-none font-medium"
              >
                {ALIBABA_AUDIO_MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.badge})</option>
                ))}
              </select>
            </div>

            {/* Prompt Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Speech Script / Prompt</label>
              <textarea
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to speak..."
                className="w-full bg-[#18191e] border border-white/[0.06] rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-cyan-400/50 resize-none leading-relaxed"
              />
            </div>

            {/* Voice Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Voice</label>
              <div className="grid grid-cols-2 gap-2">
                {VOICES.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVoice(v.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      voice === v.id
                        ? 'border-cyan-500/40 bg-cyan-950/20 text-white'
                        : 'border-white/[0.05] bg-[#18191e] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-xs font-semibold">{v.name}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{v.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Action */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !text.trim()}
              className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-950/30 flex items-center justify-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing...' : 'Generate Speech'}</span>
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-white/[0.08] bg-[#121316] p-6 shadow-2xl min-h-[380px] flex flex-col items-center justify-center text-center">
            {currentAudio ? (
              <div className="space-y-4 w-full">
                <div className="w-16 h-16 rounded-full bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400">
                  <Volume2 className="w-8 h-8" />
                </div>
                <div className="text-sm font-semibold text-white">Audio Ready</div>
                <div className="text-xs text-zinc-400 font-mono">{voice} · {model}</div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handlePlayToggle}
                    className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold flex items-center gap-2 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-black" />}
                    <span>{isPlaying ? 'Pause' : 'Play Audio'}</span>
                  </button>
                  <a
                    href={currentAudio.url}
                    download="puhhfield-speech.mp3"
                    className="p-2.5 rounded-xl bg-[#18191e] border border-white/[0.08] hover:bg-white/10 text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-w-xs text-center">
                <Volume2 className="w-10 h-10 text-zinc-600 mx-auto" />
                <div className="text-sm font-semibold text-zinc-300">Generated audio will appear here</div>
                <div className="text-xs text-zinc-500 leading-relaxed">
                  Enter your speech text on the left and select voice.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
