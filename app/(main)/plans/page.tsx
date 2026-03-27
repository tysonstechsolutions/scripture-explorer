"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useUserData } from "@/contexts/UserDataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Calendar,
  Check,
  ChevronRight,
  Play,
  Target,
} from "lucide-react";
import Link from "next/link";
import { READING_PLANS, getReadingPlanById } from "@/lib/reading-plans/plans";
import { getBookById, getBookSlug } from "@/lib/bible/books";
import { cn } from "@/lib/utils";

type ViewMode = "browse" | "active" | "details";

export default function ReadingPlansPage() {
  const { userData, startReadingPlan, completeReadingDay, getActiveReadingPlans } = useUserData();
  const [viewMode, setViewMode] = useState<ViewMode>("browse");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const activePlans = getActiveReadingPlans();
  const selectedPlan = selectedPlanId ? getReadingPlanById(selectedPlanId) : null;
  const activeUserPlan = selectedPlanId
    ? activePlans.find((p) => p.planId === selectedPlanId)
    : null;

  const handleStartPlan = (planId: string) => {
    startReadingPlan(planId);
    setSelectedPlanId(planId);
    setViewMode("details");
  };

  const handleCompleteDay = (planId: string, day: number) => {
    completeReadingDay(planId, day);
  };

  const getPassageLink = (bookId: string, chapter: number) => {
    return `/read/${getBookSlug(bookId)}/${chapter}`;
  };

  const getPassageLabel = (bookId: string, chapter: number) => {
    const book = getBookById(bookId);
    return `${book?.name || bookId} ${chapter}`;
  };

  if (viewMode === "details" && selectedPlan) {
    const userPlan = userData.activeReadingPlans.find((p) => p.planId === selectedPlan.id);
    const completedDays = userPlan?.completedDays || [];
    const progress = (completedDays.length / selectedPlan.duration) * 100;

    return (
      <>
        <Header title={selectedPlan.name} showBack />
        <main className="p-4 max-w-2xl mx-auto">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">
                  {completedDays.length} / {selectedPlan.duration} days
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>

          <div className="space-y-3">
            {selectedPlan.readings.map((reading) => {
              const isCompleted = completedDays.includes(reading.day);
              const isCurrent = userPlan?.currentDay === reading.day;

              return (
                <Card
                  key={reading.day}
                  className={cn(
                    isCompleted && "bg-green-50 border-green-200",
                    isCurrent && !isCompleted && "border-primary"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                            isCompleted
                              ? "bg-green-500 text-white"
                              : isCurrent
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                          )}
                        >
                          {isCompleted ? <Check className="h-4 w-4" /> : reading.day}
                        </div>
                        <div>
                          <div className="font-medium">Day {reading.day}</div>
                          <div className="text-sm text-muted-foreground">
                            {reading.passages
                              .map((p) => getPassageLabel(p.bookId, p.chapter))
                              .join(", ")}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {reading.passages.map((p, i) => (
                          <Link
                            key={i}
                            href={getPassageLink(p.bookId, p.chapter)}
                            className="text-primary text-sm hover:underline"
                          >
                            Read
                          </Link>
                        ))}
                        {!isCompleted && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCompleteDay(selectedPlan.id, reading.day)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => setViewMode("browse")}>
              Back to Plans
            </Button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Reading Plans" showBack />
      <main className="p-4 max-w-2xl mx-auto">
        {/* Active Plans */}
        {activePlans.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Your Active Plans
            </h2>
            <div className="space-y-3">
              {activePlans.map((userPlan) => {
                const plan = getReadingPlanById(userPlan.planId);
                if (!plan) return null;

                const progress = (userPlan.completedDays.length / plan.duration) * 100;

                return (
                  <Card
                    key={userPlan.planId}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setSelectedPlanId(userPlan.planId);
                      setViewMode("details");
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{plan.name}</div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Progress value={progress} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Day {userPlan.currentDay} of {plan.duration}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Browse Plans */}
        <div>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Available Plans
          </h2>
          <div className="space-y-3">
            {READING_PLANS.filter(
              (plan) => !activePlans.find((ap) => ap.planId === plan.id)
            ).map((plan) => (
              <Card key={plan.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{plan.name}</div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {plan.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {plan.duration} days
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleStartPlan(plan.id)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {READING_PLANS.length === 0 && activePlans.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No Reading Plans</h3>
              <p className="text-muted-foreground">
                Reading plans help you stay consistent in your Bible study.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
