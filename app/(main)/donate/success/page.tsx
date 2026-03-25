import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home } from "lucide-react";

export default function DonationSuccessPage() {
  return (
    <>
      <Header title="Thank You!" />
      <main className="p-4 pb-24 max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-heading font-serif">Thank You!</CardTitle>
            <CardDescription className="text-body">
              Your donation helps keep Scripture Explorer free and accessible to everyone around the world.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-body text-center text-muted-foreground">
              Your generous support enables us to:
            </p>
            <ul className="text-body-sm space-y-2 text-muted-foreground">
              <li>• Keep the platform free for all users</li>
              <li>• Maintain and improve the AI features</li>
              <li>• Add new Bible translations and resources</li>
              <li>• Support server and hosting costs</li>
            </ul>

            <Link href="/" className="block pt-4">
              <Button className="w-full min-h-tap text-body">
                <Home className="h-5 w-5 mr-2" />
                Return Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
