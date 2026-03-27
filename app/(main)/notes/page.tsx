"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { useUserData } from "@/contexts/UserDataContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit2, Save, X, BookOpen, MessageSquare, GraduationCap } from "lucide-react";
import Link from "next/link";
import { getBookByApiId } from "@/lib/bible/books";
import { PILLAR_INFO, type Pillar, type TopicIndexEntry } from "@/lib/topics/types";

export default function NotesPage() {
  const { userData, updateNote, removeNote, getAllTopicNotes, updateTopicNote, removeTopicNote } = useUserData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [topicDetails, setTopicDetails] = useState<Record<string, TopicIndexEntry>>({});

  const sortedNotes = [...userData.notes].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const topicNotes = useMemo(
    () => getAllTopicNotes().sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ),
    [getAllTopicNotes]
  );

  // Group topic notes by topic
  const groupedTopicNotes = useMemo(() => {
    const groups: Record<string, typeof topicNotes> = {};
    for (const note of topicNotes) {
      if (!groups[note.topicSlug]) {
        groups[note.topicSlug] = [];
      }
      groups[note.topicSlug].push(note);
    }
    return groups;
  }, [topicNotes]);

  // Fetch topic details
  useEffect(() => {
    async function fetchTopicDetails() {
      const slugs = Object.keys(groupedTopicNotes);
      const details: Record<string, TopicIndexEntry> = {};
      for (const slug of slugs) {
        try {
          const res = await fetch(`/api/topics/${slug}`);
          if (res.ok) {
            const data = await res.json();
            details[slug] = {
              slug: data.topic.slug,
              title: data.topic.title,
              pillar: data.topic.pillar,
              status: data.topic.status,
              hook: data.topic.hook,
              updatedAt: data.topic.updatedAt,
            };
          }
        } catch (error) {
          console.error('Failed to fetch topic:', error);
        }
      }
      setTopicDetails(details);
    }

    if (Object.keys(groupedTopicNotes).length > 0) {
      fetchTopicDetails();
    }
  }, [groupedTopicNotes]);

  const handleEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const handleSave = (id: string, isTopicNote = false) => {
    if (editContent.trim()) {
      if (isTopicNote) {
        updateTopicNote(id, editContent);
      } else {
        updateNote(id, editContent);
      }
    }
    setEditingId(null);
    setEditContent("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleDeleteTopicNote = (id: string) => {
    if (confirm("Delete this note?")) {
      removeTopicNote(id);
    }
  };

  const getBookSlug = (bookId: string) => {
    const book = getBookByApiId(bookId);
    return book?.slug || bookId.toLowerCase();
  };

  return (
    <>
      <Header title="My Notes" showBack />
      <main className="p-4 max-w-2xl mx-auto">
        <Tabs defaultValue="scripture">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="scripture" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Scripture ({sortedNotes.length})
            </TabsTrigger>
            <TabsTrigger value="topics" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Topics ({topicNotes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scripture">
            {sortedNotes.length === 0 ? (
              <Card className="animate-fade-in">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No Scripture Notes Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Tap on any verse while reading to add your personal notes and reflections.
                  </p>
                  <Link href="/read/john/3">
                    <Button>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Start Reading
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  {sortedNotes.length} note{sortedNotes.length !== 1 ? "s" : ""}
                </div>

                {sortedNotes.map((note, index) => (
                  <Card key={note.id} className="card-hover animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Link
                          href={`/read/${getBookSlug(note.bookId)}/${note.chapter}`}
                          className="text-primary font-medium hover:underline"
                        >
                          {note.reference}
                        </Link>
                        <div className="flex items-center gap-1">
                          {editingId !== note.id ? (
                            <>
                              <Button
                                variant="ghost"
                                size="icon-touch"
                                aria-label="Edit note"
                                onClick={() => handleEdit(note.id, note.content)}
                              >
                                <Edit2 />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-touch"
                                aria-label="Delete note"
                                onClick={() => {
                                  if (confirm("Delete this note?")) {
                                    removeNote(note.id);
                                  }
                                }}
                              >
                                <Trash2 className="text-destructive" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="icon-touch"
                                aria-label="Save note"
                                onClick={() => handleSave(note.id)}
                              >
                                <Save className="text-primary" />
                              </Button>
                              <Button variant="ghost" size="icon-touch" aria-label="Cancel editing" onClick={handleCancel}>
                                <X />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {editingId === note.id ? (
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[100px]"
                          autoFocus
                        />
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                      )}

                      <div className="text-xs text-muted-foreground mt-2">
                        Updated {new Date(note.updatedAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="topics">
            {topicNotes.length === 0 ? (
              <Card className="animate-fade-in">
                <CardContent className="p-8 text-center">
                  <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No Topic Notes Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Browse topics and add notes to capture your thoughts and learnings.
                  </p>
                  <Link href="/explore">
                    <Button>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Explore Topics
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedTopicNotes).map(([slug, notes]) => {
                  const topic = topicDetails[slug];
                  return (
                    <div key={slug}>
                      <Link href={`/explore/${slug}`} className="block mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-primary hover:underline">
                            {topic?.title || slug.replace(/-/g, ' ')}
                          </h3>
                          {topic && (
                            <Badge variant="secondary" className="text-xs">
                              {PILLAR_INFO[topic.pillar as Pillar]?.name.split(' ')[0] || topic.pillar}
                            </Badge>
                          )}
                        </div>
                      </Link>
                      <div className="space-y-3 pl-4 border-l-2 border-muted">
                        {notes.map((note) => (
                          <Card key={note.id}>
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  {editingId === note.id ? (
                                    <Textarea
                                      value={editContent}
                                      onChange={(e) => setEditContent(e.target.value)}
                                      className="min-h-[80px]"
                                      autoFocus
                                    />
                                  ) : (
                                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                                  )}
                                  <div className="text-xs text-muted-foreground mt-2">
                                    {new Date(note.updatedAt).toLocaleDateString()}
                                    {note.sectionIndex !== undefined && ` · Section ${note.sectionIndex + 1}`}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {editingId !== note.id ? (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleEdit(note.id, note.content)}
                                      >
                                        <Edit2 className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleDeleteTopicNote(note.id)}
                                      >
                                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleSave(note.id, true)}
                                      >
                                        <Save className="h-3.5 w-3.5 text-primary" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={handleCancel}
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
