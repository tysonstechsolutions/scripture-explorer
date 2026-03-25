"use client";

import { Header } from "@/components/layout/Header";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function AskPage() {
  const { preferences } = usePreferences();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <Header title="Ask AI" />
      <main className="flex-1 p-4 pb-20 overflow-hidden">
        <ChatInterface lens={preferences.defaultLens || "historical"} />
      </main>
    </div>
  );
}
