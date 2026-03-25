"use client";

import { usePreferences } from "@/contexts/PreferencesContext";
import type { TextSize } from "@/lib/supabase/types";

const TEXT_SIZE_LABELS: Record<TextSize, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
  xlarge: "Extra Large",
};

const TEXT_SIZE_VALUES: TextSize[] = ["small", "medium", "large", "xlarge"];

export function useTextSize() {
  const { preferences, setTextSize } = usePreferences();

  return {
    textSize: preferences.textSize,
    setTextSize,
    textSizeLabel: TEXT_SIZE_LABELS[preferences.textSize],
    textSizeOptions: TEXT_SIZE_VALUES.map((value) => ({
      value,
      label: TEXT_SIZE_LABELS[value],
    })),
  };
}
