"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Sparkles, Send, Loader2, BookOpen } from "lucide-react";

interface AskAboutSelectionProps {
  selectedText: string;
  chapterTitle: string;
  onClose: () => void;
}

export function AskAboutSelection({ selectedText, chapterTitle, onClose }: AskAboutSelectionProps) {
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [followUp, setFollowUp] = useState("");
  const [conversation, setConversation] = useState<{ role: string; content: string }[]>([]);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Stream initial response
  useEffect(() => {
    let cancelled = false;

    async function askAI() {
      const userMessage = `I'm reading "${chapterTitle}" in Scripture Explorer and I highlighted the following passage. Help me understand it better — explain what it means, why it matters, and any historical or theological context that would help:\n\n"${selectedText}"`;

      const messages = [{ role: "user", content: userMessage }];

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages, lens: "historical" }),
        });

        if (!res.ok) throw new Error("Failed to get response");

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done || cancelled) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullText += parsed.text;
                  if (!cancelled) setResponse(fullText);
                }
              } catch {
                // skip malformed JSON
              }
            }
          }
        }

        if (!cancelled) {
          setConversation([
            { role: "user", content: userMessage },
            { role: "assistant", content: fullText },
          ]);
          setIsLoading(false);
          setShowContinuePrompt(true);
        }
      } catch (error) {
        console.error("AI error:", error);
        if (!cancelled) {
          setResponse("Sorry, I couldn't get a response right now. Please try again.");
          setIsLoading(false);
          setShowContinuePrompt(true);
        }
      }
    }

    askAI();
    return () => { cancelled = true; };
  }, [selectedText, chapterTitle]);

  // Auto-scroll response
  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response, conversation, showContinuePrompt]);

  // Handle follow-up question
  const handleFollowUp = useCallback(async () => {
    if (isFollowUpLoading) return;

    const userMessage = followUp.trim();
    if (!userMessage) return;

    // Check if user wants to continue reading
    const continuePatterns = /^(continue|continue the story|keep reading|go back|back to story|close|done|yes|yeah|yep|sure|ok|okay)$/i;
    if (continuePatterns.test(userMessage)) {
      onClose();
      return;
    }

    setFollowUp("");
    setIsFollowUpLoading(true);
    setShowContinuePrompt(false);

    const newConversation = [
      ...conversation,
      { role: "user", content: userMessage },
    ];
    setConversation(newConversation);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newConversation, lens: "historical" }),
      });

      if (!res.ok) throw new Error("Failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                // Update the last assistant message
                setConversation(prev => {
                  const updated = [...prev];
                  const lastIdx = updated.length - 1;
                  if (lastIdx >= 0 && updated[lastIdx].role === "assistant") {
                    updated[lastIdx] = { role: "assistant", content: fullText };
                  } else {
                    updated.push({ role: "assistant", content: fullText });
                  }
                  return updated;
                });
              }
            } catch {
              // skip
            }
          }
        }
      }

      setIsFollowUpLoading(false);
      setShowContinuePrompt(true);
    } catch {
      setIsFollowUpLoading(false);
      setShowContinuePrompt(true);
    }
  }, [followUp, conversation, isFollowUpLoading, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="bg-white dark:bg-stone-900 rounded-t-2xl shadow-2xl max-h-[75vh] flex flex-col border-t border-amber-200 dark:border-amber-800">
          {/* Handle + Header */}
          <div className="flex-shrink-0 pt-3 pb-2 px-4">
            <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-stone-700 mx-auto mb-3" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40">
                  <Sparkles className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                </div>
                <span className="font-semibold text-stone-800 dark:text-stone-200 text-sm">
                  Ask about this passage
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="h-5 w-5 text-stone-500" />
              </button>
            </div>
          </div>

          {/* Selected Text */}
          <div className="flex-shrink-0 mx-4 mb-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40">
            <p className="text-sm text-amber-900 dark:text-amber-200 italic line-clamp-3 font-serif">
              &ldquo;{selectedText}&rdquo;
            </p>
          </div>

          {/* Response Area */}
          <div
            ref={responseRef}
            className="flex-1 overflow-y-auto px-4 pb-3 min-h-0"
          >
            {/* Initial response */}
            {response && (
              <div className="prose prose-sm dark:prose-invert prose-amber max-w-none">
                <div className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {response}
                </div>
              </div>
            )}

            {/* Follow-up messages */}
            {conversation.slice(2).map((msg, idx) => (
              <div key={idx} className={`mt-4 ${msg.role === "user" ? "text-right" : ""}`}>
                {msg.role === "user" ? (
                  <div className="inline-block px-3 py-2 rounded-lg bg-amber-600 text-white text-sm max-w-[85%] text-left">
                    {msg.content}
                  </div>
                ) : (
                  <div className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>
                )}
              </div>
            ))}

            {/* Loading states */}
            {(isLoading || isFollowUpLoading) && (
              <div className="flex items-center gap-2 py-3 text-amber-700 dark:text-amber-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            )}

            {/* Continue reading prompt */}
            {showContinuePrompt && !isFollowUpLoading && (
              <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800">
                <p className="text-sm text-stone-500 dark:text-stone-400 mb-3">
                  Want to keep exploring, or continue the story?
                </p>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-700 text-white hover:bg-amber-800 active:scale-[0.98] transition-all text-sm font-medium w-full justify-center"
                >
                  <BookOpen className="h-4 w-4" />
                  Continue Reading
                </button>
              </div>
            )}
          </div>

          {/* Follow-up Input */}
          {!isLoading && (
            <div className="flex-shrink-0 p-3 border-t border-stone-200 dark:border-stone-800 safe-area-pb">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleFollowUp();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  placeholder='Ask more, or type "continue"...'
                  className="flex-1 px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  disabled={isFollowUpLoading}
                />
                <button
                  type="submit"
                  disabled={!followUp.trim() || isFollowUpLoading}
                  className="p-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
