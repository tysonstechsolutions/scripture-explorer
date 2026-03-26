"use client";

import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { ScriptureHelper } from "@/components/shared/ScriptureHelper";
import { DailyKnowledge } from "@/components/shared/DailyKnowledge";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen pb-20">
      {children}
      <DailyKnowledge />
      <ScriptureHelper />
      <BottomNav />
    </div>
  );
}
