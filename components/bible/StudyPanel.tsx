"use client";

import { useState } from "react";
import {
  BookOpen,
  Users,
  Search,
  Heart,
  Link,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Globe,
  Clock,
  Scroll,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { StudyNotes } from "@/lib/study/types";

interface StudyPanelProps {
  notes: StudyNotes;
}

type TabId = "context" | "perspectives" | "deepDive" | "apply" | "connections" | "questions";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: "context", label: "Context", icon: <BookOpen className="h-4 w-4" /> },
  { id: "perspectives", label: "Unity", icon: <Users className="h-4 w-4" /> },
  { id: "deepDive", label: "Deep Dive", icon: <Search className="h-4 w-4" /> },
  { id: "apply", label: "Apply", icon: <Heart className="h-4 w-4" /> },
  { id: "connections", label: "Connect", icon: <Link className="h-4 w-4" /> },
  { id: "questions", label: "Questions", icon: <HelpCircle className="h-4 w-4" /> },
];

export function StudyPanel({ notes }: StudyPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("context");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="border-t mt-6 pt-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Scroll className="h-5 w-5 text-leather-600" />
        Study Notes
      </h3>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
        {TABS.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 shrink-0"
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === "context" && (
          <ContextTab context={notes.context} />
        )}

        {activeTab === "perspectives" && (
          <PerspectivesTab
            perspectives={notes.perspectives}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
        )}

        {activeTab === "deepDive" && (
          <DeepDiveTab deepDive={notes.deepDive} />
        )}

        {activeTab === "apply" && (
          <ApplyTab application={notes.application} />
        )}

        {activeTab === "connections" && (
          <ConnectionsTab connections={notes.connections} />
        )}

        {activeTab === "questions" && notes.difficultQuestions && (
          <QuestionsTab
            questions={notes.difficultQuestions}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
        )}
      </div>
    </div>
  );
}

// Context Tab Component
function ContextTab({ context }: { context: StudyNotes["context"] }) {
  const sections = [
    { icon: <Clock className="h-4 w-4" />, title: "Historical Context", content: context.historical },
    { icon: <Globe className="h-4 w-4" />, title: "Cultural Context", content: context.cultural },
    { icon: <BookOpen className="h-4 w-4" />, title: "Literary Context", content: context.literary },
    { icon: <MapPin className="h-4 w-4" />, title: "Geographic Context", content: context.geographic },
    { icon: <Users className="h-4 w-4" />, title: "Original Audience", content: context.audience },
  ].filter((s) => s.content);

  return (
    <div className="space-y-4">
      {sections.map((section, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-leather-700">
              {section.icon}
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {section.content}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Perspectives Tab Component
function PerspectivesTab({
  perspectives,
  expandedSections,
  toggleSection,
}: {
  perspectives: StudyNotes["perspectives"];
  expandedSections: Set<string>;
  toggleSection: (s: string) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Common Ground - Always show first */}
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-green-700 dark:text-green-400">
            <Users className="h-4 w-4" />
            What All Christians Agree On
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {perspectives.commonGround.map((point, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-muted-foreground">{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Different Views */}
      {perspectives.differentViews && perspectives.differentViews.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-leather-700">
              <BookOpen className="h-4 w-4" />
              Different Perspectives (All Held by Faithful Christians)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {perspectives.differentViews.map((view, i) => (
              <div key={i} className="border-l-2 border-leather-200 pl-3">
                <button
                  onClick={() => toggleSection(`view-${i}`)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-medium text-sm">{view.view}</span>
                  {expandedSections.has(`view-${i}`) ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                {expandedSections.has(`view-${i}`) && (
                  <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium">Traditions:</span>{" "}
                      {view.traditions.join(", ")}
                    </p>
                    <p>
                      <span className="font-medium">Reasoning:</span>{" "}
                      {view.reasoning}
                    </p>
                    <p className="italic text-green-700 dark:text-green-400">
                      <span className="font-medium">Heart behind this view:</span>{" "}
                      {view.heartBehind}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Unity Note */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <Heart className="h-4 w-4" />
            Unity in Diversity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            {perspectives.unityNote}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Deep Dive Tab Component
function DeepDiveTab({ deepDive }: { deepDive: StudyNotes["deepDive"] }) {
  return (
    <div className="space-y-4">
      {/* Key Words */}
      {deepDive.keyWords && deepDive.keyWords.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-leather-700">
              <Search className="h-4 w-4" />
              Key Words (Original Languages)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {deepDive.keyWords.map((word, i) => (
              <div key={i} className="border-l-2 border-amber-300 pl-3">
                <p className="font-semibold text-sm">{word.word}</p>
                <p className="text-xs text-amber-700 dark:text-amber-400 font-mono">
                  {word.original}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-medium">Meaning:</span> {word.meaning}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Significance:</span> {word.significance}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Cross References */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-leather-700">
            <Link className="h-4 w-4" />
            Cross References
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {deepDive.crossReferences.map((ref, i) => (
            <div key={i} className="text-sm">
              <span className="font-semibold text-leather-600">{ref.reference}</span>
              <span className="text-muted-foreground"> — {ref.connection}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Themes */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-leather-700">Major Themes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {deepDive.themes.map((theme, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-leather-100 dark:bg-leather-800 text-leather-700 dark:text-leather-300 rounded-full text-xs"
              >
                {theme}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Symbols */}
      {deepDive.symbols && deepDive.symbols.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-leather-700">Symbols & Imagery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {deepDive.symbols.map((symbol, i) => (
              <div key={i} className="text-sm">
                <span className="font-semibold">{symbol.symbol}:</span>{" "}
                <span className="text-muted-foreground">{symbol.meaning}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Apply Tab Component
function ApplyTab({ application }: { application: StudyNotes["application"] }) {
  return (
    <div className="space-y-4">
      {/* Then & Now */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-leather-700">Then & Now</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Original Meaning
            </p>
            <p className="text-sm mt-1">{application.thenAndNow.originalMeaning}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              For Us Today
            </p>
            <p className="text-sm mt-1">{application.thenAndNow.modernApplication}</p>
          </div>
        </CardContent>
      </Card>

      {/* Reflection Questions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-leather-700">Reflection Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {application.reflectionQuestions.map((q, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-leather-500 font-bold">{i + 1}.</span>
                <span className="text-muted-foreground">{q}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Prayer Prompt */}
      <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-900/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-purple-700 dark:text-purple-400">
            Prayer Prompt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm italic text-muted-foreground">
            {application.prayerPrompt}
          </p>
        </CardContent>
      </Card>

      {/* Action Step */}
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-green-700 dark:text-green-400">
            This Week's Action Step
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {application.actionStep}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Connections Tab Component
function ConnectionsTab({ connections }: { connections: StudyNotes["connections"] }) {
  return (
    <div className="space-y-4">
      {/* Jesus Connection */}
      <Card className="border-red-200 bg-red-50/50 dark:bg-red-900/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-red-700 dark:text-red-400">
            Connection to Jesus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {connections.jesusConnection}
          </p>
        </CardContent>
      </Card>

      {/* Big Picture */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-leather-700">The Big Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {connections.bigPicture}
          </p>
        </CardContent>
      </Card>

      {/* Prophecy Links */}
      {connections.prophecyLinks && connections.prophecyLinks.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-leather-700">
              Prophecy Connections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {connections.prophecyLinks.map((link, i) => (
              <div key={i} className="text-sm border-l-2 border-amber-300 pl-3">
                <p>
                  <span className="font-semibold">{link.oldTestament}</span>
                  <span className="text-muted-foreground"> → </span>
                  <span className="font-semibold">{link.newTestament}</span>
                </p>
                <p className="text-muted-foreground">{link.connection}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Related Stories */}
      {connections.relatedStories && connections.relatedStories.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-leather-700">Related Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {connections.relatedStories.map((story, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  • {story}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Questions Tab Component
function QuestionsTab({
  questions,
  expandedSections,
  toggleSection,
}: {
  questions: NonNullable<StudyNotes["difficultQuestions"]>;
  expandedSections: Set<string>;
  toggleSection: (s: string) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        These are honest questions people ask about this passage. We don&apos;t have all the answers,
        but we can explore what we know and what we trust.
      </p>

      {questions.map((q, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <button
              onClick={() => toggleSection(`question-${i}`)}
              className="flex items-center justify-between w-full text-left"
            >
              <CardTitle className="text-sm text-leather-700 flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                {q.question}
              </CardTitle>
              {expandedSections.has(`question-${i}`) ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </CardHeader>
          {expandedSections.has(`question-${i}`) && (
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Honest Answer:</p>
                <p className="text-muted-foreground">{q.honestAnswer}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                  <p className="font-medium text-blue-700 dark:text-blue-400 text-xs uppercase">
                    What We Know
                  </p>
                  <p className="text-muted-foreground mt-1">{q.whatWeKnow}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                  <p className="font-medium text-green-700 dark:text-green-400 text-xs uppercase">
                    What We Trust
                  </p>
                  <p className="text-muted-foreground mt-1">{q.whatWeTrust}</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
