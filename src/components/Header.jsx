import React, { useState, useRef, useEffect } from 'react';
import {
  Clock,
  Settings,
  Sparkles,
  Key,
  Plus,
  PanelLeft,
  Image as ImageIcon,
  Video,
  AudioLines,
  Boxes,
  Folder
} from 'lucide-react';
import {
  AI_PROVIDERS,
  providersStorage,
  ProviderLogos
} from '../services/aiProviders';
import { alibabaConfig } from '../services/alibabaApi';
import { PuhhfieldLogo } from './PuhhfieldLogo';

// Higgsfield nav order: Explore · Image · Video · Audio
const NAV_CATEGORIES = [
  { id: 'image', label: 'Image', defaultModel: 'wanx2.1-t2i-plus' },
  { id: 'video', label: 'Video', defaultModel: 'wan-2.7' },
  { id: 'audio', label: 'Audio', defaultModel: 'cosyvoice-v1' }
];

const SIDEBAR_ICONS = { image: ImageIcon, video: Video, audio: AudioLines };

const TAG_CLASS = { TOP: 'hf-tag-top', NEW: 'hf-tag-new', FAST: 'hf-tag-fast' };
const ICON_CLASS = { TOP: 'is-top', NEW: 'is-new', FAST: 'is-fast' };

export function Header({
  activeTab,
  setActiveTab,
  onOpenSettings,
  onToggleHistory,
  historyCount = 0,
  onSelectModel,
  configuredRoles
}) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeTimeoutRef = useRef(null);

  // Mobile sidebar: close the panel, then run the nav action
  const fromSidebar = (action) => () => {
    setIsSidebarOpen(false);
    action?.();
  };

  // Track connected providers
  const [connectedProviders, setConnectedProviders] = useState(() => providersStorage.getConnectedProviders());

  useEffect(() => {
    const handleStorage = () => {
      setConnectedProviders(providersStorage.getConnectedProviders());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const hasAnyKey = connectedProviders.length > 0 || alibabaConfig.hasValidKey();

  const handleMouseEnter = (menu) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleModelClick = (model, category) => {
    setActiveDropdown(null);
    setActiveTab('studio');
    onSelectModel?.(model.id, category);
  };

  // Helper to render authentic brand logo or fallback icon
  const renderLogo = (logoKey, className = "w-6 h-6") => {
    const LogoComponent = ProviderLogos[logoKey];
    if (LogoComponent) {
      return <LogoComponent className={className} />;
    }
    return <Sparkles className={`${className} text-white/70`} />;
  };

  // Model tile: 48px icon square with Higgsfield TOP/NEW badge on the corner
  const renderModelIcon = (item, logoKey) => (
    <div className={`hf-model-icon ${ICON_CLASS[item.badge] || ''}`}>
      {item.badge && (
        <span className={`hf-tag ${TAG_CLASS[item.badge] || 'hf-tag-new'}`}>{item.badge}</span>
      )}
      {renderLogo(logoKey)}
    </div>
  );

  // Higgsfield mega-menu panel for a category
  const renderCategoryDropdown = (category) => {
    const connectedModels = providersStorage.getConnectedModelsByCategory(category);
    const allModels = providersStorage.getAllModelsByCategory(category);

    return (
      <div
        onMouseEnter={() => handleMouseEnter(category)}
        onMouseLeave={handleMouseLeave}
        className="absolute top-full left-0 pt-2 z-[300]"
      >
        <div className="hf-popover w-[440px] max-w-[95vw]">
          <div className="pt-3 pr-2 pb-2">
            <div className="flex items-center justify-between">
              <p className="hf-popover-label pt-0">Models</p>
              <span className="text-xs text-hf-muted">
                {connectedModels.length > 0
                  ? `${connectedModels.length} active`
                  : 'Preview'}
              </span>
            </div>

            {connectedModels.length === 0 ? (
              /* Empty / Preview State when user hasn't imported key for this category */
              <div className="space-y-3 pt-1">
                <div className="mx-2 p-4 rounded-2xl bg-hf-card text-center">
                  <div className="w-10 h-10 rounded-xl bg-[var(--lime-dim)] text-hf-lime flex items-center justify-center mx-auto mb-2.5">
                    <Key className="w-5 h-5" />
                  </div>
                  <div className="font-display text-sm font-medium text-hf-text">No {category} provider connected</div>
                  <p className="text-xs text-hf-muted mt-1 max-w-[280px] mx-auto leading-relaxed">
                    Connect Alibaba, OpenAI, Google, ByteDance or other AI providers in AI Models to activate full model library.
                  </p>
                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      setActiveTab('models');
                    }}
                    className="hf-btn hf-btn-solid mt-3"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Connect AI Provider</span>
                  </button>
                </div>

                {/* Preview of models that unlock */}
                <div>
                  <p className="hf-popover-label">Available models to unlock</p>
                  <div className="max-h-[260px] overflow-y-auto no-scrollbar opacity-50">
                    {allModels.slice(0, 6).map((item) => (
                      <div key={item.id} className="hf-menu-item cursor-default hover:bg-transparent">
                        {renderModelIcon(item, item.logoKey)}
                        <div className="flex-1 min-w-0">
                          <p className="hf-menu-title truncate">{item.name}</p>
                          <p className="hf-menu-desc truncate">{item.providerName} • {item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Connected models */
              <div className="max-h-[460px] overflow-y-auto no-scrollbar pt-1">
                {connectedModels.map((item) => {
                  const provider = AI_PROVIDERS.find(p => p.name === item.providerName || p.models.some(m => m.id === item.id));
                  const logoKey = provider?.logoKey || 'alibaba';

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleModelClick(item, category)}
                      className="hf-menu-item"
                    >
                      {renderModelIcon(item, logoKey)}
                      <div className="flex-1 min-w-0">
                        <p className="hf-menu-title truncate">{item.name}</p>
                        <p className="hf-menu-desc line-clamp-1">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const providersLabel = connectedProviders.map(p => p.name).join(', ') || 'Alibaba Cloud';

  return (
    <>
    <header className="hf-nav">
      {/* ─── Mobile bar: sidebar toggle · logo · Import AI Provider ─── */}
      <div className="lg:hidden relative flex items-center justify-between w-full">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="hf-btn hf-icon-btn -ml-2 text-white/70 hover:text-white"
          title="Open menu"
          aria-label="Open menu"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab('studio')}
          className="absolute left-1/2 -translate-x-1/2"
          title="PuhhfieldAi Studio"
        >
          <PuhhfieldLogo variant="icon" className="w-8 h-8" />
        </button>

        <button
          onClick={() => setActiveTab('models')}
          className="hf-btn hf-btn-solid h-8 px-3.5 rounded-full text-[13px]"
        >
          <Plus className="w-3.5 h-3.5 hidden min-[400px]:block" />
          <span>Import AI Provider</span>
        </button>
      </div>

      {/* Left: Brand Logo & Navigation */}
      <div className="hidden lg:flex items-center gap-3 min-w-0">
        <button
          onClick={() => setActiveTab('studio')}
          className="shrink-0"
          title="PuhhfieldAi Studio"
        >
          <PuhhfieldLogo variant="icon" className="w-8 h-8" />
        </button>

        <nav className="flex items-center min-w-0">
          <button
            onClick={() => {
              setActiveDropdown(null);
              setActiveTab('studio');
            }}
            className={`hf-nav-item ${activeTab === 'studio' ? 'active' : ''}`}
          >
            Explore
          </button>

          {NAV_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="relative"
              onMouseEnter={() => handleMouseEnter(cat.id)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => {
                  setActiveTab('studio');
                  onSelectModel?.(cat.defaultModel, cat.id);
                }}
                className={`hf-nav-item ${activeDropdown === cat.id ? 'text-white' : ''}`}
              >
                {cat.label}
              </button>
              {activeDropdown === cat.id && renderCategoryDropdown(cat.id)}
            </div>
          ))}

          <span className="hf-nav-divider" />

          <button
            onClick={() => {
              setActiveDropdown(null);
              setActiveTab('models');
            }}
            className={`hf-nav-item ${activeTab === 'models' ? 'active' : ''}`}
          >
            <span>AI Models</span>
            {connectedProviders.length > 0 && (
              <span className="hf-nav-badge">{connectedProviders.length}</span>
            )}
          </button>
        </nav>
      </div>

      {/* Right side actions */}
      <div className="hidden lg:flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleHistory}
          className="hf-btn hf-btn-soft hf-icon-btn relative"
          title="Generation History"
        >
          <Clock className="w-4 h-4" />
          {historyCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-hf-pink text-white text-[9px] font-bold leading-4 text-center">
              {historyCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenSettings}
          className="hf-btn hf-btn-soft hf-icon-btn"
          title="Model Studio Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        <span className="hf-nav-divider hidden sm:block" />

        {hasAnyKey ? (
          <button
            onClick={() => setActiveTab('models')}
            className="hf-btn hf-btn-tint"
            title="Configure AI Providers"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-hf-lime" />
            <span className="hidden sm:inline">
              {connectedProviders.length > 0 ? `${connectedProviders.length} Providers Active` : 'Alibaba Active'}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('models')}
            className="hf-btn hf-btn-solid"
            title="Configure AI Providers"
          >
            Import AI Provider
          </button>
        )}
      </div>
    </header>

    {/* ─── Mobile sidebar (Higgsfield mobile menu) ─── */}
    {isSidebarOpen && (
      <div className="lg:hidden fixed inset-0 z-[150]">
        <div
          className="absolute inset-0 bg-black/60"
          style={{ animation: 'fadeIn 0.15s ease' }}
          onClick={() => setIsSidebarOpen(false)}
        />

        <aside className="hf-sidebar">
          <div className="flex items-center justify-between h-[52px] pl-4 pr-2 shrink-0">
            <button onClick={fromSidebar(() => setActiveTab('studio'))} title="PuhhfieldAi Studio">
              <PuhhfieldLogo variant="full" className="w-7 h-7" textClassName="text-lg font-bold font-display" />
            </button>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="hf-btn hf-icon-btn text-white/70 hover:text-white"
              title="Close menu"
              aria-label="Close menu"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-1 pt-3 pb-4">
            <button onClick={fromSidebar(() => setActiveTab('studio'))} className="hf-sidebar-create">
              <Plus />
              <span>Create</span>
            </button>

            <div className="mt-1">
              {NAV_CATEGORIES.map((cat) => {
                const Icon = SIDEBAR_ICONS[cat.id];
                return (
                  <button
                    key={cat.id}
                    onClick={fromSidebar(() => {
                      setActiveTab('studio');
                      onSelectModel?.(cat.defaultModel, cat.id);
                    })}
                    className="hf-sidebar-item"
                  >
                    <Icon />
                    <span className="flex-1">{cat.label}</span>
                  </button>
                );
              })}

              <button
                onClick={fromSidebar(() => setActiveTab('models'))}
                className={`hf-sidebar-item ${activeTab === 'models' ? 'active' : ''}`}
              >
                <Boxes />
                <span className="flex-1">AI Models</span>
                {connectedProviders.length > 0 ? (
                  <span className="hf-nav-badge text-xs">{connectedProviders.length} active</span>
                ) : (
                  <span className="hf-sidebar-pill">Connect</span>
                )}
              </button>

              <button onClick={fromSidebar(onToggleHistory)} className="hf-sidebar-item">
                <Folder />
                <span className="flex-1">History</span>
                {historyCount > 0 && <span className="text-sm text-hf-muted">{historyCount}</span>}
              </button>

              <button onClick={fromSidebar(onOpenSettings)} className="hf-sidebar-item">
                <Settings />
                <span className="flex-1">Settings</span>
              </button>
            </div>
          </nav>

          <div className="shrink-0 mx-4 border-t border-white/10" />
          <div className="shrink-0 px-4 pt-5 pb-6">
            <p className="text-base font-semibold text-hf-text">
              {hasAnyKey ? `${connectedProviders.length || 1} provider${connectedProviders.length > 1 ? 's' : ''} active` : 'Bring your ideas to life'}
            </p>
            <p className="text-[15px] leading-snug text-hf-muted mt-1">
              {hasAnyKey ? providersLabel : 'Import an AI provider to create videos, images and audio'}
            </p>
            <button onClick={fromSidebar(() => setActiveTab('models'))} className="hf-sidebar-cta mt-5">
              {hasAnyKey ? 'Manage AI Providers' : 'Import AI Provider'}
            </button>
          </div>
        </aside>
      </div>
    )}
    </>
  );
}
