import React from 'react';
import { alibabaConfig } from './alibabaApi';

// Storage keys for AI Providers
const PROVIDERS_STORAGE_KEY = 'dicksfield_ai_providers_keys';

// ─── Provider Brand Logos (Authentic vector SVGs) ───────────────────────────
export const ProviderLogos = {
  google: ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  ),
  openai: ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M22.28 9.5a5.77 5.77 0 0 0-.48-4.66 5.86 5.86 0 0 0-5.87-2.82A5.78 5.78 0 0 0 11.45.6a5.86 5.86 0 0 0-5.46 3.73 5.79 5.79 0 0 0-4.04 2.92 5.86 5.86 0 0 0 .73 6.44 5.78 5.78 0 0 0 .48 4.66 5.86 5.86 0 0 0 5.87 2.82 5.78 5.78 0 0 0 4.48 1.42 5.86 5.86 0 0 0 5.46-3.73 5.78 5.78 0 0 0 4.04-2.92 5.86 5.86 0 0 0-.73-6.44zM12.78 21.9a4.34 4.34 0 0 1-2.61-.87l.13-.08 4.34-2.51a.78.78 0 0 0 .39-.68v-6.13l1.84 1.06v5.86a4.37 4.37 0 0 1-4.09 3.35zm-8.83-4.2a4.33 4.33 0 0 1-.5-2.73l.13.08 4.34 2.51a.79.79 0 0 0 .78 0l5.31-3.07v2.13L8.7 19.34a4.37 4.37 0 0 1-4.75-1.64zm-1.57-9.5a4.34 4.34 0 0 1 2.1-1.87v5.18a.78.78 0 0 0 .39.68l5.31 3.07-1.84 1.06-5.07-2.93a4.37 4.37 0 0 1-.89-5.18zm14.17 3.51-5.31-3.07 1.84-1.06 5.07 2.93a4.37 4.37 0 0 1 .89 5.18 4.34 4.34 0 0 1-2.1 1.87v-5.18a.78.78 0 0 0-.39-.68zm2.63-2.62-.13-.08-4.34-2.51a.79.79 0 0 0-.78 0l-5.31 3.07V7.44l5.31-3.07a4.37 4.37 0 0 1 4.75 1.64 4.34 4.34 0 0 1 .5 2.73zM10.15 12 12 10.93 13.85 12v2.14L12 15.21 10.15 14.14V12z"/>
    </svg>
  ),
  bytedance: ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect x="2" y="8" width="4" height="12" rx="2" fill="#3B82F6"/>
      <rect x="7.5" y="4" width="4" height="16" rx="2" fill="#06B6D4"/>
      <rect x="13" y="10" width="4" height="10" rx="2" fill="#3B82F6"/>
      <rect x="18.5" y="6" width="4" height="14" rx="2" fill="#06B6D4"/>
    </svg>
  ),
  kuaishou: ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect x="2" y="3" width="20" height="14" rx="5" fill="#FF5000" />
      <path d="M10 7L16 10L10 13V7Z" fill="white" />
      <path d="M7 19C7 17.9 7.9 17 9 17H15C16.1 17 17 17.9 17 19C17 20.1 16.1 21 15 21H9C7.9 21 7 20.1 7 19Z" fill="#FF7900"/>
    </svg>
  ),
  minimax: ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M3 16V8L9 12L3 16Z" fill="#8B5CF6"/>
      <path d="M11 19V5L17 9.5V14.5L11 19Z" fill="#A855F7"/>
      <path d="M19 16V8L22 10V14L19 16Z" fill="#D8B4FE"/>
    </svg>
  ),
  alibaba: ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#FF6A00"/>
      <path d="M7.5 12C7.5 9.5 9.5 7.5 12 7.5C14.5 7.5 16.5 9.5 16.5 12C16.5 14.5 14.5 16.5 12 16.5C10.2 16.5 8.7 15.4 8 13.8L9.8 13C10.2 14 11 14.7 12 14.7C13.5 14.7 14.7 13.5 14.7 12C14.7 10.5 13.5 9.3 12 9.3C10.8 9.3 9.8 10.1 9.4 11.2L7.5 12Z" fill="white"/>
      <circle cx="12" cy="12" r="2" fill="white"/>
    </svg>
  ),
  xai: ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  lightricks: ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 2L2 12L12 22L22 12L12 2Z" fill="url(#ltxGrad)" />
      <path d="M12 6L6 12L12 18L18 12L12 6Z" fill="#0F1015" />
      <defs>
        <linearGradient id="ltxGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F43F5E"/>
          <stop offset="1" stopColor="#8B5CF6"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  pixverse: ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect x="3" y="3" width="18" height="18" rx="6" fill="#6366F1"/>
      <path d="M9 8L16 12L9 16V8Z" fill="#A5F3FC"/>
      <circle cx="16" cy="8" r="1.5" fill="#F43F5E"/>
    </svg>
  ),
  bfl: ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 2L2 22H22L12 2Z" fill="#18181B" stroke="#CCFF00" strokeWidth="2"/>
      <path d="M12 7L6 19H18L12 7Z" fill="#CCFF00"/>
    </svg>
  ),
  ideogram: ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="12" cy="12" r="9" stroke="#E11D48" strokeWidth="2.5" />
      <path d="M12 7V17M7 12H17" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" fill="#E11D48" />
    </svg>
  ),
  recraft: ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect x="3" y="3" width="18" height="18" rx="4" fill="#0284C7"/>
      <path d="M8 7H13C14.7 7 16 8.3 16 10C16 11.7 14.7 13 13 13H8V7Z" fill="white"/>
      <path d="M12.5 13L16 18H13L10 13H8V18H6V7H13C15.2 7 17 8.8 17 11C17 12.8 15.8 14.3 14.2 14.8L17.5 19.5H14.5L12 15H8" fill="white"/>
    </svg>
  ),
  elevenlabs: ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <rect x="7" y="4" width="3.5" height="16" rx="1.75"/>
      <rect x="13.5" y="4" width="3.5" height="16" rx="1.75"/>
    </svg>
  ),
  microsoft: ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect x="2" y="2" width="9.5" height="9.5" fill="#F25022"/>
      <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7FBA00"/>
      <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF"/>
      <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900"/>
    </svg>
  )
};

// ─── 14 AI Providers Registry (Strictly per user requirements) ──────────────
export const AI_PROVIDERS = [
  {
    id: 'alibaba',
    name: 'Alibaba',
    apiName: 'Wan / DashScope API',
    logoKey: 'alibaba',
    accentColor: '#FF6A00',
    description: 'Flagship open weights & cloud video, image and voice generation with precise keyframe motion.',
    docsUrl: 'https://help.aliyun.com/document_detail/2712534.html',
    defaultKeyPlaceholder: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    models: [
      {
        id: 'wan-2.7',
        name: 'Wan 2.7',
        category: 'video',
        badge: 'TOP',
        desc: 'video s kontrolou prvního a posledního snímku',
        providerName: 'Alibaba'
      },
      {
        id: 'wan2.1-t2v-plus',
        name: 'Wan 2.1 Video Plus',
        category: 'video',
        badge: 'TOP',
        desc: 'Flagship 720p cinematic text-to-video with ultra-fluid physics',
        providerName: 'Alibaba'
      },
      {
        id: 'wan2.1-t2v-turbo',
        name: 'Wan 2.1 Video Turbo',
        category: 'video',
        badge: 'FAST',
        desc: 'Fast dynamic video generation for rapid iteration',
        providerName: 'Alibaba'
      },
      {
        id: 'wan2.1-i2v-plus',
        name: 'Wan 2.1 Image-to-Video Plus',
        category: 'video',
        badge: 'NEW',
        desc: 'Animate any character or scene image into cinematic video',
        providerName: 'Alibaba'
      },
      {
        id: 'wan2.1-i2v-turbo',
        name: 'Wan 2.1 I2V Turbo',
        category: 'video',
        badge: 'FAST',
        desc: 'Fast image animation with fluid continuity',
        providerName: 'Alibaba'
      },
      {
        id: 'wanx2.1-t2i-plus',
        name: 'Wanx 2.1 Image Plus',
        category: 'image',
        badge: 'TOP',
        desc: 'Photorealistic text-to-image synthesis with studio lighting',
        providerName: 'Alibaba'
      },
      {
        id: 'wanx2.1-t2i-turbo',
        name: 'Wanx 2.1 Image Turbo',
        category: 'image',
        badge: 'FAST',
        desc: 'Ultra-fast concept rendering and keyframe creation',
        providerName: 'Alibaba'
      },
      {
        id: 'cosyvoice-v1',
        name: 'CosyVoice v1 Neural Speech',
        category: 'audio',
        badge: 'TOP',
        desc: 'Studio-grade natural intonation voice synthesis',
        providerName: 'Alibaba'
      },
      {
        id: 'cosyvoice-2',
        name: 'CosyVoice 2 Next-Gen',
        category: 'audio',
        badge: 'NEW',
        desc: 'Next-gen neural speech with emotional depth and pacing',
        providerName: 'Alibaba'
      }
    ]
  },
  {
    id: 'google',
    name: 'Google',
    apiName: 'Gemini / Vertex AI API',
    logoKey: 'google',
    accentColor: '#4285F4',
    description: 'Ultra-photorealistic cinematic video and next-gen multimodal flagship image generation.',
    docsUrl: 'https://cloud.google.com/vertex-ai',
    defaultKeyPlaceholder: 'AIzaSy...',
    models: [
      {
        id: 'veo-3.1',
        name: 'Veo 3.1',
        category: 'video',
        badge: 'TOP',
        desc: 'video - ultra-photorealistic 4K cinematic generation with director controls',
        providerName: 'Google'
      },
      {
        id: 'gemini-omni-flash',
        name: 'Gemini Omni Flash',
        category: 'video',
        badge: 'FAST',
        desc: 'video - high-speed multimodal reasoning & video generation',
        providerName: 'Google'
      },
      {
        id: 'nano-banana-2',
        name: 'Nano Banana 2',
        category: 'image',
        badge: 'NEW',
        desc: 'obrázky - Google next-gen flagship image model',
        providerName: 'Google'
      },
      {
        id: 'nano-banana-pro',
        name: 'Nano Banana Pro',
        category: 'image',
        badge: 'TOP',
        desc: 'obrázky - Best 4K photorealistic image model ever',
        providerName: 'Google'
      }
    ]
  },
  {
    id: 'openai',
    name: 'OpenAI',
    apiName: 'OpenAI API',
    logoKey: 'openai',
    accentColor: '#10A37F',
    description: 'State-of-the-art physical world simulation video and high-precision visual generation.',
    docsUrl: 'https://platform.openai.com',
    defaultKeyPlaceholder: 'sk-proj-...',
    models: [
      {
        id: 'sora-2',
        name: 'Sora 2',
        category: 'video',
        badge: 'TOP',
        desc: 'video - Flagship physical simulation cinematic video generator',
        providerName: 'OpenAI'
      },
      {
        id: 'gpt-image-2.0',
        name: 'GPT Image 2.0',
        category: 'image',
        badge: 'TOP',
        desc: 'obrázky - Exceptional quality, crisp text and precise conceptual edits',
        providerName: 'OpenAI'
      }
    ]
  },
  {
    id: 'bytedance',
    name: 'ByteDance',
    apiName: 'BytePlus / Seed API',
    logoKey: 'bytedance',
    accentColor: '#00F2FE',
    description: 'High-framerate dynamic video synthesis, visual reasoning, and soundscape studio.',
    docsUrl: 'https://www.byteplus.com',
    defaultKeyPlaceholder: 'bp-api-key-...',
    models: [
      {
        id: 'seedance-2.5',
        name: 'Seedance 2.5',
        category: 'video',
        badge: 'TOP',
        desc: 'video - High-frame-rate realistic camera and human motion synthesis',
        providerName: 'ByteDance'
      },
      {
        id: 'seedance-2.0',
        name: 'Seedance 2.0',
        category: 'video',
        badge: 'FAST',
        desc: 'video - Smooth fluid motion generative cinematic video',
        providerName: 'ByteDance'
      },
      {
        id: 'seedream-5.0-pro',
        name: 'Seedream 5.0 Pro',
        category: 'image',
        badge: 'TOP',
        desc: 'obrázky - Logically consistent images with intelligent visual reasoning',
        providerName: 'ByteDance'
      },
      {
        id: 'seedream-4.5',
        name: 'Seedream 4.5',
        category: 'image',
        badge: 'NEW',
        desc: 'obrázky - Fast concept design and high-fidelity rendering',
        providerName: 'ByteDance'
      },
      {
        id: 'seed-audio-1.0',
        name: 'Seed Audio 1.0',
        category: 'audio',
        badge: 'NEW',
        desc: 'zvukové scény, hudba a dialogy',
        providerName: 'ByteDance'
      },
      {
        id: 'seed-speech',
        name: 'Seed Speech',
        category: 'audio',
        badge: 'TOP',
        desc: 'vícejazyčný hlas a dabing s přirozenou intonací',
        providerName: 'ByteDance'
      }
    ]
  },
  {
    id: 'kuaishou',
    name: 'Kuaishou',
    apiName: 'Kling AI API',
    logoKey: 'kuaishou',
    accentColor: '#FF5000',
    description: 'World-renowned dynamic video engine with native audio synthesis and motion trajectory control.',
    docsUrl: 'https://klingai.com',
    defaultKeyPlaceholder: 'kling-api-key-...',
    models: [
      {
        id: 'kling-3.0',
        name: 'Kling 3.0',
        category: 'video',
        badge: 'TOP',
        desc: 'video a nativní audio s filmovou kompozicí',
        providerName: 'Kuaishou'
      },
      {
        id: 'kling-motion-control',
        name: 'Kling Motion Control',
        category: 'video',
        badge: 'NEW',
        desc: 'video a nativní audio s přesnou kontrolou trajektorie kamery a pohybu',
        providerName: 'Kuaishou'
      }
    ]
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    apiName: 'Hailuo AI API',
    logoKey: 'minimax',
    accentColor: '#A855F7',
    description: 'High-emotion character expressions in cinematic video and pristine studio narration.',
    docsUrl: 'https://www.minimax.io',
    defaultKeyPlaceholder: 'mm-key-...',
    models: [
      {
        id: 'minimax-hailuo',
        name: 'MiniMax Hailuo',
        category: 'video',
        badge: 'TOP',
        desc: 'video - Cinematic video with rich dramatic facial acting and lighting',
        providerName: 'MiniMax'
      },
      {
        id: 'minimax-speech-2.8-hd',
        name: 'MiniMax Speech 2.8 HD',
        category: 'audio',
        badge: 'TOP',
        desc: 'studiový hlas / TTS - Pro documentary and conversational speech',
        providerName: 'MiniMax'
      }
    ]
  },
  {
    id: 'xai',
    name: 'xAI',
    apiName: 'Grok API',
    logoKey: 'xai',
    accentColor: '#FFFFFF',
    description: 'Uncensored creative vision with synchronized spatial acoustic soundscapes.',
    docsUrl: 'https://x.ai/api',
    defaultKeyPlaceholder: 'xai-...',
    models: [
      {
        id: 'grok-imagine',
        name: 'Grok Imagine',
        category: 'video',
        badge: 'NEW',
        desc: 'video se synchronizovaným zvukem a dynamickou akcí',
        providerName: 'xAI'
      }
    ]
  },
  {
    id: 'lightricks',
    name: 'Lightricks',
    apiName: 'LTX API',
    logoKey: 'lightricks',
    accentColor: '#F43F5E',
    description: 'Real-time ultra-fast generative video architecture with embedded native audio.',
    docsUrl: 'https://lightricks.com/ltx',
    defaultKeyPlaceholder: 'ltx-token-...',
    models: [
      {
        id: 'ltx-video',
        name: 'LTX',
        category: 'video',
        badge: 'FAST',
        desc: 'video s nativním audiem a sub-sekundovou generací',
        providerName: 'Lightricks'
      }
    ]
  },
  {
    id: 'pixverse',
    name: 'PixVerse',
    apiName: 'PixVerse API',
    logoKey: 'pixverse',
    accentColor: '#6366F1',
    description: 'Subject-consistent video animation with native multi-track cinematic sound.',
    docsUrl: 'https://pixverse.ai',
    defaultKeyPlaceholder: 'pv-api-key-...',
    models: [
      {
        id: 'pixverse-v3',
        name: 'PixVerse',
        category: 'video',
        badge: 'TOP',
        desc: 'video s nativním audiem a konzistencí postav',
        providerName: 'PixVerse'
      }
    ]
  },
  {
    id: 'bfl',
    name: 'Black Forest Labs',
    apiName: 'BFL API',
    logoKey: 'bfl',
    accentColor: '#CCFF00',
    description: 'The global standard for open diffusion visual synthesis and prompt adherence.',
    docsUrl: 'https://blackforestlabs.ai',
    defaultKeyPlaceholder: 'bfl_key_...',
    models: [
      {
        id: 'flux-1-pro',
        name: 'FLUX',
        category: 'image',
        badge: 'TOP',
        desc: 'obrázky - State-of-the-art photorealism, typography and anatomy',
        providerName: 'Black Forest Labs'
      }
    ]
  },
  {
    id: 'ideogram',
    name: 'Ideogram',
    apiName: 'Ideogram API',
    logoKey: 'ideogram',
    accentColor: '#E11D48',
    description: 'Unrivaled typography, graphic design compositions, and poster art generation.',
    docsUrl: 'https://ideogram.ai',
    defaultKeyPlaceholder: 'ideo-api-...',
    models: [
      {
        id: 'ideogram-4.5',
        name: 'Ideogram 4.5',
        category: 'image',
        badge: 'TOP',
        desc: 'obrázky a typografie s bezchybným textovým vykreslením',
        providerName: 'Ideogram'
      }
    ]
  },
  {
    id: 'recraft',
    name: 'Recraft',
    apiName: 'Recraft API',
    logoKey: 'recraft',
    accentColor: '#0284C7',
    description: 'Professional vector illustrations, 3D icons, and brand graphics generation.',
    docsUrl: 'https://recraft.ai',
    defaultKeyPlaceholder: 'rc-token-...',
    models: [
      {
        id: 'recraft-v4.1',
        name: 'Recraft',
        category: 'image',
        badge: 'NEW',
        desc: 'rastrové a vektorové obrázky v nekonečném rozlišení',
        providerName: 'Recraft'
      }
    ]
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    apiName: 'ElevenLabs API',
    logoKey: 'elevenlabs',
    accentColor: '#FFFFFF',
    description: 'Industry-leading voice cloning, dramatic control, and multilingual studio speech.',
    docsUrl: 'https://elevenlabs.io',
    defaultKeyPlaceholder: 'xi-api-key-...',
    models: [
      {
        id: 'eleven-v3',
        name: 'Eleven v3',
        category: 'audio',
        badge: 'TOP',
        desc: 'expresivní hlas, klonování a kontrola emocí pro filmové projekty',
        providerName: 'ElevenLabs'
      }
    ]
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    apiName: 'VibeVoice API',
    logoKey: 'microsoft',
    accentColor: '#00A4EF',
    description: 'Extended conversational speech synthesis tailored for audiobooks and episodic podcasts.',
    docsUrl: 'https://azure.microsoft.com',
    defaultKeyPlaceholder: 'ms-azure-speech-key-...',
    models: [
      {
        id: 'vibevoice',
        name: 'VibeVoice',
        category: 'audio',
        badge: 'NEW',
        desc: 'dlouhá hlasová syntéza pro podcasty a audioknihy s minimální únavou poslechu',
        providerName: 'Microsoft'
      }
    ]
  }
];

// ─── Provider Key Storage & Status Helpers ──────────────────────────────────
export const providersStorage = {
  getAllKeys: () => {
    try {
      const stored = localStorage.getItem(PROVIDERS_STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : {};
      // Sync Alibaba key from alibabaConfig if present
      const alibabaKey = alibabaConfig.getApiKey();
      if (alibabaKey && !parsed.alibaba) {
        parsed.alibaba = alibabaKey;
      }
      return parsed;
    } catch {
      return {};
    }
  },

  getKey: (providerId) => {
    if (providerId === 'alibaba') {
      const fromAlibaba = alibabaConfig.getApiKey();
      if (fromAlibaba) return fromAlibaba;
    }
    const all = providersStorage.getAllKeys();
    return all[providerId] || '';
  },

  setKey: (providerId, key) => {
    const all = providersStorage.getAllKeys();
    const cleanKey = (key || '').trim();
    if (cleanKey) {
      all[providerId] = cleanKey;
    } else {
      delete all[providerId];
    }
    localStorage.setItem(PROVIDERS_STORAGE_KEY, JSON.stringify(all));

    // Keep Alibaba in sync
    if (providerId === 'alibaba') {
      alibabaConfig.setApiKey(cleanKey);
    }
  },

  hasKey: (providerId) => {
    const key = providersStorage.getKey(providerId);
    return Boolean(key && key.length >= 6);
  },

  getConnectedProviders: () => {
    return AI_PROVIDERS.filter(p => providersStorage.hasKey(p.id));
  },

  // Returns all models in a category from CONNECTED providers only
  getConnectedModelsByCategory: (category) => {
    const connectedProviders = providersStorage.getConnectedProviders();
    const list = [];
    for (const p of connectedProviders) {
      const match = p.models.filter(m => m.category === category);
      list.push(...match);
    }
    return list;
  },

  // Returns all models in a category across all providers, annotated with isConnected
  getAllModelsByCategory: (category) => {
    const list = [];
    for (const p of AI_PROVIDERS) {
      const isConnected = providersStorage.hasKey(p.id);
      for (const m of p.models) {
        if (m.category === category) {
          list.push({ ...m, isConnected, providerId: p.id, logoKey: p.logoKey });
        }
      }
    }
    return list;
  }
};
