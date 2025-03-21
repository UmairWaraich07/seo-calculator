import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: { reportId?: string };
}) {
  searchParams = await searchParams;
  const reportId = await searchParams?.reportId;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <div className="container px-4 mx-auto max-w-3xl">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>

          <p className="text-lg text-slate-600 mb-6">
            Your SEO opportunity report has been sent to your email. Please
            check your inbox (and spam folder) for your detailed analysis.
          </p>

          <div className="bg-slate-50 p-4 rounded-lg mb-8">
            <p className="text-sm text-slate-500 mb-2">Report Reference ID:</p>
            <p className="font-mono text-slate-700">{reportId}</p>
          </div>

          <div className="space-y-4">
            <p className="text-slate-600">
              Want to discuss your SEO opportunities with an expert?
            </p>

            <Button asChild className="w-full">
              <Link href="/schedule-call">Schedule a Free Consultation</Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
