// Backend proxy middleware for OpenAI image generation
// Keeps the API key out of cross-origin browser calls; the key comes from the x-openai-api-key header.

const OPENAI_BASE = 'https://api.openai.com/v1';

export function createOpenAIMiddleware() {
  return async (req, res, next) => {
    if (!req.url.startsWith('/api/openai')) {
      return next();
    }

    const sendJson = (status, payload) => {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(payload));
    };

    const apiKey = req.headers['x-openai-api-key'] || process.env.OPENAI_API_KEY || '';
    if (!apiKey) {
      return sendJson(401, { error: 'OpenAI API key is required.' });
    }

    let body = {};
    if (req.method === 'POST') {
      try {
        const buffers = [];
        for await (const chunk of req) buffers.push(chunk);
        const data = Buffer.concat(buffers).toString();
        if (data) body = JSON.parse(data);
      } catch (err) {
        return sendJson(400, { error: 'Invalid JSON body: ' + err.message });
      }
    }

    const { pathname } = new URL(req.url, 'http://localhost');

    // Route: Image generation (POST /api/openai/images)
    if (pathname === '/api/openai/images' && req.method === 'POST') {
      try {
        console.log('[OpenAI Proxy] Dispatching image generation with model:', body.model);
        const apiRes = await fetch(`${OPENAI_BASE}/images/generations`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        const data = await apiRes.json().catch(() => ({}));
        return sendJson(apiRes.status, data);
      } catch (err) {
        return sendJson(500, { error: 'OpenAI image request failed: ' + err.message + (err.cause?.code ? ' (' + err.cause.code + ')' : '') });
      }
    }

    sendJson(404, { error: 'Unknown OpenAI proxy route' });
  };
}
