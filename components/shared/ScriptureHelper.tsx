"use client";

import { useState, useEffect } from "react";
import { X, Scroll, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Tip {
  title: string;
  message: string;
  action?: {
    label: string;
    href: string;
  };
}

const TIPS: Tip[] = [
  {
    title: "Welcome to Scripture Explorer!",
    message: "I'm Scrollie, your guide to exploring the Bible. Let me show you around!",
  },
  {
    title: "Read the Bible",
    message: "Tap the book icon below to browse all 66 books of the Bible. Pick any chapter to start reading!",
    action: { label: "Start Reading", href: "/read" },
  },
  {
    title: "Explore the Timeline",
    message: "Discover 14 eras of biblical history, from Creation to the Early Church. See how it all connects!",
    action: { label: "View Timeline", href: "/timeline" },
  },
  {
    title: "Ask Questions",
    message: "Got questions about Scripture? Ask me anything! I'm powered by AI to help you understand the Bible better.",
    action: { label: "Ask a Question", href: "/ask" },
  },
  {
    title: "Choose Your Translation",
    message: "Go to Settings to pick your preferred Bible translation: KJV, NIV, NLT, or NASB.",
    action: { label: "Settings", href: "/settings" },
  },
];

const STORAGE_KEY = "scripture-helper-dismissed";
const TIP_INDEX_KEY = "scripture-helper-tip-index";

export function ScriptureHelper() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setIsVisible(true);
      const savedIndex = localStorage.getItem(TIP_INDEX_KEY);
      if (savedIndex) {
        setCurrentTip(parseInt(savedIndex, 10));
      }
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  const handleNext = () => {
    const next = (currentTip + 1) % TIPS.length;
    setCurrentTip(next);
    localStorage.setItem(TIP_INDEX_KEY, next.toString());
  };

  const handlePrev = () => {
    const prev = currentTip === 0 ? TIPS.length - 1 : currentTip - 1;
    setCurrentTip(prev);
    localStorage.setItem(TIP_INDEX_KEY, prev.toString());
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isVisible) return null;

  const tip = TIPS[currentTip];

  if (isMinimized) {
    return (
      <button
        onClick={toggleMinimize}
        className="fixed bottom-24 right-4 z-50 bg-leather-600 text-white p-3 rounded-full shadow-lg hover:bg-leather-700 transition-all hover:scale-110 animate-bounce"
        aria-label="Open helper"
      >
        <Scroll className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 max-w-xs animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-leather-200 overflow-hidden">
        {/* Header with Scrollie */}
        <div className="bg-gradient-to-r from-leather-500 to-leather-600 p-3 flex items-center gap-3">
          <div className="bg-white rounded-full p-2">
            <Scroll className="h-6 w-6 text-leather-600" />
          </div>
          <span className="text-white font-semibold flex-1">Scrollie</span>
          <button
            onClick={toggleMinimize}
            className="text-white/80 hover:text-white p-1"
            aria-label="Minimize"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white p-1"
            aria-label="Dismiss helper"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-leather-700 dark:text-leather-300 mb-2">
            {tip.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {tip.message}
          </p>

          {tip.action && (
            <a href={tip.action.href}>
              <Button size="sm" className="w-full mb-3">
                {tip.action.label}
              </Button>
            </a>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2 border-t">
            <button
              onClick={handlePrev}
              className="p-1 text-muted-foreground hover:text-leather-600"
              aria-label="Previous tip"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-1">
              {TIPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentTip ? "bg-leather-500" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-1 text-muted-foreground hover:text-leather-600"
              aria-label="Next tip"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-3">
          <button
            onClick={handleDismiss}
            className="text-xs text-muted-foreground hover:text-leather-600 w-full text-center"
          >
            Don&apos;t show again
          </button>
        </div>
      </div>
    </div>
  );
}
