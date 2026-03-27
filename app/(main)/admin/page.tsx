// app/(main)/admin/page.tsx

'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import { FileText, Plus, Route, Settings, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminPage() {
  const { isAdmin, toggleAdmin } = useAdmin();

  return (
    <div className="pb-20">
      <Header title="Admin" />

      <div className="p-4 space-y-6">
        {/* Admin Mode Toggle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Admin Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {isAdmin ? 'Admin mode is ON' : 'Admin mode is OFF'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isAdmin
                    ? 'You can see drafts and edit content'
                    : 'Enable to access content management'}
                </p>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={toggleAdmin}
              >
                {isAdmin ? (
                  <ToggleRight className="h-6 w-6 text-green-600" />
                ) : (
                  <ToggleLeft className="h-6 w-6" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {isAdmin && (
          <>
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/topics/new">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center py-6">
                    <Plus className="h-8 w-8 mb-2 text-primary" />
                    <span className="font-medium">New Topic</span>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/topics">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center py-6">
                    <FileText className="h-8 w-8 mb-2 text-primary" />
                    <span className="font-medium">Manage Topics</span>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/paths/new">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center py-6">
                    <Plus className="h-8 w-8 mb-2 text-primary" />
                    <span className="font-medium">New Path</span>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/paths">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center py-6">
                    <Route className="h-8 w-8 mb-2 text-primary" />
                    <span className="font-medium">Manage Paths</span>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
