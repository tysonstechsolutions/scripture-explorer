import { Header } from "@/components/layout/Header";
import { EraCard } from "@/components/timeline/EraCard";
import { ERAS } from "@/lib/timeline/eras";

export default function TimelinePage() {
  return (
    <>
      <Header title="Timeline" />
      <main className="p-4 pb-24">
        <p className="text-body text-muted-foreground mb-6">
          Explore biblical history from Creation to the modern era. Tap any period to learn more.
        </p>
        <div className="space-y-3">
          {ERAS.map((era) => (
            <EraCard key={era.id} era={era} />
          ))}
        </div>
      </main>
    </>
  );
}
