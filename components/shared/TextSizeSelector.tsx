"use client";

import { useTextSize } from "@/hooks/useTextSize";
import { Button } from "@/components/ui/button";
import type { TextSize } from "@/lib/supabase/types";

interface TextSizeSelectorProps {
  showLabel?: boolean;
  className?: string;
}

export function TextSizeSelector({ showLabel = true, className = "" }: TextSizeSelectorProps) {
  const { textSize, setTextSize, textSizeOptions } = useTextSize();

  return (
    <div className={`space-y-3 ${className}`}>
      {showLabel && (
        <label className="text-body font-medium">Text Size</label>
      )}
      <div className="flex gap-2 flex-wrap">
        {textSizeOptions.map((option) => (
          <Button
            key={option.value}
            variant={textSize === option.value ? "default" : "outline"}
            className="min-h-12 min-w-12"
            onClick={() => setTextSize(option.value as TextSize)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      <p
        className="text-body text-muted-foreground mt-4 p-4 bg-card rounded-lg"
        style={{ fontSize: `calc(1rem * var(--text-multiplier, 1))` }}
      >
        Preview: This is how your text will appear throughout the app.
      </p>
    </div>
  );
}
