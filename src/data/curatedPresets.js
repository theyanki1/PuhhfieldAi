// Curated presets for PuhhfieldAi (Camera movements, Styles, Aspect Ratios, Showcase)

export const CAMERA_PRESETS = [
  {
    id: 'dolly-in',
    name: 'Dolly In',
    category: 'Depth',
    description: 'Smooth optical push forward towards subject',
    icon: 'ZoomIn',
    tag: 'dolly in'
  },
  {
    id: 'dolly-out',
    name: 'Dolly Out',
    category: 'Depth',
    description: 'Cinematic pull-back revealing surrounding scale',
    icon: 'ZoomOut',
    tag: 'dolly out'
  },
  {
    id: 'pan-left',
    name: 'Pan Left',
    category: 'Horizontal',
    description: 'Horizontal rotation left tracking motion',
    icon: 'ArrowLeft',
    tag: 'pan left'
  },
  {
    id: 'pan-right',
    name: 'Pan Right',
    category: 'Horizontal',
    description: 'Smooth sweeping horizontal motion to the right',
    icon: 'ArrowRight',
    tag: 'pan right'
  },
  {
    id: 'tilt-up',
    name: 'Tilt Up',
    category: 'Vertical',
    description: 'Majestic vertical tilt rising up towards the sky',
    icon: 'ArrowUp',
    tag: 'tilt up'
  },
  {
    id: 'tilt-down',
    name: 'Tilt Down',
    category: 'Vertical',
    description: 'Vertical tilt descending from above',
    icon: 'ArrowDown',
    tag: 'tilt down'
  },
  {
    id: 'fpv-drone',
    name: 'FPV Drone',
    category: 'Dynamic',
    description: 'High-speed kinetic aerial flight through space',
    icon: 'Plane',
    tag: 'fast FPV drone shot'
  },
  {
    id: 'orbit-360',
    name: '360 Orbit',
    category: 'Dynamic',
    description: 'Continuous circular orbit around focal subject',
    icon: 'RotateCw',
    tag: '360 degree orbit'
  },
  {
    id: 'crash-zoom',
    name: 'Crash Zoom',
    category: 'Dramatic',
    description: 'High-impact sudden snap zoom on key expression',
    icon: 'Focus',
    tag: 'dramatic crash zoom'
  },
  {
    id: 'bullet-time',
    name: 'Bullet Time',
    category: 'Dramatic',
    description: 'Slow motion temporal freeze with orbiting camera',
    icon: 'Clock',
    tag: 'bullet time slow motion'
  },
  {
    id: 'static-locked',
    name: 'Locked Tripod',
    category: 'Stabilized',
    description: 'Completely stationary tripod lock for subtle action',
    icon: 'Video',
    tag: 'locked tripod static shot'
  }
];

export const STYLE_PRESETS = [
  {
    id: 'cinematic-film',
    name: 'Cinematic 35mm',
    badge: 'Popular',
    promptSnippet: 'shot on 35mm film, ARRI Alexa Mini, shallow depth of field, anamorphic lens flare, natural soft lighting',
    previewColor: '#9333EA'
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    badge: 'Vibrant',
    promptSnippet: 'cyberpunk aesthetic, rainy neon reflection, holographic reflections, moody volumetric teal and magenta lighting',
    previewColor: '#06B6D4'
  },
  {
    id: 'dark-fantasy',
    name: 'Dark Fantasy',
    badge: 'Epic',
    promptSnippet: 'dark fantasy mood, atmospheric volumetric fog, medieval textures, torchlight rim lighting, epic scale',
    previewColor: '#F59E0B'
  },
  {
    id: 'vintage-90s',
    name: '90s Film Grain',
    badge: 'Retro',
    promptSnippet: 'vintage 90s aesthetic, nostalgic film grain, warm Kodak Portra color tones, nostalgic lens bloom',
    previewColor: '#EC4899'
  },
  {
    id: 'anime-cinematic',
    name: 'Anime Cinematic',
    badge: 'Stylized',
    promptSnippet: 'Makoto Shinkai style, breathtaking celestial sky, painted cloud volume, vibrant saturated lighting, anime masterpiece',
    previewColor: '#3B82F6'
  },
  {
    id: 'commercial-luxury',
    name: 'Luxury Editorial',
    badge: 'High Fashion',
    promptSnippet: 'high-end Vogue commercial, studio softbox rim lighting, hyper-sharp fabric texture, minimalist aesthetic',
    previewColor: '#10B981'
  }
];

export const ASPECT_RATIOS = [
  { id: '16:9', label: '16:9', desc: 'Landscape / Cinema (1280x720)', width: 16, height: 9, sizeWan: '1280*720' },
  { id: '9:16', label: '9:16', desc: 'Portrait / TikTok / Reels (720x1280)', width: 9, height: 16, sizeWan: '720*1280' },
  { id: '1:1', label: '1:1', desc: 'Square / Feed (960x960)', width: 1, height: 1, sizeWan: '960*960' },
  { id: '4:3', label: '4:3', desc: 'Standard Film (832x480)', width: 4, height: 3, sizeWan: '832*480' }
];
