import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StudioLanding } from './components/StudioLanding';
import { AiModelsView } from './components/AiModelsView';
import { ModelStudioSettings } from './components/ModelStudioSettings';
import { HistoryDrawer } from './components/HistoryDrawer';
import { generationStorage, alibabaConfig } from './services/alibabaApi';
import './App.css';

export function App() {
  const [activeTab, setActiveTab] = useState('studio'); // 'studio' | 'models'
  const [selectedModelFromNav, setSelectedModelFromNav] = useState(null);
  const [selectedCategoryFromNav, setSelectedCategoryFromNav] = useState(null);

  const [configuredRoles, setConfiguredRoles] = useState(() => alibabaConfig.getModelRoles());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [connectionVersion, setConnectionVersion] = useState(0);

  const refreshHistory = () => {
    setHistoryCount(generationStorage.getAll().length);
  };

  useEffect(() => {
    refreshHistory();
  }, []);

  const handleConnectionChanged = () => {
    const updated = alibabaConfig.getModelRoles();
    setConfiguredRoles(updated);
    setConnectionVersion(prev => prev + 1);
  };

  const handleSelectModelFromNav = (modelId, category) => {
    setSelectedModelFromNav(modelId);
    setSelectedCategoryFromNav(category);
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen bg-hf-bg text-hf-text flex flex-col font-sans selection:bg-[var(--lime)] selection:text-black">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleHistory={() => setIsHistoryOpen(true)}
        historyCount={historyCount}
        onSelectModel={handleSelectModelFromNav}
        configuredRoles={configuredRoles}
        key={connectionVersion}
      />

      <main className="flex-1 w-full">
        {activeTab === 'studio' && (
          <StudioLanding
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenAiModels={() => setActiveTab('models')}
            onGenerationComplete={refreshHistory}
            onToggleHistory={() => setIsHistoryOpen(true)}
            historyCount={historyCount}
            selectedModelFromNav={selectedModelFromNav}
            selectedCategoryFromNav={selectedCategoryFromNav}
            onSelectMedia={(media) => {
              // Media selected
            }}
          />
        )}

        {activeTab === 'models' && (
          <AiModelsView
            configuredRoles={configuredRoles}
            onRoleChange={() => {}}
            onModelsSaved={() => {
              handleConnectionChanged();
            }}
          />
        )}
      </main>

      {isSettingsOpen && (
        <ModelStudioSettings
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onConnectionChanged={handleConnectionChanged}
        />
      )}

      {isHistoryOpen && (
        <HistoryDrawer
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onSelectMedia={(media) => {
            setActiveTab('studio');
          }}
        />
      )}
    </div>
  );
}

export default App;
