// Alibaba Cloud Model Studio (DashScope) Frontend Service
// Handles storage of keys, API requests, task polling, and prompt enhancement

const STORAGE_KEYS = {
  API_KEY: 'dicksfield_dashscope_api_key',
  REGION: 'dicksfield_dashscope_region',
  CUSTOM_URL: 'dicksfield_dashscope_custom_url',
  DEMO_MODE: 'dicksfield_demo_mode',
  GENERATIONS: 'dicksfield_generations',
  CONFIGURED_MODELS: 'dicksfield_configured_models'
};

export const DEFAULT_MODEL_ROLES = {
  auto: 'qwen3.8-omni-flash',
  fast: 'qwen3.8-omni-flash',
  reasoning: 'qwen3.8-omni-flash',
  longContext: 'qwen3.8-omni-flash',
  video: 'wan2.1-t2v-plus',
  videoFast: 'wan2.1-t2v-turbo',
  videoI2v: 'wan2.1-i2v-plus',
  image: 'wan2.2-t2i-plus',
  imageRetry: 'wan2.2-t2i-flash',
  audio: 'cosyvoice-v1'
};

export const ALIBABA_VIDEO_MODELS = [
  { id: 'wan3.0-video', name: 'Wan 3.0 Video Next-Gen', badge: 'Wan 3.0', desc: 'Next-generation Alibaba video synthesis architecture' },
  { id: 'wan2.1-t2v-plus', name: 'Wan 2.1 Video Plus (720p)', badge: 'Flagship 720p', desc: 'High-fidelity cinematic text-to-video with ultra-rich motion' },
  { id: 'wan2.1-t2v-turbo', name: 'Wan 2.1 Video Turbo', badge: 'Fast Dynamic', desc: 'Fast-rendering cinematic video generation for rapid iteration' },
  { id: 'wan2.1-i2v-plus', name: 'Wan 2.1 Image-to-Video Plus', badge: 'Animate', desc: 'Animate any character, portrait or scene image into cinematic video' },
  { id: 'wan2.1-i2v-turbo', name: 'Wan 2.1 Image-to-Video Turbo', badge: 'Fast Animate', desc: 'Fast image animation with fluid physics and lighting continuity' },
  { id: 'wanx2.1-i2v', name: 'Wanx 2.1 Image-to-Video', badge: 'Motion', desc: 'High-res image animation model' },
  { id: 'video-synthesis-v1', name: 'DashScope Video Synthesis v1', badge: 'Standard', desc: 'General video generation' }
];

export const ALIBABA_IMAGE_MODELS = [
  { id: 'wan2.2-t2i-plus', name: 'Wan 2.2 Image Plus', badge: 'Photoreal', desc: 'Next-gen text-to-image synthesis with photorealism and lighting' },
  { id: 'wan2.2-t2i-flash', name: 'Wan 2.2 Image Flash', badge: 'Instant', desc: 'Ultra-fast concept rendering and keyframe creation' },
  { id: 'wanx-v1', name: 'Wanx Image v1', badge: 'Classic', desc: 'Stable classic text-to-image synthesis' },
  { id: 'qwen-vl-max', name: 'Qwen-VL Max', badge: 'Vision Max', desc: 'Flagship multimodal vision-language model' },
  { id: 'qwen-vl-plus', name: 'Qwen-VL Plus', badge: 'Vision Plus', desc: 'High-speed image understanding and generation' },
  { id: 'qwen3.8-omni-flash', name: 'Qwen 3.8 Omni Flash', badge: 'Omni Flash', desc: 'High-speed reasoning and vision-language model' },
  { id: 'flux-schnell', name: 'FLUX.1 Schnell (DashScope)', badge: '1-4 Steps', desc: 'Ultra-fast high-quality generation on DashScope' },
  { id: 'flux-dev', name: 'FLUX.1 Dev (DashScope)', badge: 'Dev Quality', desc: 'High-fidelity photorealism and typography' },
  { id: 'stable-diffusion-3.5-large', name: 'SD 3.5 Large (DashScope)', badge: 'SD 3.5', desc: 'Advanced prompt adherence and typography' }
];

export const ALIBABA_AUDIO_MODELS = [
  { id: 'cosyvoice-v1', name: 'CosyVoice v1 Neural Speech', badge: 'Ultra Natural', desc: 'Studio-quality expressive text-to-speech with natural intonation' },
  { id: 'cosyvoice-2', name: 'CosyVoice 2 Next-Gen', badge: 'New Gen', desc: 'Next-gen neural speech with emotional depth and natural pacing' },
  { id: 'sambert-zhichu-v1', name: 'Sambert Zhichu (Female)', badge: 'Narrator', desc: 'Clean, articulate documentary voice' },
  { id: 'sambert-zhiming-v1', name: 'Sambert Zhiming (Male)', badge: 'Male Pro', desc: 'Authoritative deep cinematic narrator' },
  { id: 'sambert-zhixiaobai-v1', name: 'Sambert Zhixiaobai (Young)', badge: 'Casual', desc: 'Youthful conversational voice' },
  { id: 'paraformer-v1', name: 'Paraformer Speech-to-Text', badge: 'ASR', desc: 'High-accuracy automatic speech recognition' },
  { id: 'sensevoice-v1', name: 'SenseVoice Multi-Speech', badge: 'Multi-Lingual', desc: 'Multi-language voice recognition with emotion detection' }
];

export const ALIBABA_REASONING_MODELS = [
  { id: 'qwen3.8-omni-flash', name: 'Qwen 3.8 Omni Flash', badge: 'Omni Flash', desc: 'High-speed reasoning and vision-language model' },
  { id: 'qwen-max', name: 'Qwen Max Flagship', badge: 'Director', desc: 'Deep reasoning, scriptwriting, and cinema prompt expansion' },
  { id: 'qwen-max-longcontext', name: 'Qwen Max 128k', badge: '128k Context', desc: 'Massive context for full screenplays and multi-shot storyboards' },
  { id: 'qwen-plus', name: 'Qwen Plus', badge: 'Balanced', desc: 'Fast, intelligent prompt director enhancement' },
  { id: 'qwen-turbo', name: 'Qwen Turbo', badge: 'Ultra Fast', desc: 'Sub-second lightweight prompt enhancement' },
  { id: 'deepseek-r1', name: 'DeepSeek R1 (ModelStudio)', badge: 'Reasoning R1', desc: 'Deep chain-of-thought mathematical and creative reasoning' },
  { id: 'deepseek-v3', name: 'DeepSeek V3 (ModelStudio)', badge: 'V3 671B', desc: 'State-of-the-art open weights architecture' }
];

export function getShortModelBadge(modelId, fallback = 'Wan 2.1') {
  if (!modelId) return fallback;
  const lower = modelId.toLowerCase();
  if (lower.includes('wan3') || lower.includes('wan-3') || lower.includes('3.0')) return 'Wan 3.0';
  if (lower.includes('wan2.7')) return 'Wan 2.7';
  if (lower.includes('wan2.2')) return 'Wan 2.2';
  if (lower.includes('wan2') || lower.includes('wan-2') || lower.includes('2.1')) return 'Wan 2.1';
  if (lower.includes('wanx2') || lower.includes('wanx-2')) return 'Wanx 2.1';
  if (lower.includes('wanx')) return 'Wanx';
  if (lower.includes('cosy')) return 'CosyVoice';
  if (lower.includes('qwen')) return 'Qwen';
  if (lower.includes('flux')) return 'FLUX';
  if (lower.includes('sambert')) return 'Sambert';
  if (lower.includes('deepseek')) return 'DeepSeek';
  return 'Wan 2.1';
}

export const ALIBABA_MODELS = [
  ...ALIBABA_VIDEO_MODELS.map(m => ({ ...m, category: 'video' })),
  ...ALIBABA_IMAGE_MODELS.map(m => ({ ...m, category: 'image' })),
  ...ALIBABA_AUDIO_MODELS.map(m => ({ ...m, category: 'audio' })),
  ...ALIBABA_REASONING_MODELS.map(m => ({ ...m, category: 'reasoning' }))
];

// Helper to get headers
function getHeaders() {
  const apiKey = localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
  const region = localStorage.getItem(STORAGE_KEYS.REGION) || 'intl';
  const customUrl = localStorage.getItem(STORAGE_KEYS.CUSTOM_URL) || '';

  return {
    'Content-Type': 'application/json',
    'x-dashscope-api-key': apiKey,
    'x-dashscope-region': region,
    'x-dashscope-custom-url': customUrl
  };
}

export const alibabaConfig = {
  getApiKey: () => localStorage.getItem(STORAGE_KEYS.API_KEY) || '',
  setApiKey: (key) => localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim()),
  getRegion: () => localStorage.getItem(STORAGE_KEYS.REGION) || 'intl',
  setRegion: (region) => localStorage.setItem(STORAGE_KEYS.REGION, region),
  getCustomUrl: () => localStorage.getItem(STORAGE_KEYS.CUSTOM_URL) || '',
  setCustomUrl: (url) => localStorage.setItem(STORAGE_KEYS.CUSTOM_URL, url.trim()),
  isDemoMode: () => localStorage.getItem(STORAGE_KEYS.DEMO_MODE) === 'true',
  setDemoMode: (val) => localStorage.setItem(STORAGE_KEYS.DEMO_MODE, val ? 'true' : 'false'),
  hasValidKey: () => {
    const key = localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
    return key.length >= 8;
  },
  getModelRoles: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONFIGURED_MODELS);
      if (!stored) return { ...DEFAULT_MODEL_ROLES };
      const parsed = JSON.parse(stored);
      const validVideoIds = ALIBABA_VIDEO_MODELS.map(m => m.id);
      const validImageIds = ALIBABA_IMAGE_MODELS.map(m => m.id);
      const validAudioIds = ALIBABA_AUDIO_MODELS.map(m => m.id);

      return {
        ...DEFAULT_MODEL_ROLES,
        ...parsed,
        video: validVideoIds.includes(parsed.video) ? parsed.video : DEFAULT_MODEL_ROLES.video,
        image: validImageIds.includes(parsed.image) ? parsed.image : DEFAULT_MODEL_ROLES.image,
        audio: validAudioIds.includes(parsed.audio) ? parsed.audio : DEFAULT_MODEL_ROLES.audio
      };
    } catch {
      return { ...DEFAULT_MODEL_ROLES };
    }
  },
  setModelRoles: (roles) => {
    localStorage.setItem(STORAGE_KEYS.CONFIGURED_MODELS, JSON.stringify(roles));
  }
};

// Test Connection Live with Alibaba DashScope
export async function testAlibabaConnection() {
  const headers = getHeaders();
  const res = await fetch('/api/alibaba/test-connection', {
    method: 'POST',
    headers
  });
  return await res.json();
}

// Test specific model
export async function testModel(modelId, role = 'general') {
  const headers = getHeaders();
  const res = await fetch('/api/alibaba/test-model', {
    method: 'POST',
    headers,
    body: JSON.stringify({ model: modelId, role })
  });
  return await res.json();
}

// Generate Audio / Speech (CosyVoice / Sambert)
export async function generateAudio({
  model = 'cosyvoice-v1',
  prompt,
  voice = 'longxiaochun',
  onProgress
}) {
  const headers = getHeaders();
  onProgress?.({ status: 'SUBMITTING', progress: 20, message: 'Synthesizing voice with Alibaba CosyVoice...' });

  const res = await fetch('/api/alibaba/audio-synthesis', {
    method: 'POST',
    headers,
    body: JSON.stringify({ model, prompt, voice })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || 'Audio generation failed');
  }

  const audioUrl = data.output?.audio_url || data.output?.url || data.audioUrl;
  onProgress?.({ status: 'SUCCEEDED', progress: 100, message: 'Audio generated!' });

  return {
    id: 'audio-' + Date.now(),
    type: 'audio',
    model,
    prompt,
    voice,
    url: audioUrl,
    createdAt: new Date().toISOString()
  };
}

// Enhance Prompt with Alibaba Qwen / Director Engine
export async function enhancePrompt(prompt, options = {}) {
  const headers = getHeaders();
  const res = await fetch('/api/alibaba/enhance-prompt', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      prompt,
      style: options.style || 'cinematic',
      cameraMovement: options.cameraMovement || 'dolly-in'
    })
  });
  return await res.json();
}

// Generate Video (Wan 2.1 T2V or I2V)
export async function generateVideo({
  model = 'wan2.1-t2v-plus',
  prompt,
  negativePrompt = '',
  imageUrl = null,
  size = '1280*720',
  duration = 5,
  promptExtend = true,
  seed = null,
  onProgress
}) {
  const isDemo = alibabaConfig.isDemoMode() || !alibabaConfig.hasValidKey();

  if (isDemo) {
    return simulateGeneration({
      type: 'video',
      model,
      prompt,
      size,
      duration,
      imageUrl,
      onProgress
    });
  }

  const headers = getHeaders();
  const isI2V = model.includes('i2v');

  const inputPayload = {
    prompt
  };

  if (negativePrompt) {
    inputPayload.negative_prompt = negativePrompt;
  }

  if (isI2V && imageUrl) {
    inputPayload.img_url = imageUrl;
  }

  const parameters = {
    size,
    prompt_extend: promptExtend
  };

  if (seed !== null && seed !== undefined && seed !== '') {
    parameters.seed = Number(seed);
  }

  const requestBody = {
    model,
    input: inputPayload,
    parameters
  };

  onProgress?.({ status: 'SUBMITTING', progress: 5, message: 'Contacting Alibaba Cloud Model Studio...' });

  const res = await fetch('/api/alibaba/video-synthesis', {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody)
  });

  const data = await res.json();

  if (!res.ok || data.code || !data.output?.task_id) {
    throw new Error(data.message || data.error || 'Failed to initialize Alibaba video task');
  }

  const taskId = data.output.task_id;
  onProgress?.({ status: 'PENDING', progress: 15, taskId, message: 'Task queued on Alibaba Cloud GPU cluster...' });

  // Poll task status
  return await pollTaskUntilComplete(taskId, 'video', onProgress);
}

// Generate Image (Wanx 2.1 T2I)
export async function generateImage({
  model = 'wan2.2-t2i-plus',
  prompt,
  negativePrompt = '',
  size = '1024*1024',
  seed = null,
  onProgress
}) {
  const isDemo = alibabaConfig.isDemoMode() || !alibabaConfig.hasValidKey();

  if (isDemo) {
    return simulateGeneration({
      type: 'image',
      model,
      prompt,
      size,
      onProgress
    });
  }

  const headers = getHeaders();
  const requestBody = {
    model,
    input: {
      prompt,
      ...(negativePrompt ? { negative_prompt: negativePrompt } : {})
    },
    parameters: {
      size,
      ...(seed ? { seed: Number(seed) } : {})
    }
  };

  onProgress?.({ status: 'SUBMITTING', progress: 10, message: 'Dispatching to Alibaba Wan 2.2...' });

  const res = await fetch('/api/alibaba/image-synthesis', {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody)
  });

  const data = await res.json();
  if (!res.ok || data.code || !data.output?.task_id) {
    throw new Error(data.message || data.error || 'Failed to submit Alibaba image task');
  }

  const taskId = data.output.task_id;
  return await pollTaskUntilComplete(taskId, 'image', onProgress);
}

// Task Polling Loop with Progress Updates
async function pollTaskUntilComplete(taskId, type = 'video', onProgress) {
  const headers = getHeaders();
  const maxAttempts = 180; // up to 6 minutes for 4K/video rendering
  let attempt = 0;
  let simulatedProgress = 20;

  while (attempt < maxAttempts) {
    attempt++;
    await new Promise((r) => setTimeout(r, 2000)); // poll every 2s

    try {
      const res = await fetch(`/api/alibaba/tasks/${taskId}`, {
        method: 'GET',
        headers
      });

      const data = await res.json();
      const taskStatus = data.output?.task_status;

      if (simulatedProgress < 92) {
        simulatedProgress += Math.floor(Math.random() * 4) + 1;
      }

      onProgress?.({
        status: taskStatus || 'RUNNING',
        progress: simulatedProgress,
        taskId,
        message: taskStatus === 'RUNNING' 
          ? 'Alibaba Wan 2.1 is synthesizing cinematic frames...' 
          : 'Task in queue...'
      });

      if (taskStatus === 'SUCCEEDED') {
        onProgress?.({ status: 'SUCCEEDED', progress: 100, message: 'Video rendered successfully!' });

        let mediaUrl = data.output?.video_url;
        if (!mediaUrl && data.output?.results?.length > 0) {
          mediaUrl = data.output.results[0].url;
        }

        return {
          id: taskId,
          type,
          url: mediaUrl,
          rawOutput: data.output,
          createdAt: new Date().toISOString()
        };
      }

      if (taskStatus === 'FAILED') {
        throw new Error(data.output?.message || data.message || 'Alibaba generation task failed on cloud.');
      }
    } catch (err) {
      if (err.message.includes('Alibaba generation task failed')) {
        throw err;
      }
      console.warn('[Alibaba Polling] Transient error:', err.message);
    }
  }

  throw new Error('Alibaba generation timed out after 6 minutes.');
}

// Built-in Demo Generator (Realistic Simulation with Pre-cached Cinematic Clips)
async function simulateGeneration({ type, model, prompt, size, duration, imageUrl, onProgress }) {
  const mockTaskId = 'ali-mock-' + Math.random().toString(36).substring(2, 10);
  
  onProgress?.({ status: 'SUBMITTING', progress: 10, taskId: mockTaskId, message: 'Model Studio simulation initialized...' });
  await new Promise((r) => setTimeout(r, 1200));

  onProgress?.({ status: 'PENDING', progress: 25, taskId: mockTaskId, message: 'Queued on Alibaba Cloud High-Compute Node...' });
  await new Promise((r) => setTimeout(r, 1500));

  onProgress?.({ status: 'RUNNING', progress: 55, taskId: mockTaskId, message: 'Wan 2.1 Diffusion Backbone synthesizing latents...' });
  await new Promise((r) => setTimeout(r, 2000));

  onProgress?.({ status: 'RUNNING', progress: 85, taskId: mockTaskId, message: 'Temporal upscaling and audio-visual synchronization...' });
  await new Promise((r) => setTimeout(r, 1800));

  onProgress?.({ status: 'SUCCEEDED', progress: 100, taskId: mockTaskId, message: 'Render complete!' });

  // Curated high quality cinematic clips for preview
  const demoVideoClips = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
  ];

  const demoImages = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1200&q=80'
  ];

  const selectedUrl = type === 'video' 
    ? demoVideoClips[Math.floor(Math.random() * demoVideoClips.length)]
    : demoImages[Math.floor(Math.random() * demoImages.length)];

  return {
    id: mockTaskId,
    type,
    model,
    prompt,
    size,
    duration: duration || 5,
    url: selectedUrl,
    isDemo: true,
    createdAt: new Date().toISOString()
  };
}

// Local Generation History Storage
export const generationStorage = {
  getAll: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.GENERATIONS) || '[]');
    } catch {
      return [];
    }
  },
  save: (item) => {
    const list = generationStorage.getAll();
    const updated = [item, ...list.filter(x => x.id !== item.id)].slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.GENERATIONS, JSON.stringify(updated));
    return updated;
  },
  remove: (id) => {
    const list = generationStorage.getAll().filter(x => x.id !== id);
    localStorage.setItem(STORAGE_KEYS.GENERATIONS, JSON.stringify(list));
    return list;
  },
  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.GENERATIONS);
  }
};
