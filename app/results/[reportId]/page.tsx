import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ResultsOverview } from "@/components/results-overview";
import { KeywordTable } from "@/components/keyword-table";

export default async function ResultsPage({
  params,
}: {
  params: { reportId: string };
}) {
  params = await params;
  const reportId = (await params.reportId) || "47498393398";
  // Fetch report from database
  const { db } = await connectToDatabase();

  let report;
  try {
    report = await db.collection("reports").findOne({
      _id: new ObjectId(reportId),
    });
  } catch (error) {
    console.error("Error fetching report:", error);
  }

  if (!report) {
    notFound();
  }

  const { basicInfo, report: reportData } = report;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
            Your SEO Opportunity Report
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Here's what we found for {basicInfo.businessUrl}
          </p>
        </div>

        <div className="space-y-8">
          <ResultsOverview reportData={reportData} basicInfo={basicInfo} />

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">
              Top Keywords & Opportunities
            </h2>
            <KeywordTable keywordData={reportData.keywordData} />
          </Card>

          <div className="flex justify-center gap-4 pt-8">
            <Button asChild size="lg">
              <Link href="/schedule-call">Schedule a Free Consultation</Link>
            </Button>

            <Button variant="outline" asChild size="lg">
              <Link href="/">Run Another Analysis</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
