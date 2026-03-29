"use client";

import { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";

const STORAGE_KEY = "scripture-explorer-highlight-hint-dismissed";

export function HighlightHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if not previously dismissed
    try {
      const dismissed = window.localStorage.getItem(STORAGE_KEY);
      if (!dismissed) {
        // Small delay so it animates in after page load
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage not available, show anyway
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
  };

  if (!visible) return null;

  return (
    <div className="mb-10 animate-fade-in">
      <div className="relative flex items-start gap-3 p-4 rounded-lg bg-emerald-900/20 border border-emerald-700/30">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-8 h-8 rounded-full bg-emerald-900/40 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-emerald-300 mb-1">
            Meet Wes Tament
          </p>
          <p className="text-sm text-[#D5C4AF] leading-relaxed">
            Highlight any passage while reading and tap <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-700 text-white text-xs font-medium align-middle"><Sparkles className="h-3 w-3" />Ask Wes</span> to discuss it with an apologetics scholar. He&apos;ll give you the evidence, the context, and a few opinions.
          </p>
        </div>
        <button
          onClick={dismiss}
          className="flex-shrink-0 p-1 rounded-full hover:bg-[#332A21] transition-colors"
          aria-label="Dismiss hint"
        >
          <X className="h-4 w-4 text-[#6B5D4F]" />
        </button>
      </div>
    </div>
  );
}
