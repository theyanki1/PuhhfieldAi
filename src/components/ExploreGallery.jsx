import React, { useState } from 'react';
import { Play, Copy, Check, Film, Eye, Heart, ArrowUpRight } from 'lucide-react';
import { EXPLORE_GALLERY } from '../data/curatedPresets';

export function ExploreGallery({ onSelectPrompt }) {
  const [filter, setFilter] = useState('All');
  const [hoveredId, setHoveredId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [likedIds, setLikedIds] = useState(new Set());

  const tags = ['All', 'Cyberpunk', 'Landscape', 'Fashion', 'Fantasy', 'Ocean'];

  const filteredItems = filter === 'All'
    ? EXPLORE_GALLERY
    : EXPLORE_GALLERY.filter(item => item.tags?.includes(filter));

  const handleCopy = (id, prompt, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLike = (id, e) => {
    e.stopPropagation();
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="w-full">
      {/* Hero Banner Cards — 3-column featured row like Higgsfield */}
      <div className="w-full px-4 lg:px-6 pt-5 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-[1400px] mx-auto">
          {/* Featured Card 1 */}
          <div className="relative rounded-xl overflow-hidden aspect-[16/9] md:aspect-[4/3] bg-gradient-to-br from-purple-950 via-black to-black group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold mb-1">Puhhfield Academy</div>
              <div className="text-sm font-bold text-white font-display">Learn to create AI Images and videos, step by step</div>
            </div>
          </div>

          {/* Featured Card 2 */}
          <div className="relative rounded-xl overflow-hidden aspect-[16/9] md:aspect-[4/3] bg-gradient-to-br from-zinc-900 via-black to-black group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold mb-1">Wan 2.1 Unlimited</div>
              <div className="text-sm font-bold text-white font-display">Up to 30-second videos from text, image, video or audio. No limits.</div>
            </div>
          </div>

          {/* Featured Card 3 */}
          <div className="relative rounded-xl overflow-hidden aspect-[16/9] md:aspect-[4/3] bg-gradient-to-br from-lime-950/30 via-black to-black group cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-[var(--lime)]/10 blur-3xl animate-pulse-glow" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold mb-1">Puhhfield Genjutsu</div>
              <div className="text-sm font-bold text-white font-display">One upload in. Endless new visions out.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Nav Grid */}
      <div className="w-full px-4 lg:px-6 py-4">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {[
            { label: 'Seedance 2.5', sub: 'The most advanced AI video model', badge: 'Top', badgeType: 'top' },
            { label: 'AI Influencer', sub: 'Build your next hype machine', badge: 'New', badgeType: 'new' },
            { label: 'Wan 2.1 Video', sub: 'Generate cinematic video', icon: '▶' },
            { label: 'Cinema Studio 4.0', sub: 'Create cinematic scenes effortlessly', icon: '🎬' },
            { label: 'Image Studio', sub: 'Wanx 2.1 photorealistic images', icon: '🖼' },
            { label: 'Alibaba API', sub: 'DashScope model integration', icon: '⚡' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.label.includes('Video') || item.label.includes('Cinema') || item.label.includes('Seedance'))
                  onSelectPrompt?.({ prompt: '' });
                else if (item.label.includes('Image'))
                  onSelectPrompt?.({ prompt: '', tab: 'image' });
              }}
              className="flex flex-col items-start gap-1 p-3 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all text-left group"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white group-hover:text-[var(--lime)] transition-colors">{item.label}</span>
                {item.badge && (
                  <span className={item.badgeType === 'top' ? 'badge-top' : 'badge-new'}>{item.badge}</span>
                )}
              </div>
              <span className="text-[10px] text-zinc-500 leading-tight">{item.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Community Section Title */}
      <div className="w-full px-4 lg:px-6 pt-8 pb-4">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Explore the inside of every project</h2>
            <p className="section-subtitle">See all prompts, assets, and how each project was created.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === t
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Video Card Grid — Higgsfield style */}
      <div className="w-full px-4 lg:px-6 pb-16">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredItems.map((item) => {
            const isHovered = hoveredId === item.id;
            const isCopied = copiedId === item.id;
            const isLiked = likedIds.has(item.id);

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectPrompt(item)}
                className="hf-card group"
              >
                {/* Media */}
                <div className="hf-card-media">
                  {item.videoUrl && isHovered ? (
                    <video
                      src={item.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center">
                      <Film className="w-6 h-6 text-zinc-700" />
                    </div>
                  )}

                  {/* Model badge — top right like Higgsfield */}
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 rounded-md bg-[var(--lime)]/80 flex items-center justify-center">
                      <span className="text-[8px] font-black text-black">AI</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Info Bar — compact like Higgsfield */}
                <div className="flex items-center justify-between px-2.5 py-2">
                  <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                    <button
                      onClick={(e) => handleLike(item.id, e)}
                      className={`flex items-center gap-1 hover:text-white transition-colors ${isLiked ? 'text-red-400' : ''}`}
                    >
                      <Heart className={`w-3 h-3 ${isLiked ? 'fill-red-400' : ''}`} />
                    </button>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {item.views || Math.floor(Math.random() * 2000 + 100)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleCopy(item.id, item.prompt, e)}
                    className="text-zinc-600 hover:text-white transition-colors"
                    title="Copy prompt"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-[var(--lime)]" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-8">
          <button className="btn-outline text-xs gap-2">
            Explore community
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
