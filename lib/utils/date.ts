/**
 * Format a date string for display
 * @param dateStr - ISO date string
 * @param style - 'short' for "Mar 25, 2024" or 'long' for "March 25, 2024"
 */
export function formatDate(dateStr: string, style: "short" | "long" = "short"): string {
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const options: Intl.DateTimeFormatOptions = {
    month: style === "short" ? "short" : "long",
    day: "numeric",
    year: "numeric",
  };

  return date.toLocaleDateString(undefined, options);
}

/**
 * Format a date relative to today (e.g., "Today", "Yesterday", "3 days ago")
 */
export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else {
    return formatDate(dateStr, "short");
  }
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Check if a date string is today
 */
export function isToday(dateStr: string): boolean {
  return dateStr === getToday();
}
