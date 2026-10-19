import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  Plane, 
  RotateCw, 
  Focus, 
  Clock, 
  Video,
  Sliders
} from 'lucide-react';
import { CAMERA_PRESETS } from '../data/curatedPresets';

const ICON_MAP = {
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Plane,
  RotateCw,
  Focus,
  Clock,
  Video
};

export function CameraControls({ 
  selectedCamera, 
  onSelectCamera, 
  motionSpeed = 5, 
  onChangeMotionSpeed 
}) {
  return (
    <div className="space-y-3 rounded-xl border border-white/5 bg-[#0e1117] p-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-xs font-semibold text-white uppercase tracking-wider font-display">
            Camera Movement &amp; Motion Control
          </span>
        </div>
        <span className="text-[11px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full font-medium">
          Alibaba Wan 2.1 3D Trajectory
        </span>
      </div>

      {/* Camera Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
        {CAMERA_PRESETS.map((preset) => {
          const IconComp = ICON_MAP[preset.icon] || Video;
          const isSelected = selectedCamera === preset.id;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectCamera(isSelected ? null : preset.id)}
              className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all border ${
                isSelected
                  ? 'border-purple-500 bg-purple-950/40 text-white shadow-sm shadow-purple-500/30 ring-1 ring-purple-500'
                  : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <div className={`p-1.5 rounded-md ${isSelected ? 'bg-purple-600 text-white' : 'bg-white/5 text-zinc-400'}`}>
                <IconComp className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-medium truncate">{preset.name}</div>
                <div className="text-[9px] text-zinc-500 truncate">{preset.category}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Motion Dynamic Speed Slider */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>Motion Dynamic Speed:</span>
          <span className="text-white font-mono font-semibold">{motionSpeed}x</span>
        </div>
        <div className="flex-1 max-w-[180px]">
          <input
            type="range"
            min="1"
            max="10"
            value={motionSpeed}
            onChange={(e) => onChangeMotionSpeed(Number(e.target.value))}
            className="w-full accent-purple-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
