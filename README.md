# PuhhfieldAi

Open-source AI video, image and audio studio with a Higgsfield-style UI.

**Live demo:** https://theyanki1.github.io/PuhhfieldAi/

## Run locally

```bash
npm install
npm run dev
```

The dev server (`vite.config.js`) includes a proxy for the Alibaba Cloud Model Studio (DashScope) API, so real generations need `npm run dev` and an API key (Settings → DashScope API Key, or `DASHSCOPE_API_KEY`).

The GitHub Pages build is static: the full UI works and video/image generation runs in demo mode, but calls that go through the `/api/alibaba` proxy (real generation, audio, prompt enhance, connection test) are unavailable there.

## Design

UI tokens and components are documented in [DESIGN.md](DESIGN.md).

## Deploy

Pushing to `main` builds and deploys to GitHub Pages via [.github/workflows/deploy.yml](.github/workflows/deploy.yml).
