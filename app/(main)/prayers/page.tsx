"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useUserData } from "@/contexts/UserDataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Heart,
  Plus,
  Check,
  X,
  Sparkles,
  Clock,
  Trash2,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "add" | "answer";

export default function PrayerWallPage() {
  const { userData, addPrayerRequest, markPrayerAnswered, removePrayerRequest } = useUserData();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filter, setFilter] = useState<"active" | "answered">("active");
  const [newPrayer, setNewPrayer] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");

  const activeRequests = userData.prayerRequests.filter((p) => !p.answeredAt);
  const answeredRequests = userData.prayerRequests.filter((p) => p.answeredAt);
  const displayedRequests = filter === "active" ? activeRequests : answeredRequests;

  const handleAddPrayer = () => {
    if (newPrayer.trim()) {
      addPrayerRequest(newPrayer.trim(), isPrivate);
      setNewPrayer("");
      setIsPrivate(false);
      setViewMode("list");
    }
  };

  const handleMarkAnswered = (id: string) => {
    setAnsweringId(id);
    setAnswerText("");
    setViewMode("answer");
  };

  const handleSaveAnswer = () => {
    if (answeringId) {
      markPrayerAnswered(answeringId, answerText.trim());
      setAnsweringId(null);
      setAnswerText("");
      setViewMode("list");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (viewMode === "add") {
    return (
      <>
        <Header title="New Prayer Request" showBack />
        <main className="p-4 max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label htmlFor="prayer">Prayer Request</Label>
                <Textarea
                  id="prayer"
                  placeholder="Share what's on your heart..."
                  value={newPrayer}
                  onChange={(e) => setNewPrayer(e.target.value)}
                  className="min-h-[150px] mt-2"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    id="private"
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                  />
                  <Label htmlFor="private" className="flex items-center gap-1">
                    <Lock className="h-4 w-4" />
                    Private
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isPrivate ? "Only you can see this" : "Visible on the prayer wall"}
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => setViewMode("list")}>
                  Cancel
                </Button>
                <Button onClick={handleAddPrayer} disabled={!newPrayer.trim()}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Prayer
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  if (viewMode === "answer" && answeringId) {
    const prayer = userData.prayerRequests.find((p) => p.id === answeringId);

    return (
      <>
        <Header title="Answered Prayer" showBack />
        <main className="p-4 max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm font-medium mb-1">Original Request:</p>
                <p className="text-sm text-muted-foreground">{prayer?.content}</p>
              </div>

              <div>
                <Label htmlFor="answer">How was this prayer answered?</Label>
                <Textarea
                  id="answer"
                  placeholder="Share how God answered this prayer..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  className="min-h-[120px] mt-2"
                  autoFocus
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => setViewMode("list")}>
                  Cancel
                </Button>
                <Button onClick={handleSaveAnswer}>
                  <Sparkles className="h-4 w-4 mr-1" />
                  Mark Answered
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Prayer Wall" showBack />
      <main className="p-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <Button
              variant={filter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("active")}
            >
              <Clock className="h-4 w-4 mr-1" />
              Active ({activeRequests.length})
            </Button>
            <Button
              variant={filter === "answered" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("answered")}
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Answered ({answeredRequests.length})
            </Button>
          </div>
          <Button onClick={() => setViewMode("add")}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        {displayedRequests.length === 0 ? (
          <Card className="animate-fade-in">
            <CardContent className="p-8 text-center">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">
                {filter === "active" ? "No Active Prayers" : "No Answered Prayers Yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {filter === "active"
                  ? "Add your prayer requests and watch how God works."
                  : "When prayers are answered, mark them here to celebrate God's faithfulness."}
              </p>
              {filter === "active" && (
                <>
                  <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">
                    &ldquo;Cast all your anxiety on him because he cares for you.&rdquo; — 1 Peter 5:7
                  </p>
                  <Button onClick={() => setViewMode("add")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Prayer Request
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {displayedRequests.map((prayer, index) => (
              <Card
                key={prayer.id}
                className={cn(
                  "card-hover animate-fade-in",
                  prayer.answeredAt && "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {prayer.isPrivate && (
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            Private
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(prayer.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">{prayer.content}</p>

                      {prayer.answeredAt && prayer.answer && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <div className="flex items-center gap-1 text-green-700 text-xs font-medium mb-1">
                            <Sparkles className="h-3 w-3" />
                            Answered {formatDate(prayer.answeredAt)}
                          </div>
                          <p className="text-sm text-green-800">{prayer.answer}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      {!prayer.answeredAt && (
                        <Button
                          variant="ghost"
                          size="icon-touch"
                          onClick={() => handleMarkAnswered(prayer.id)}
                          aria-label="Mark as answered"
                        >
                          <Check className="text-green-600" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-touch"
                        aria-label="Delete prayer request"
                        onClick={() => {
                          if (confirm("Delete this prayer request?")) {
                            removePrayerRequest(prayer.id);
                          }
                        }}
                      >
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
