// app/(main)/admin/topics/new/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GenerateTopicForm } from '@/components/topics/GenerateTopicForm';
import { TopicEditor } from '@/components/topics/TopicEditor';
import { useAdmin } from '@/contexts/AdminContext';
import type { Pillar, DeepDiveSection, ScriptureRef, Topic } from '@/lib/topics/types';

interface GeneratedContent {
  hook: string;
  overview: string;
  deepDive: DeepDiveSection[];
  scriptureRefs: ScriptureRef[];
  relatedTopics: string[];
}

export default function NewTopicPage() {
  const [generatedContent, setGeneratedContent] = useState<{
    content: GeneratedContent;
    title: string;
    pillar: Pillar;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'generate' | 'edit'>('generate');
  const { isAdmin } = useAdmin();
  const router = useRouter();

  if (!isAdmin) {
    router.push('/admin');
    return null;
  }

  const handleGenerated = (content: GeneratedContent, title: string, pillar: Pillar) => {
    setGeneratedContent({ content, title, pillar });
    setActiveTab('edit');
  };

  const handleSave = async (topicData: Omit<Topic, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => {
    const res = await fetch('/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topicData),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to create topic');
    }

    const { topic } = await res.json();
    router.push(`/admin/topics/${topic.slug}/edit`);
  };

  const initialTopic = generatedContent
    ? {
        title: generatedContent.title,
        pillar: generatedContent.pillar,
        hook: generatedContent.content.hook,
        overview: generatedContent.content.overview,
        deepDive: generatedContent.content.deepDive,
        scriptureRefs: generatedContent.content.scriptureRefs,
        relatedTopics: generatedContent.content.relatedTopics,
        status: 'draft' as const,
      }
    : undefined;

  return (
    <div className="pb-20">
      <Header title="New Topic" showBack />

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'generate' | 'edit')}>
          <TabsList className="w-full">
            <TabsTrigger value="generate" className="flex-1">
              AI Generate
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex-1">
              Edit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Generate Topic with AI</CardTitle>
              </CardHeader>
              <CardContent>
                <GenerateTopicForm onGenerated={handleGenerated} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="edit" className="mt-4">
            <TopicEditor initialTopic={initialTopic} onSave={handleSave} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
