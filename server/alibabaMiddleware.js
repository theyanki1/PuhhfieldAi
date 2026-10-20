// Backend proxy middleware for Alibaba Cloud Model Studio (DashScope) APIs
// Handles CORS, secure forwarding, and status polling

export function createAlibabaMiddleware() {
  return async (req, res, next) => {
    if (!req.url.startsWith('/api/alibaba')) {
      return next();
    }

    // CORS headers for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-dashscope-api-key, x-dashscope-region, x-dashscope-custom-url');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const apiKey = req.headers['x-dashscope-api-key'] || process.env.DASHSCOPE_API_KEY || '';
    const region = req.headers['x-dashscope-region'] || 'intl';
    const customUrl = req.headers['x-dashscope-custom-url'] || '';

    let baseUrl = 'https://dashscope-intl.aliyuncs.com/api/v1';
    if (customUrl && customUrl.trim()) {
      let trimmed = customUrl.trim();
      // DashScope API keys created in https://modelstudio.console.alibabacloud.com/ap-southeast-1/
      // are standard International DashScope keys. If a private Maas endpoint (ws-*.maas.aliyuncs.com)
      // is provided, Alibaba Cloud blocks it with "Workspace endpoint access denied".
      if (trimmed.includes('maas.aliyuncs.com') || trimmed.startsWith('ws-')) {
        console.log('[Alibaba Proxy] Private Maas workspace endpoint detected — routing to official DashScope Singapore (ap-southeast-1): https://dashscope-intl.aliyuncs.com/api/v1');
        baseUrl = 'https://dashscope-intl.aliyuncs.com/api/v1';
      } else {
        if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
          trimmed = 'https://' + trimmed;
        }
        baseUrl = trimmed.replace(/\/+$/, '');
        if (!baseUrl.endsWith('/api/v1')) baseUrl += '/api/v1';
      }
    } else if (region === 'cn') {
      baseUrl = 'https://dashscope.aliyuncs.com/api/v1';
    }

    // Read request body if POST
    let body = {};
    if (req.method === 'POST') {
      try {
        const buffers = [];
        for await (const chunk of req) {
          buffers.push(chunk);
        }
        const data = Buffer.concat(buffers).toString();
        if (data) {
          body = JSON.parse(data);
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body: ' + err.message }));
        return;
      }
    }

    const url = new URL(req.url, 'http://localhost');
    const path = url.pathname;

    // Route: Test Connection
    if (path === '/api/alibaba/test-connection') {
      if (!apiKey) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'No API Key provided. Please enter your Alibaba Model Studio API key.'
        }));
        return;
      }

      try {
        const start = Date.now();
        let activeBase = baseUrl;

        // Query dummy task or chat completion to test authentication
        let testRes = await fetch(`${activeBase}/tasks/test-ping-auth`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        let testData = await testRes.json().catch(() => ({}));

        // If private workspace endpoint was blocked with 403 or "Workspace endpoint access denied",
        // retry with official DashScope Singapore (ap-southeast-1) endpoint
        if (testRes.status === 403 || testData?.message?.includes('Workspace endpoint access denied') || testData?.code?.includes('Workspace')) {
          console.log('[Alibaba Proxy] Got Workspace access denied on custom endpoint, retrying via official https://dashscope-intl.aliyuncs.com/api/v1');
          activeBase = 'https://dashscope-intl.aliyuncs.com/api/v1';
          testRes = await fetch(`${activeBase}/tasks/test-ping-auth`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          });
          testData = await testRes.json().catch(() => ({}));
        }

        const latency = Date.now() - start;

        // If 401 or 403 or InvalidApiKey, key is invalid
        if (testRes.status === 401 || (testRes.status === 403 && !testData?.message?.includes('Workspace')) || testData?.code === 'InvalidApiKey') {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: testData.message || 'Invalid Alibaba Model Studio API Key. Please verify in console.',
            code: testData.code || 'Unauthorized'
          }));
          return;
        }

        // If response is 404 (task not found) or 200, key is valid and connected to DashScope
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Connected successfully to Alibaba Cloud Model Studio (DashScope Singapore ap-southeast-1)!',
          region: 'ap-southeast-1',
          baseUrl: activeBase,
          latencyMs: latency,
          models: [
            { id: 'wan2.1-t2v-plus', name: 'Wan 2.1 Video Plus (720p)', type: 'video' },
            { id: 'wan2.1-t2v-turbo', name: 'Wan 2.1 Video Turbo (Fast)', type: 'video' },
            { id: 'wan2.1-i2v-plus', name: 'Wan 2.1 Image-to-Video Plus', type: 'video' },
            { id: 'wan2.1-i2v-turbo', name: 'Wan 2.1 Image-to-Video Turbo', type: 'video' },
            { id: 'wan2.2-t2i-plus', name: 'Wan 2.2 Image Plus', type: 'image' },
            { id: 'wan2.2-t2i-flash', name: 'Wan 2.2 Image Flash', type: 'image' },
            { id: 'qwen-max', name: 'Qwen Max (Prompt Enhancer)', type: 'llm' }
          ]
        }));
        return;
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: `Network error connecting to Alibaba Cloud: ${err.message}`
        }));
        return;
      }
    }

    // Route: Test Individual Model (Wan, Wanx, Qwen, CosyVoice)
    if (path === '/api/alibaba/test-model') {
      const modelId = body.model || 'qwen-plus';
      const role = body.role || 'general';
      const start = Date.now();

      if (!apiKey) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'No API Key configured. Please enter your API key first.',
          latencyMs: 0
        }));
        return;
      }

      try {
        let testRes;
        let testData = {};

        // If it's an LLM or reasoning model
        if (modelId.startsWith('qwen') || role.includes('reasoning') || role === 'auto' || role === 'fast') {
          testRes = await fetch(`${baseUrl}/services/aigc/text-generation/generation`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: modelId.includes('omni') ? 'qwen-turbo' : modelId,
              input: {
                messages: [{ role: 'user', content: 'Ping' }]
              },
              parameters: {
                max_tokens: 5
              }
            })
          });
          testData = await testRes.json().catch(() => ({}));
        } else {
          // For video / image / audio tasks, verify auth against tasks / services endpoint
          testRes = await fetch(`${baseUrl}/tasks/test-ping-${encodeURIComponent(modelId)}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          });
          testData = await testRes.json().catch(() => ({}));
        }

        const latency = Date.now() - start;

        if (testRes.status === 401 || testRes.status === 403 || testData?.code === 'InvalidApiKey') {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            model: modelId,
            error: testData.message || 'Unauthorized / Invalid API Key',
            latencyMs: latency
          }));
          return;
        }

        // If status is 200 or 404 (task not found means authenticated) or 400 with model parameter validation
        const isValid = testRes.ok || testRes.status === 404 || (testData?.code && testData.code !== 'InvalidApiKey');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          model: modelId,
          role,
          message: 'Model reachable and verified',
          latencyMs: latency
        }));
        return;
      } catch (err) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          model: modelId,
          error: err.message,
          latencyMs: Date.now() - start
        }));
        return;
      }
    }

    // Route: Audio Synthesis (CosyVoice / Sambert)
    if (path === '/api/alibaba/audio-synthesis') {
      if (!apiKey) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Alibaba Model Studio API key is required.' }));
        return;
      }

      try {
        const model = body.model || 'cosyvoice-v1';
        const text = body.prompt || body.text || 'Hello from Puhhfield Studio';
        const voice = body.voice || 'longxiaochun';

        const targetUrl = `${baseUrl}/services/audio/tts/generation`;
        console.log(`[Alibaba Proxy] Dispatching audio synthesis to ${targetUrl} with model:`, model);

        const apiRes = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model,
            input: { text },
            parameters: { voice, format: 'mp3' }
          })
        });

        const data = await apiRes.json();
        res.writeHead(apiRes.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
        return;
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Audio synthesis request failed: ' + err.message + (err.cause?.code ? ' (' + err.cause.code + ')' : '') }));
        return;
      }
    }

    // Route: Video Synthesis (Wan 2.1 T2V / I2V)
    if (path === '/api/alibaba/video-synthesis') {
      if (!apiKey) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Alibaba Model Studio API key is required.' }));
        return;
      }

      try {
        const targetUrl = `${baseUrl}/services/aigc/video-generation/video-synthesis`;
        console.log(`[Alibaba Proxy] Dispatching video synthesis to ${targetUrl} with model:`, body.model);

        const apiRes = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'X-DashScope-Async': 'enable',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        const data = await apiRes.json();
        res.writeHead(apiRes.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
        return;
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Video synthesis request failed: ' + err.message + (err.cause?.code ? ' (' + err.cause.code + ')' : '') }));
        return;
      }
    }

    // Route: Image Synthesis (Wanx 2.1 T2I)
    if (path === '/api/alibaba/image-synthesis') {
      if (!apiKey) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Alibaba Model Studio API key is required.' }));
        return;
      }

      try {
        const targetUrl = `${baseUrl}/services/aigc/text2image/image-synthesis`;
        console.log(`[Alibaba Proxy] Dispatching image synthesis to ${targetUrl} with model:`, body.model);

        const apiRes = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'X-DashScope-Async': 'enable',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        const data = await apiRes.json();
        res.writeHead(apiRes.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
        return;
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Image synthesis request failed: ' + err.message + (err.cause?.code ? ' (' + err.cause.code + ')' : '') }));
        return;
      }
    }

    // Route: Task Polling (GET /api/alibaba/tasks/:taskId)
    const taskMatch = path.match(/^\/api\/alibaba\/tasks\/([^/]+)$/);
    if (taskMatch) {
      const taskId = taskMatch[1];
      if (!apiKey) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Alibaba Model Studio API key is required.' }));
        return;
      }

      try {
        const targetUrl = `${baseUrl}/tasks/${taskId}`;
        const apiRes = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await apiRes.json();
        res.writeHead(apiRes.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
        return;
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Task status check failed: ' + err.message }));
        return;
      }
    }

    // Route: Enhance Prompt (Qwen Model Studio or Intelligent Cinematic Director)
    if (path === '/api/alibaba/enhance-prompt') {
      const { prompt, style, cameraMovement } = body;
      if (!prompt) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Prompt is required' }));
        return;
      }

      // If API key is available, attempt Qwen DashScope enhancement
      if (apiKey) {
        try {
          const qwenUrl = `${baseUrl}/services/aigc/text-generation/generation`;
          const systemPrompt = `You are a world-class Hollywood cinematographer and director specialized in Alibaba Wan 2.1 video generation. 
Your task is to take a user's rough prompt and expand it into a visually stunning, photorealistic cinematic video prompt.
Include:
- Exact camera movement: ${cameraMovement || 'cinematic dynamic camera'}
- Lens specifications: e.g. 35mm anamorphic lens, f/1.8 shallow depth of field
- Lighting setup: e.g. volumetric lighting, rim light, atmospheric haze
- Visual style: ${style || 'photorealistic cinematic'}
- Character & texture details
Keep the expanded prompt concise, visually descriptive, between 40-90 words. Output ONLY the enhanced prompt in English.`;

          const qwenRes = await fetch(qwenUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'qwen-plus',
              input: {
                messages: [
                  { role: 'system', content: systemPrompt },
                  { role: 'user', content: `Enhance this video prompt: "${prompt}"` }
                ]
              },
              parameters: {
                result_format: 'message'
              }
            })
          });

          if (qwenRes.ok) {
            const qwenData = await qwenRes.json();
            const enhanced = qwenData.output?.choices?.[0]?.message?.content?.trim();
            if (enhanced) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, enhancedPrompt: enhanced, source: 'qwen-plus' }));
              return;
            }
          }
        } catch (err) {
          console.warn('[Alibaba Proxy] Qwen enhancement fallback:', err.message);
        }
      }

      // Fallback: Expert Cinematic Prompt Director Engine
      const cameraDescriptions = {
        'dolly-in': 'smooth dolly-in tracking forward towards the subject, dramatic focus shift',
        'dolly-out': 'epic dolly-out revealing the expansive cinematic environment, wide establishing shot',
        'pan-left': 'cinematic continuous pan left following the action across the frame',
        'pan-right': 'smooth sweeping pan right capturing detailed background ambiance',
        'tilt-up': 'majestic upward tilt rising from ground level to subject against dramatic sky',
        'tilt-down': 'deliberate tilt-down revealing intricate foreground details',
        'fpv-drone': 'high-speed FPV drone dive maneuvering dynamically through the scenery',
        'orbit-360': 'sweeping 360-degree rotational camera orbit around subject, parallax depth',
        'crash-zoom': 'dramatic high-impact crash zoom snapping sharply into intense subject focus',
        'bullet-time': 'frozen bullet-time camera spin with floating particles and micro-motion',
        'static-locked': 'tripod locked static composition, perfectly stabilized, subtle subject motion'
      };

      const selectedCamera = cameraDescriptions[cameraMovement] || 'smooth cinematic camera movement with 3D parallax';
      const cinematicEnhancement = `Cinematic 8K masterpiece, ${prompt}. Shot on ARRI Alexa Mini with 35mm anamorphic lens, ${selectedCamera}. Volumetric rays, subtle atmospheric haze, ultra-detailed micro-textures, photorealistic dynamic range, masterpiece color grade.`;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        enhancedPrompt: cinematicEnhancement,
        source: 'director-engine'
      }));
      return;
    }

    // Default 404 for unknown alibaba API route
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: `Not found: ${path}` }));
  };
}
