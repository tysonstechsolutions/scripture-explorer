"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Book, Clock, MessageCircle, Sparkles } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";

const QUICK_ACTIONS = [
  {
    title: "Read the Bible",
    description: "Browse all 66 books from Genesis to Revelation",
    icon: Book,
    href: "/read",
    color: "bg-blue-500",
  },
  {
    title: "Timeline",
    description: "Explore 14 eras of biblical history",
    icon: Clock,
    href: "/timeline",
    color: "bg-amber-500",
  },
  {
    title: "Ask AI",
    description: "Get answers to your Bible questions",
    icon: MessageCircle,
    href: "/ask",
    color: "bg-green-500",
  },
  {
    title: "Topics",
    description: "Discover themes across Scripture",
    icon: Sparkles,
    href: "/library",
    color: "bg-purple-500",
  },
];

const DAILY_VERSES = [
  { reference: "John 3:16", text: "For God so loved the world..." },
  { reference: "Psalm 23:1", text: "The Lord is my shepherd..." },
  { reference: "Philippians 4:13", text: "I can do all things through Christ..." },
  { reference: "Romans 8:28", text: "All things work together for good..." },
  { reference: "Proverbs 3:5", text: "Trust in the Lord with all your heart..." },
];

export default function HomePage() {
  const router = useRouter();
  const { preferences } = usePreferences();

  useEffect(() => {
    if (!preferences.hasCompletedOnboarding) {
      router.replace("/onboarding");
    }
  }, [preferences.hasCompletedOnboarding, router]);

  if (!preferences.hasCompletedOnboarding) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-body text-muted-foreground">Loading...</div>
      </main>
    );
  }

  // Get a "daily" verse based on the day
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const dailyVerse = DAILY_VERSES[dayOfYear % DAILY_VERSES.length];

  return (
    <>
      <Header title="Scripture Explorer" />
      <main className="p-4 pb-24 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-6">
          <h2 className="text-2xl font-serif text-leather-700 dark:text-leather-300 mb-2">
            Welcome to Scripture Explorer
          </h2>
          <p className="text-muted-foreground">
            Your journey through the Bible starts here
          </p>
        </div>

        {/* Daily Verse */}
        <Card className="bg-gradient-to-br from-leather-50 to-leather-100 dark:from-leather-900 dark:to-leather-800 border-leather-200">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-leather-500 mb-2">
              Verse of the Day
            </p>
            <p className="text-lg font-serif text-leather-800 dark:text-leather-200 italic mb-2">
              &ldquo;{dailyVerse.text}&rdquo;
            </p>
            <p className="text-sm text-leather-600 dark:text-leather-400">
              — {dailyVerse.reference}
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Get Started
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className={`${action.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Start Guide */}
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold mb-3">How to Use This App</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="bg-leather-100 dark:bg-leather-800 text-leather-700 dark:text-leather-300 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <span>Tap <strong>Read</strong> to browse Bible books and chapters</span>
              </li>
              <li className="flex gap-2">
                <span className="bg-leather-100 dark:bg-leather-800 text-leather-700 dark:text-leather-300 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <span>Explore the <strong>Timeline</strong> to see biblical history</span>
              </li>
              <li className="flex gap-2">
                <span className="bg-leather-100 dark:bg-leather-800 text-leather-700 dark:text-leather-300 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <span>Ask <strong>AI</strong> any question about Scripture</span>
              </li>
              <li className="flex gap-2">
                <span className="bg-leather-100 dark:bg-leather-800 text-leather-700 dark:text-leather-300 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0">4</span>
                <span>Go to <strong>Settings</strong> to change translation or text size</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
