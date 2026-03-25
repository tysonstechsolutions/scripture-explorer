"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function Header({ title, showBack = false, rightAction }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-parchment-100/95 dark:bg-gray-900/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              className="min-h-tap min-w-tap"
              onClick={() => router.back()}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Go back</span>
            </Button>
          )}
          <h1 className="text-lg font-serif font-semibold text-leather-700 dark:text-parchment-100 truncate">
            {title}
          </h1>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
}
