import { WifiOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-parchment-100">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <WifiOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-heading font-serif">You&apos;re Offline</CardTitle>
          <CardDescription className="text-body">
            It looks like you&apos;ve lost your internet connection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-body-sm text-muted-foreground">
            Some features of Scripture Explorer require an internet connection.
            Please check your connection and try again.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
