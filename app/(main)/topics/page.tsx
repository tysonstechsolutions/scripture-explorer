"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookMarked,
  ChevronRight,
  ArrowLeft,
  Link2,
} from "lucide-react";
import { BIBLE_TOPICS, getTopicById } from "@/lib/study/topics";

type ViewMode = "list" | "detail";

export default function TopicsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedTopic = selectedId ? getTopicById(selectedId) : null;

  const handleSelectTopic = (id: string) => {
    setSelectedId(id);
    setViewMode("detail");
  };

  if (viewMode === "detail" && selectedTopic) {
    return (
      <>
        <Header title={selectedTopic.name} showBack />
        <main className="p-4 max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("list")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            All Topics
          </Button>

          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="text-2xl font-bold mb-2">{selectedTopic.name}</div>
              <p className="text-muted-foreground">{selectedTopic.description}</p>
            </div>

            {/* Verses */}
            <div>
              <h3 className="font-semibold mb-3">Key Verses</h3>
              <div className="space-y-3">
                {selectedTopic.verses.map((verse, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="font-medium text-primary mb-2">
                        {verse.reference}
                      </div>
                      <p className="text-sm leading-relaxed italic">
                        &ldquo;{verse.text}&rdquo;
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Related Topics */}
            {selectedTopic.relatedTopics.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-primary" />
                    Related Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTopic.relatedTopics.map((relatedId) => {
                      const related = getTopicById(relatedId);
                      if (!related) return null;
                      return (
                        <Button
                          key={relatedId}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectTopic(relatedId)}
                        >
                          {related.name}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Topical Index" showBack />
      <main className="p-4 max-w-2xl mx-auto">
        <div className="text-sm text-muted-foreground mb-4">
          Explore what Scripture says about important topics
        </div>

        <div className="grid grid-cols-2 gap-3">
          {BIBLE_TOPICS.map((topic) => (
            <Card
              key={topic.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSelectTopic(topic.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{topic.name}</div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {topic.verses.length} verses
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
