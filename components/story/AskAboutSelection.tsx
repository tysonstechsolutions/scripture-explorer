"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Send, Loader2, BookOpen } from "lucide-react";

interface AskAboutSelectionProps {
  selectedText: string;
  chapterTitle: string;
  onClose: () => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function AskAboutSelection({ selectedText, chapterTitle, onClose }: AskAboutSelectionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showContinuePrompt]);

  // Focus input when not streaming
  useEffect(() => {
    if (initialLoadDone && !isStreaming) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [initialLoadDone, isStreaming]);

  // Helper to stream from the API
  const streamResponse = useCallback(async (apiMessages: ChatMessage[]): Promise<string> => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: apiMessages, lens: "historical" }),
    });

    if (!res.ok) throw new Error("Failed to get response");

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
              setMessages(prev => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                if (lastIdx >= 0 && updated[lastIdx].role === "assistant") {
                  updated[lastIdx] = { role: "assistant", content: fullText };
                }
                return updated;
              });
            }
          } catch {
            // skip malformed JSON
          }
        }
      }
    }

    return fullText;
  }, []);

  // Send initial question on mount
  useEffect(() => {
    let cancelled = false;

    async function askInitial() {
      const userMsg: ChatMessage = {
        role: "user",
        content: `What does this mean?\n\n"${selectedText}"`,
      };

      const apiMsg: ChatMessage = {
        role: "user",
        content: `I'm reading "${chapterTitle}" in Scripture Explorer and I highlighted the following passage. Help me understand it better — explain what it means, why it matters, and any historical or theological context that would help:\n\n"${selectedText}"`,
      };

      setMessages([userMsg, { role: "assistant", content: "" }]);
      setIsStreaming(true);

      try {
        await streamResponse([apiMsg]);
        if (!cancelled) {
          setIsStreaming(false);
          setInitialLoadDone(true);
          setShowContinuePrompt(true);
        }
      } catch (error) {
        console.error("AI error:", error);
        if (!cancelled) {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: "Sorry, I couldn't get a response right now. Please try again.",
            };
            return updated;
          });
          setIsStreaming(false);
          setInitialLoadDone(true);
          setShowContinuePrompt(true);
        }
      }
    }

    askInitial();
    return () => { cancelled = true; };
  }, [selectedText, chapterTitle, streamResponse]);

  // Handle sending a follow-up
  const handleSend = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || isStreaming) return;

    const continuePatterns = /^(continue|continue the story|keep reading|go back|back to story|close|done|yes|yeah|yep|sure|ok|okay)$/i;
    if (continuePatterns.test(text)) {
      onClose();
      return;
    }

    setInputValue("");
    setShowContinuePrompt(false);
    setIsStreaming(true);

    const userMsg: ChatMessage = { role: "user", content: text };
    const newMessages = [...messages, userMsg, { role: "assistant" as const, content: "" }];
    setMessages(newMessages);

    const apiMessages = [...messages, userMsg];

    try {
      await streamResponse(apiMessages);
      setIsStreaming(false);
      setShowContinuePrompt(true);
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Try asking again.",
        };
        return updated;
      });
      setIsStreaming(false);
      setShowContinuePrompt(true);
    }
  }, [inputValue, isStreaming, messages, onClose, streamResponse]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 animate-in fade-in duration-200"
        onMouseDown={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Bottom Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[60] animate-in slide-in-from-bottom duration-300"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="bg-[#1C1612] rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col border-t border-[#3A3028]">
          {/* Handle + Header */}
          <div className="flex-shrink-0 pt-3 pb-2 px-4 border-b border-[#3A3028]">
            <div className="w-10 h-1 rounded-full bg-[#4A3F33] mx-auto mb-3" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-900/40 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-emerald-400 leading-none">WT</span>
                </div>
                <span className="font-semibold text-[#E8DCC8] text-sm">
                  Wes Tament
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#271F18] transition-colors"
              >
                <X className="h-5 w-5 text-[#8C7B68]" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "user" ? (
                  <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-md bg-emerald-700 text-white text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>
                ) : (
                  <div className="max-w-[90%] flex gap-2">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-7 h-7 rounded-full bg-emerald-900/40 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-emerald-400 leading-none">WT</span>
                      </div>
                    </div>
                    <div className="px-4 py-2.5 rounded-2xl rounded-bl-md bg-[#271F18] text-[#D5C4AF] text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content || (
                        <span className="flex items-center gap-2 text-[#8C7B68]">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Wes is thinking...
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Continue reading prompt */}
            {showContinuePrompt && !isStreaming && (
              <div className="flex justify-start">
                <div className="max-w-[90%] flex gap-2">
                  <div className="flex-shrink-0 mt-1 w-7" />
                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-700 text-white hover:bg-emerald-600 active:scale-[0.98] transition-all text-sm font-medium"
                  >
                    <BookOpen className="h-4 w-4" />
                    Continue Reading
                  </button>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 p-3 border-t border-[#3A3028] safe-area-pb bg-[#1C1612]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder='Ask Wes anything, or type "continue"...'
                className="flex-1 px-4 py-2.5 rounded-full border border-[#3A3028] bg-[#271F18] text-sm text-[#D5C4AF] placeholder-[#6B5D4F] focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30"
                disabled={isStreaming}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isStreaming}
                className="p-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
