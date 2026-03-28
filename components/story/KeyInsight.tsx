// components/story/KeyInsight.tsx
// Comic-book style callout for key theological insights that need to POP

'use client';

import { Lightbulb, Heart, Zap, Star } from 'lucide-react';

interface KeyInsightProps {
  children: React.ReactNode;
  type?: 'love' | 'truth' | 'revelation' | 'key';
  title?: string;
}

const typeStyles = {
  love: {
    bg: 'from-rose-500 via-pink-500 to-red-500',
    glow: 'shadow-rose-500/50',
    border: 'border-rose-300',
    icon: Heart,
    iconBg: 'from-rose-400 to-pink-600',
  },
  truth: {
    bg: 'from-amber-500 via-yellow-500 to-orange-500',
    glow: 'shadow-amber-500/50',
    border: 'border-amber-300',
    icon: Lightbulb,
    iconBg: 'from-amber-400 to-orange-600',
  },
  revelation: {
    bg: 'from-violet-500 via-purple-500 to-indigo-500',
    glow: 'shadow-violet-500/50',
    border: 'border-violet-300',
    icon: Zap,
    iconBg: 'from-violet-400 to-purple-600',
  },
  key: {
    bg: 'from-cyan-500 via-blue-500 to-indigo-500',
    glow: 'shadow-cyan-500/50',
    border: 'border-cyan-300',
    icon: Star,
    iconBg: 'from-cyan-400 to-blue-600',
  },
};

export function KeyInsight({ children, type = 'key', title }: KeyInsightProps) {
  const style = typeStyles[type];
  const Icon = style.icon;

  return (
    <div className="my-12 relative animate-fade-in">
      {/* Outer glow effect */}
      <div
        className={`absolute -inset-2 bg-gradient-to-r ${style.bg} rounded-2xl blur-xl opacity-30`}
      />

      {/* Comic book style burst background */}
      <div className="absolute -inset-4 overflow-hidden rounded-2xl">
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Starburst pattern */}
          {[...Array(16)].map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 60 * Math.cos((i * 22.5 * Math.PI) / 180)}
              y2={50 + 60 * Math.sin((i * 22.5 * Math.PI) / 180)}
              stroke="currentColor"
              strokeWidth="2"
              className="text-white"
            />
          ))}
        </svg>
      </div>

      {/* Main container */}
      <div
        className={`
          relative overflow-hidden rounded-xl
          bg-gradient-to-br ${style.bg}
          border-2 ${style.border}
          shadow-2xl ${style.glow}
          transform hover:scale-[1.02] transition-transform duration-300
        `}
      >
        {/* Inner pattern overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, white 1px, transparent 1px),
              radial-gradient(circle at 80% 20%, white 1px, transparent 1px),
              radial-gradient(circle at 40% 40%, white 0.5px, transparent 0.5px)
            `,
            backgroundSize: '60px 60px, 80px 80px, 40px 40px',
          }}
        />

        {/* Content */}
        <div className="relative p-6 md:p-8">
          {/* Icon badge */}
          <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4">
            <div className={`
              p-3 md:p-4 rounded-full bg-gradient-to-br ${style.iconBg}
              shadow-lg border-4 border-white/30
              animate-pulse
            `}>
              <Icon className="h-6 w-6 md:h-8 md:w-8 text-white drop-shadow-lg" />
            </div>
          </div>

          {/* Title if provided */}
          {title && (
            <div className="mb-3 ml-8 md:ml-10">
              <span className="text-white/80 text-sm uppercase tracking-[0.2em] font-bold">
                {title}
              </span>
            </div>
          )}

          {/* Main text */}
          <div className="ml-8 md:ml-10">
            <p className="text-white text-xl md:text-2xl lg:text-3xl font-bold leading-snug drop-shadow-lg">
              {children}
            </p>
          </div>

          {/* Decorative corner accents */}
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
        </div>
      </div>

      {/* Bottom highlight */}
      <div
        className={`absolute -bottom-1 left-4 right-4 h-2 bg-gradient-to-r ${style.bg} rounded-full blur-sm opacity-60`}
      />
    </div>
  );
}
