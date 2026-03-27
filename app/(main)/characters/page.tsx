"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ChevronRight,
  BookOpen,
  Calendar,
  Heart,
  Link2,
  ArrowLeft,
} from "lucide-react";
import { BIBLE_CHARACTERS, getCharacterById } from "@/lib/study/characters";
import type { BibleCharacter } from "@/lib/study/characters";

type ViewMode = "list" | "detail";

export default function CharactersPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedCharacter = selectedId ? getCharacterById(selectedId) : null;

  const handleSelectCharacter = (id: string) => {
    setSelectedId(id);
    setViewMode("detail");
  };

  if (viewMode === "detail" && selectedCharacter) {
    return (
      <>
        <Header title={selectedCharacter.name} showBack />
        <main className="p-4 max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("list")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            All Characters
          </Button>

          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="text-2xl font-bold mb-1">{selectedCharacter.name}</div>
              <div className="text-lg text-primary font-medium">
                {selectedCharacter.title}
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {selectedCharacter.timeline}
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Biography</h3>
                <p className="text-sm leading-relaxed">
                  {selectedCharacter.description}
                </p>
              </CardContent>
            </Card>

            {/* Significance */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Biblical Significance</h3>
                <p className="text-sm leading-relaxed">
                  {selectedCharacter.significance}
                </p>
              </CardContent>
            </Card>

            {/* Key Verses */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Key Verses
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCharacter.keyVerses.map((verse) => (
                    <Badge key={verse} variant="secondary">
                      {verse}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Lessons */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  Life Lessons
                </h3>
                <ul className="space-y-2">
                  {selectedCharacter.lessons.map((lesson, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-primary font-bold">{i + 1}.</span>
                      {lesson}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Related Characters */}
            {selectedCharacter.relatedCharacters.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-primary" />
                    Related People
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCharacter.relatedCharacters.map((relatedId) => {
                      const related = getCharacterById(relatedId);
                      if (!related) return null;
                      return (
                        <Button
                          key={relatedId}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectCharacter(relatedId)}
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
      <Header title="Bible Characters" showBack />
      <main className="p-4 max-w-2xl mx-auto">
        <div className="text-sm text-muted-foreground mb-4">
          Explore the lives of key figures in Scripture
        </div>

        <div className="space-y-3">
          {BIBLE_CHARACTERS.map((character) => (
            <Card
              key={character.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSelectCharacter(character.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{character.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {character.title}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
