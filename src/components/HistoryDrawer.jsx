import React from 'react';
import { X, Trash2, Film } from 'lucide-react';
import { generationStorage } from '../services/alibabaApi';

export function HistoryDrawer({ isOpen, onClose, onSelectMedia }) {
  const items = generationStorage.getAll();

  if (!isOpen) return null;

  const handleClear = () => {
    if (window.confirm('Clear all local generation history?')) {
      generationStorage.clear();
      onClose();
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    generationStorage.remove(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm" style={{ animation: 'fadeIn 0.15s ease' }}>
      <div className="hf-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-[52px] shrink-0">
          <h3 className="hf-display text-base text-hf-text">
            History <span className="text-hf-muted">{items.length}</span>
          </h3>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button onClick={handleClear} className="hf-btn hf-btn-danger hf-icon-btn" title="Clear history">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={onClose} className="hf-btn hf-btn-soft hf-icon-btn">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-2">
              <div className="hf-model-icon mb-1">
                <Film className="w-5 h-5 text-white/60" />
              </div>
              <div className="text-sm font-medium text-hf-text">No generations yet</div>
              <div className="text-xs text-hf-muted">Completed generations will appear here.</div>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => { onSelectMedia(item); onClose(); }}
                className="hf-card-frame cursor-pointer"
              >
                <div className="hf-card-body p-2 space-y-2">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                    {item.type === 'video' ? (
                      <video src={item.url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={item.url} alt="Gen" className="w-full h-full object-cover" />
                    )}
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-semibold text-white">
                      {item.model || 'Alibaba'}
                    </span>
                  </div>

                  <p className="px-1 text-xs text-white/70 line-clamp-2 leading-relaxed">{item.prompt}</p>

                  <div className="flex items-center justify-between px-1 pb-0.5 text-[11px] text-hf-muted">
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="hover:text-rose-400 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
