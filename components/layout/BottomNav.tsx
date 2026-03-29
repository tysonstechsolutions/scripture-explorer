"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scroll, BookOpen, Settings } from "lucide-react";

const navItems = [
  { href: "/", label: "Story", icon: Scroll, exact: true },
  { href: "/read", label: "Bible", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1C1612] border-t border-[#3A3028] safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href || pathname.startsWith("/story")
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-h-tap min-w-tap px-3 py-2 transition-colors ${
                isActive
                  ? "text-emerald-400"
                  : "text-[#6B5D4F] hover:text-[#8C7B68]"
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
