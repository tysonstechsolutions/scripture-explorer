"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Clock, Library, MessageCircle, User } from "lucide-react";

const navItems = [
  { href: "/read", label: "Read", icon: BookOpen },
  { href: "/timeline", label: "Timeline", icon: Clock },
  { href: "/library", label: "Library", icon: Library },
  { href: "/ask", label: "Ask", icon: MessageCircle },
  { href: "/profile", label: "Me", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-h-tap min-w-tap px-3 py-2 transition-colors ${
                isActive
                  ? "text-leather-600 dark:text-gold-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
