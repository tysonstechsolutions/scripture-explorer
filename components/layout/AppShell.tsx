"use client";

import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { ScriptureHelper } from "@/components/shared/ScriptureHelper";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen pb-20">
      {children}
      <ScriptureHelper />
      <BottomNav />
    </div>
  );
}
