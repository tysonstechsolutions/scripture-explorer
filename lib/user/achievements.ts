import type { Achievement, UserData } from "./types";

interface AchievementDef extends Omit<Achievement, "unlockedAt" | "progress"> {
  checkProgress: (data: UserData) => number;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // Reading Achievements
  {
    id: "first-chapter",
    name: "First Steps",
    description: "Read your first chapter",
    icon: "📖",
    target: 1,
    checkProgress: (data) => data.streak.totalChaptersRead,
  },
  {
    id: "ten-chapters",
    name: "Getting Started",
    description: "Read 10 chapters",
    icon: "📚",
    target: 10,
    checkProgress: (data) => data.streak.totalChaptersRead,
  },
  {
    id: "fifty-chapters",
    name: "Dedicated Reader",
    description: "Read 50 chapters",
    icon: "🏆",
    target: 50,
    checkProgress: (data) => data.streak.totalChaptersRead,
  },
  {
    id: "hundred-chapters",
    name: "Century Club",
    description: "Read 100 chapters",
    icon: "💯",
    target: 100,
    checkProgress: (data) => data.streak.totalChaptersRead,
  },

  // Streak Achievements
  {
    id: "streak-3",
    name: "Consistent",
    description: "Read 3 days in a row",
    icon: "🔥",
    target: 3,
    checkProgress: (data) => data.streak.currentStreak,
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Read 7 days in a row",
    icon: "⚡",
    target: 7,
    checkProgress: (data) => data.streak.currentStreak,
  },
  {
    id: "streak-30",
    name: "Monthly Master",
    description: "Read 30 days in a row",
    icon: "🌟",
    target: 30,
    checkProgress: (data) => data.streak.currentStreak,
  },
  {
    id: "streak-100",
    name: "Unstoppable",
    description: "Read 100 days in a row",
    icon: "👑",
    target: 100,
    checkProgress: (data) => data.streak.longestStreak,
  },

  // Bookmark Achievements
  {
    id: "first-bookmark",
    name: "Marker",
    description: "Save your first bookmark",
    icon: "🔖",
    target: 1,
    checkProgress: (data) => data.bookmarks.length,
  },
  {
    id: "ten-bookmarks",
    name: "Collector",
    description: "Save 10 bookmarks",
    icon: "📑",
    target: 10,
    checkProgress: (data) => data.bookmarks.length,
  },

  // Highlight Achievements
  {
    id: "first-highlight",
    name: "Highlighter",
    description: "Highlight your first verse",
    icon: "🖍️",
    target: 1,
    checkProgress: (data) => data.highlights.length,
  },
  {
    id: "colorful",
    name: "Colorful Study",
    description: "Use all 5 highlight colors",
    icon: "🌈",
    target: 5,
    checkProgress: (data) => {
      const colors = new Set(data.highlights.map((h) => h.color));
      return colors.size;
    },
  },

  // Note Achievements
  {
    id: "first-note",
    name: "Scholar",
    description: "Write your first note",
    icon: "✏️",
    target: 1,
    checkProgress: (data) => data.notes.length,
  },
  {
    id: "ten-notes",
    name: "Deep Thinker",
    description: "Write 10 notes",
    icon: "📝",
    target: 10,
    checkProgress: (data) => data.notes.length,
  },

  // Memory Verse Achievements
  {
    id: "first-memory",
    name: "Memorizer",
    description: "Add your first memory verse",
    icon: "🧠",
    target: 1,
    checkProgress: (data) => data.memoryVerses.length,
  },
  {
    id: "memory-master",
    name: "Scripture Memory Master",
    description: "Have 10 verses at level 5",
    icon: "🎓",
    target: 10,
    checkProgress: (data) => data.memoryVerses.filter((v) => v.level >= 5).length,
  },

  // Prayer Achievements
  {
    id: "first-prayer",
    name: "Prayer Warrior",
    description: "Add your first prayer request",
    icon: "🙏",
    target: 1,
    checkProgress: (data) => data.prayerRequests.length,
  },
  {
    id: "answered-prayer",
    name: "Faithful Witness",
    description: "Record an answered prayer",
    icon: "✨",
    target: 1,
    checkProgress: (data) => data.prayerRequests.filter((p) => p.answeredAt).length,
  },
];

export function getUnlockedAchievements(achievements: Achievement[]): Achievement[] {
  return achievements.filter((a) => a.unlockedAt);
}

export function getInProgressAchievements(achievements: Achievement[]): Achievement[] {
  return achievements.filter((a) => !a.unlockedAt && (a.progress || 0) > 0);
}
