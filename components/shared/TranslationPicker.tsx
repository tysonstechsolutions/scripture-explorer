"use client";

import { usePreferences } from "@/contexts/PreferencesContext";
import { Button } from "@/components/ui/button";
import { TRANSLATIONS } from "@/lib/bible/translations";

interface TranslationPickerProps {
  showLabel?: boolean;
  className?: string;
}

export function TranslationPicker({ showLabel = true, className = "" }: TranslationPickerProps) {
  const { preferences, setTranslation } = usePreferences();

  return (
    <div className={`space-y-3 ${className}`}>
      {showLabel && (
        <label className="text-body font-medium">Bible Translation</label>
      )}
      <div className="grid grid-cols-2 gap-2">
        {TRANSLATIONS.map((translation) => (
          <Button
            key={translation.id}
            variant={preferences.translation === translation.id ? "default" : "outline"}
            className="min-h-12 flex flex-col items-start p-3 h-auto"
            onClick={() => setTranslation(translation.id)}
          >
            <span className="font-semibold">{translation.abbreviation}</span>
            <span className="text-xs opacity-80 text-left">{translation.description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
