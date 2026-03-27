import { AppShell } from "@/components/layout/AppShell";
import { AdminProvider } from "@/contexts/AdminContext";
import { TopicProgressProvider } from "@/contexts/TopicProgressContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <TopicProgressProvider>
        <AppShell>{children}</AppShell>
      </TopicProgressProvider>
    </AdminProvider>
  );
}
