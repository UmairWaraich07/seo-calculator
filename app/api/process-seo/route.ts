import { NextResponse } from "next/server";
import { connectToMongoose, Report } from "@/lib/mongodb";
import { generateKeywords } from "@/lib/keywords";
import { fetchKeywordData } from "@/lib/dataseo";
import { calculateSeoOpportunity } from "@/lib/report-generator";
import { updateProgress } from "./process-progress/route";

export async function POST(request: Request) {
  try {
    const { basicInfo, competitorInfo, sessionId } = await request.json();

    if (!basicInfo || !basicInfo.businessUrl) {
      return NextResponse.json(
        { error: "Business URL is required" },
        { status: 400 }
      );
    }

    // Update progress: Initializing
    updateProgress(sessionId, "initializing", 0);

    // Connect to MongoDB
    await connectToMongoose();

    // Update progress: Analyzing website
    updateProgress(sessionId, "analyzing_website", 5);

    // Generate keywords based on business type and location
    const keywords = await generateKeywords(
      basicInfo.businessType,
      basicInfo.location,
      basicInfo.analysisScope
    );

    // Update progress: Gathering competitor data
    updateProgress(sessionId, "gathering_competitor_data", 20);

    // Fetch keyword data from DataForSEO API
    const keywordData = await fetchKeywordData(
      basicInfo.businessUrl,
      competitorInfo.competitors.filter(Boolean), // Filter out empty strings
      keywords,
      basicInfo.analysisScope,
      basicInfo.location
    );

    // Update progress: Collecting keyword rankings
    updateProgress(sessionId, "collecting_keyword_rankings", 40);

    // Small delay to show progress
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update progress: Analyzing search volume
    updateProgress(sessionId, "analyzing_search_volume", 60);

    // Calculate potential traffic and revenue
    console.log("Starting Calculating potential traffic and revenue");

    // Update progress: Calculating opportunities
    updateProgress(sessionId, "calculating_opportunities", 80);

    const report = await calculateSeoOpportunity(
      keywordData,
      basicInfo.customerValue,
      basicInfo.businessType,
      basicInfo.analysisScope
    );

    // Update progress: Finalizing report
    updateProgress(sessionId, "finalizing_report", 95);

    // Create a new report document
    const newReport = {
      basicInfo,
      competitorInfo,
      keywords,
      keywordData,
      report,
      createdAt: new Date(),
      emailSent: false,
    };

    // Save report to database using Mongoose
    const reportDoc = new Report(newReport);

    try {
      await reportDoc.save();
    } catch (saveError) {
      console.error("Error saving report to database:", saveError);
      // Try to save with a workaround for the competitorRanks issue
      try {
        // Convert keywordData.keywordData.competitorRanks to string and back to object
        const fixedKeywordData = {
          ...keywordData,
          keywordData: keywordData.keywordData.map((kw: any) => ({
            ...kw,
            competitorRanks: JSON.parse(JSON.stringify(kw.competitorRanks)),
          })),
        };

        // Convert report.keywordData.competitorRanks to string and back to object
        const fixedReport = {
          ...report,
          keywordData: report.keywordData.map((kw: any) => ({
            ...kw,
            competitorRanks: JSON.parse(JSON.stringify(kw.competitorRanks)),
          })),
        };

        const fixedReportDoc = new Report({
          ...newReport,
          keywordData: fixedKeywordData,
          report: fixedReport,
        });

        await fixedReportDoc.save();

        // Update progress: Complete
        updateProgress(sessionId, "complete", 100);

        return NextResponse.json({
          success: true,
          reportId: fixedReportDoc._id.toString(),
        });
      } catch (fixedSaveError) {
        console.error("Error saving fixed report to database:", fixedSaveError);
        throw fixedSaveError;
      }
    }

    // Update progress: Complete
    updateProgress(sessionId, "complete", 100);

    return NextResponse.json({
      success: true,
      reportId: reportDoc._id.toString(),
    });
  } catch (error: any) {
    console.error("Error processing SEO data:", error);
    return NextResponse.json(
      {
        error: "Failed to process SEO data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
