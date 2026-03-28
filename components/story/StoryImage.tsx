// components/story/StoryImage.tsx
// Ancient manuscript style image component

'use client';

import { useState } from 'react';
import { ZoomIn, X } from 'lucide-react';

interface StoryImageProps {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  layout?: 'full' | 'float-left' | 'float-right' | 'inline';
}

export function StoryImage({ src, alt, caption, credit, layout = 'full' }: StoryImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);

  const layoutClasses = {
    'full': 'w-full my-10',
    'float-left': 'float-left mr-8 mb-4 w-1/2 max-w-sm',
    'float-right': 'float-right ml-8 mb-4 w-1/2 max-w-sm',
    'inline': 'w-full max-w-md mx-auto my-8',
  };

  if (imageError) {
    return null;
  }

  return (
    <>
      <figure className={`relative ${layoutClasses[layout]}`}>
        {/* Aged paper frame effect */}
        <div
          className="relative overflow-hidden rounded-sm cursor-zoom-in group"
          onClick={() => setIsZoomed(true)}
          style={{
            boxShadow: `
              0 4px 20px rgba(120, 80, 40, 0.25),
              inset 0 0 60px rgba(120, 80, 40, 0.1)
            `,
          }}
        >
          {/* Decorative aged border */}
          <div
            className="absolute inset-0 pointer-events-none z-10 rounded-sm"
            style={{
              border: '6px solid transparent',
              borderImage: 'linear-gradient(135deg, rgba(139, 90, 43, 0.4), rgba(160, 120, 70, 0.2), rgba(139, 90, 43, 0.4)) 1',
              boxShadow: 'inset 0 0 20px rgba(100, 60, 30, 0.2)',
            }}
          />

          {/* Corner aging effects */}
          <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-amber-900/20 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-900/15 to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-amber-900/15 to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-amber-900/20 to-transparent pointer-events-none z-10" />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
            style={{
              filter: 'sepia(15%) saturate(90%)',
            }}
          />

          {/* Zoom indicator */}
          <div className="absolute top-3 right-3 p-2 rounded-sm bg-amber-950/60 text-amber-100 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <ZoomIn className="h-4 w-4" />
          </div>

          {/* Bottom gradient for caption readability */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-amber-950/70 to-transparent pointer-events-none" />
        </div>

        {/* Caption - manuscript style */}
        {(caption || credit) && (
          <figcaption className="mt-4 px-2">
            {caption && (
              <p className="font-serif text-amber-900 dark:text-amber-200 italic leading-relaxed">
                {caption}
              </p>
            )}
            {credit && (
              <p className="text-xs text-amber-700/70 dark:text-amber-400/70 mt-2 font-mono tracking-wide">
                {credit}
              </p>
            )}
          </figcaption>
        )}
      </figure>

      {/* Lightbox */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(30, 20, 10, 0.95), rgba(15, 10, 5, 0.98))',
          }}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-sm bg-amber-100/10 text-amber-100 hover:bg-amber-100/20 transition-colors z-10"
            onClick={() => setIsZoomed(false)}
          >
            <X className="h-6 w-6" />
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[85vh] object-contain rounded-sm"
            style={{
              boxShadow: '0 0 60px rgba(139, 90, 43, 0.3)',
            }}
          />

          {caption && (
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-amber-100/90 text-lg font-serif italic">{caption}</p>
              {credit && <p className="text-amber-200/60 text-sm mt-1 font-mono">{credit}</p>}
            </div>
          )}
        </div>
      )}
    </>
  );
}
