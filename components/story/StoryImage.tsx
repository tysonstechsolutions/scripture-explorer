// components/story/StoryImage.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
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

  const layoutClasses = {
    'full': 'w-full my-10',
    'float-left': 'float-left mr-8 mb-4 w-1/2 max-w-sm',
    'float-right': 'float-right ml-8 mb-4 w-1/2 max-w-sm',
    'inline': 'w-full max-w-md mx-auto my-8',
  };

  return (
    <>
      <figure className={`relative ${layoutClasses[layout]}`}>
        {/* Image Container */}
        <div
          className="relative overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-800 cursor-zoom-in group"
          onClick={() => setIsZoomed(true)}
        >
          {/* Decorative frame */}
          <div className="absolute inset-0 border-4 border-amber-100/50 dark:border-amber-900/30 rounded-xl pointer-events-none z-10" />

          <div className="relative aspect-[4/3] w-full">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>

          {/* Zoom indicator */}
          <div className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <ZoomIn className="h-4 w-4" />
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>

        {/* Caption */}
        {(caption || credit) && (
          <figcaption className="mt-3 text-sm text-stone-600 dark:text-stone-400">
            {caption && <p className="font-medium">{caption}</p>}
            {credit && <p className="text-xs text-stone-400 dark:text-stone-500 mt-1 italic">{credit}</p>}
          </figcaption>
        )}
      </figure>

      {/* Lightbox */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            onClick={() => setIsZoomed(false)}
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {caption && (
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-white/90 text-lg">{caption}</p>
              {credit && <p className="text-white/60 text-sm mt-1">{credit}</p>}
            </div>
          )}
        </div>
      )}
    </>
  );
}
