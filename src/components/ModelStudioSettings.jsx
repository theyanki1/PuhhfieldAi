import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Globe,
  Zap,
  ShieldCheck,
  RefreshCw,
  Eye,
  EyeOff,
  Cpu,
  Sparkles
} from 'lucide-react';
import { alibabaConfig, testAlibabaConnection, ALIBABA_MODELS } from '../services/alibabaApi';

export function ModelStudioSettings({ isOpen, onClose, onConnectionChanged }) {
  const [apiKey, setApiKey] = useState('');
  const [region, setRegion] = useState('intl');
  const [customUrl, setCustomUrl] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(alibabaConfig.getApiKey());
      setRegion(alibabaConfig.getRegion());
      setCustomUrl(alibabaConfig.getCustomUrl());
      setDemoMode(alibabaConfig.isDemoMode());
      setTestResult(null);
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    alibabaConfig.setApiKey(apiKey);
    alibabaConfig.setRegion(region);
    alibabaConfig.setCustomUrl(customUrl);
    alibabaConfig.setDemoMode(demoMode);
    setSaveSuccess(true);
    onConnectionChanged?.();
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    alibabaConfig.setApiKey(apiKey);
    alibabaConfig.setRegion(region);
    alibabaConfig.setCustomUrl(customUrl);

    try {
      const res = await testAlibabaConnection();
      setTestResult(res);
      if (res.success) onConnectionChanged?.();
    } catch (err) {
      setTestResult({ success: false, error: err.message || 'Connection failed' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="hf-overlay" onClick={onClose}>
      <div className="hf-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="hf-model-icon w-10 h-10 rounded-[10px] text-hf-lime">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="hf-display text-lg leading-6 text-hf-text">Alibaba Model Studio</h2>
              <p className="text-xs text-hf-muted">Connect DashScope API Key</p>
            </div>
          </div>
          <button onClick={onClose} className="hf-btn hf-btn-soft hf-icon-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pb-5 max-h-[70vh] overflow-y-auto space-y-4">
          {/* Guide */}
          <div className="rounded-xl bg-hf-panel p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-hf-text flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-hf-lime" />
                How to get your API Key
              </span>
              <a
                href="https://modelstudio.console.alibabacloud.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-hf-lime hover:underline"
              >
                Console <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-hf-muted leading-relaxed">
              Navigate to <strong className="text-white/80 font-medium">API-KEY</strong> → create a new key (<code className="bg-white/5 px-1 py-0.5 rounded text-white/80 font-mono text-[10px]">sk-...</code>) → paste below.
            </p>
          </div>

          {/* API Key */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/60 flex items-center justify-between">
              <span>DashScope API Key</span>
              <span className="text-[10px] text-white/30 font-mono">sk-xxxxxxxx</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your API Key (sk-...)"
                className="hf-input bg-hf-panel text-xs font-mono pr-10"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Region */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/60 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Gateway Region
            </label>
            <div className="hf-segment bg-hf-panel gap-1">
              {[
                { id: 'intl', name: 'International', host: 'dashscope-intl.aliyuncs.com' },
                { id: 'cn', name: 'China', host: 'dashscope.aliyuncs.com' }
              ].map(r => (
                <button
                  key={r.id}
                  onClick={() => setRegion(r.id)}
                  className={`hf-segment-item h-auto flex-col items-start gap-0 py-2 text-left ${region === r.id ? 'active' : ''}`}
                >
                  <span className="text-sm">{r.name}</span>
                  <span className="text-[10px] font-normal font-mono text-white/40">{r.host}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Endpoint */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/60 flex items-center justify-between">
              <span>Custom Endpoint (Optional)</span>
              <span className="text-[10px] text-white/30">Enterprise / VPC</span>
            </label>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://{workspace}.maas.aliyuncs.com/api/v1"
              className="hf-input bg-hf-panel text-xs font-mono"
            />
          </div>

          {/* Demo Mode */}
          <div className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-hf-panel">
            <div>
              <div className="text-sm font-medium text-hf-text flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-hf-lime" />
                Demo Mode
              </div>
              <div className="text-xs text-hf-muted mt-0.5">Simulate without consuming credits</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:bg-hf-lime after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:bg-hf-ink" />
            </label>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`px-3 py-2.5 rounded-xl text-xs ${
              testResult.success
                ? 'bg-[var(--lime-dim)] text-hf-lime'
                : 'bg-rose-500/10 text-rose-300'
            }`}>
              <div className="flex items-center gap-2 font-medium">
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{testResult.message || testResult.error}</span>
                {testResult.latencyMs && (
                  <span className="ml-auto text-[10px] font-mono opacity-70">{testResult.latencyMs}ms</span>
                )}
              </div>
            </div>
          )}

          {/* Models Grid */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-white/60 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              Available Models
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {ALIBABA_MODELS.map(m => (
                <div key={m.id} className="px-2.5 py-2 rounded-xl bg-hf-panel flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium text-hf-text text-xs truncate">{m.name}</div>
                    <div className="text-[10px] text-white/30 font-mono truncate">{m.id}</div>
                  </div>
                  <span className="hf-nav-badge shrink-0">
                    {m.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 px-5 py-4 border-t border-white/5">
          <button
            onClick={handleTest}
            disabled={isTesting || (!apiKey && !demoMode)}
            className="hf-btn hf-btn-soft"
          >
            {isTesting ? (
              <><RefreshCw className="w-4 h-4 animate-spin-slow" /><span>Testing...</span></>
            ) : (
              <><ShieldCheck className="w-4 h-4 text-hf-lime" /><span>Test Connection</span></>
            )}
          </button>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs text-hf-lime flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
            <button onClick={handleSave} className="hf-btn hf-btn-solid">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
