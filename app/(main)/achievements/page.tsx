"use client";

import { Header } from "@/components/layout/Header";
import { useUserData } from "@/contexts/UserDataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Trophy, BookOpen, Target, Calendar, Award } from "lucide-react";
import { getUnlockedAchievements, getInProgressAchievements } from "@/lib/user/achievements";
import { cn } from "@/lib/utils";

export default function AchievementsPage() {
  const { userData } = useUserData();
  const { streak, achievements } = userData;

  const unlockedAchievements = getUnlockedAchievements(achievements);
  const inProgressAchievements = getInProgressAchievements(achievements);
  const lockedAchievements = achievements.filter(
    (a) => !a.unlockedAt && (!a.progress || a.progress === 0)
  );

  return (
    <>
      <Header title="Achievements" showBack />
      <main className="p-4 max-w-2xl mx-auto">
        {/* Streak Stats */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-100 rounded-full">
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {streak.currentStreak}
                </div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex justify-center mb-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                </div>
                <div className="text-lg font-semibold">{streak.longestStreak}</div>
                <div className="text-xs text-muted-foreground">Best Streak</div>
              </div>
              <div>
                <div className="flex justify-center mb-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-lg font-semibold">{streak.totalChaptersRead}</div>
                <div className="text-xs text-muted-foreground">Chapters</div>
              </div>
              <div>
                <div className="flex justify-center mb-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-lg font-semibold">{streak.totalDaysRead}</div>
                <div className="text-xs text-muted-foreground">Days Read</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Summary */}
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Achievements</h2>
          <span className="text-sm text-muted-foreground ml-auto">
            {unlockedAchievements.length} / {achievements.length} unlocked
          </span>
        </div>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Unlocked
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {unlockedAchievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <div className="font-medium text-sm">{achievement.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {achievement.description}
                    </div>
                    {achievement.unlockedAt && (
                      <div className="text-xs text-amber-600 mt-2">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* In Progress */}
        {inProgressAchievements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              In Progress
            </h3>
            <div className="space-y-3">
              {inProgressAchievements.map((achievement) => {
                const progress = achievement.progress || 0;
                const target = achievement.target || 1;
                const percent = Math.min((progress / target) * 100, 100);

                return (
                  <Card key={achievement.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl opacity-60">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{achievement.name}</div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {achievement.description}
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={percent} className="h-2 flex-1" />
                            <span className="text-xs text-muted-foreground">
                              {progress}/{target}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Locked */}
        {lockedAchievements.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Locked
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {lockedAchievements.map((achievement) => (
                <Card key={achievement.id} className="bg-muted/30">
                  <CardContent className="p-4 text-center opacity-50">
                    <div className="text-3xl mb-2 grayscale">{achievement.icon}</div>
                    <div className="font-medium text-sm">{achievement.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {achievement.description}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
