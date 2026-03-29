"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles } from "lucide-react";
import { AskAboutSelection } from "./AskAboutSelection";

interface SelectionToolbarProps {
  chapterTitle: string;
}

export function SelectionToolbar({ chapterTitle }: SelectionToolbarProps) {
  const [selectedText, setSelectedText] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 });
  const [showSheet, setShowSheet] = useState(false);
  const [lockedText, setLockedText] = useState("");

  const handleSelectionChange = useCallback(() => {
    // Don't update selection while the sheet is open
    if (showSheet) return;

    const selection = window.getSelection();
    const text = selection?.toString().trim() || "";

    if (text.length > 3) {
      setSelectedText(text);

      // Position the button above the selection
      const range = selection?.getRangeAt(0);
      if (range) {
        const rect = range.getBoundingClientRect();
        setButtonPos({
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });
      }
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [showSheet]);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [handleSelectionChange]);

  // Hide button on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!showSheet) {
        setShowButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showSheet]);

  const handleAskAI = () => {
    setLockedText(selectedText);
    setShowSheet(true);
    setShowButton(false);
    // Clear the selection
    window.getSelection()?.removeAllRanges();
  };

  const handleClose = () => {
    setShowSheet(false);
    setLockedText("");
  };

  return (
    <>
      {/* Floating "Ask AI" button near selection */}
      {showButton && !showSheet && (
        <div
          className="fixed z-40 animate-in fade-in zoom-in-95 duration-150"
          style={{
            left: `${Math.min(Math.max(buttonPos.x - 55, 10), window.innerWidth - 120)}px`,
            top: `${Math.max(buttonPos.y - 44, 10)}px`,
          }}
        >
          <button
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent losing selection
              handleAskAI();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-600 text-white shadow-lg shadow-black/40 hover:bg-emerald-500 active:scale-95 transition-all text-sm font-medium"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Ask Wes
          </button>
        </div>
      )}

      {/* Bottom sheet */}
      {showSheet && lockedText && (
        <AskAboutSelection
          selectedText={lockedText}
          chapterTitle={chapterTitle}
          onClose={handleClose}
        />
      )}
    </>
  );
}
