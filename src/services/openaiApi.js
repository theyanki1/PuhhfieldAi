// OpenAI image generation (gpt-image-*) through the local /api/openai proxy
import { providersStorage } from './aiProviders';

// gpt-image models only accept these canvas sizes
const OPENAI_SIZES = {
  '16:9': '1536x1024',
  '4:3': '1536x1024',
  '9:16': '1024x1536',
  '1:1': '1024x1024'
};

// Full-size PNGs (1–3 MB) would overflow localStorage, so history keeps a small JPEG copy
function toHistoryThumbnail(dataUrl, maxSide = 768, quality = 0.82) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

export async function generateOpenAIImage({
  model = 'gpt-image-2',
  prompt,
  aspectRatio = '1:1',
  onProgress
}) {
  const apiKey = providersStorage.getKey('openai');
  if (!apiKey) {
    throw new Error('Connect your OpenAI API key in AI Models first.');
  }

  onProgress?.({ status: 'SUBMITTING', progress: 20, message: 'Dispatching to OpenAI Images...' });

  const res = await fetch('/api/openai/images', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-openai-api-key': apiKey
    },
    body: JSON.stringify({
      model,
      prompt,
      size: OPENAI_SIZES[aspectRatio] || '1024x1024',
      quality: 'medium',
      n: 1
    })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.data?.[0]) {
    throw new Error(data.error?.message || data.error || 'OpenAI image generation failed.');
  }

  const b64 = data.data[0].b64_json;
  const url = b64 ? `data:image/png;base64,${b64}` : data.data[0].url;
  onProgress?.({ status: 'SUCCEEDED', progress: 100, message: 'Image rendered successfully!' });

  return {
    id: 'openai-' + Date.now().toString(36),
    type: 'image',
    model,
    prompt,
    url,
    createdAt: new Date().toISOString(),
    // History copy: small JPEG instead of the multi-MB original
    historyUrl: b64 ? (await toHistoryThumbnail(url)) || null : url
  };
}
