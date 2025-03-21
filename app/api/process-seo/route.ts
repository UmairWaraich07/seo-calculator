import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { generateKeywords } from "@/lib/keywords";
import { fetchKeywordData } from "@/lib/search-atlas";

export async function POST(request: Request) {
  try {
    const { basicInfo, competitorInfo } = await request.json();

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Generate keywords based on business type and location
    const keywords = await generateKeywords(
      basicInfo.businessType,
      basicInfo.location
    );

    // Fetch keyword data from SearchAtlas API
    const keywordData = await fetchKeywordData(
      basicInfo.businessUrl,
      competitorInfo.competitors,
      keywords
    );

    // Calculate potential traffic and revenue
    const report = await calculateSeoOpportunity(
      keywordData,
      basicInfo.customerValue,
      basicInfo.businessType
    );

    // Save report to database
    const result = await db.collection("reports").insertOne({
      basicInfo,
      competitorInfo,
      keywords,
      keywordData,
      report,
      createdAt: new Date(),
      emailSent: false,
    });

    return NextResponse.json({
      success: true,
      reportId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Error processing SEO data:", error);
    return NextResponse.json(
      { error: "Failed to process SEO data" },
      { status: 500 }
    );
  }
}

async function calculateSeoOpportunity(
  keywordDataObj: any,
  customerValue: number,
  businessType: string
) {
  // Extract the actual keyword data array from the object
  const keywordData = keywordDataObj.keywordData || [];
  const competitors = keywordDataObj.competitors || [];

  // Get average conversion rate for the industry
  const conversionRate = await getIndustryConversionRate(businessType);

  // Calculate potential traffic and revenue
  const totalSearchVolume = keywordData.reduce(
    (sum: number, kw: any) => sum + kw.searchVolume,
    0
  );
  const potentialTraffic = totalSearchVolume * 0.3; // Assuming 30% CTR for #1 position
  const potentialCustomers = Math.floor(
    potentialTraffic * (conversionRate / 100)
  );
  const potentialRevenue = potentialCustomers * customerValue;

  // Calculate current rankings
  const currentRankings = {
    top3: 0,
    top10: 0,
    top50: 0,
    top100: 0,
    total: keywordData.length,
  };

  keywordData.forEach((kw: any) => {
    const rank = kw.clientRank || 101;
    if (rank <= 3) currentRankings.top3++;
    if (rank <= 10) currentRankings.top10++;
    if (rank <= 50) currentRankings.top50++;
    if (rank <= 100) currentRankings.top100++;
  });

  // Calculate competitor rankings
  const competitorRankings = competitors.map((competitor: any) => {
    const rankings = {
      name: competitor.name,
      url: competitor.url,
      top3: 0,
      top10: 0,
      top50: 0,
      top100: 0,
    };

    keywordData.forEach((kw: any) => {
      const rank = kw.competitorRanks[competitor.url] || 101;
      if (rank <= 3) rankings.top3++;
      if (rank <= 10) rankings.top10++;
      if (rank <= 50) rankings.top50++;
      if (rank <= 100) rankings.top100++;
    });

    return rankings;
  });

  return {
    totalSearchVolume,
    potentialTraffic,
    conversionRate,
    potentialCustomers,
    potentialRevenue,
    currentRankings,
    competitorRankings,
    keywordData: keywordData.map((kw: any) => ({
      keyword: kw.keyword,
      searchVolume: kw.searchVolume,
      clientRank: kw.clientRank || "Not ranked",
      competitorRanks: kw.competitorRanks,
    })),
  };
}

async function getIndustryConversionRate(
  businessType: string
): Promise<number> {
  // This would be replaced with an actual API call or database lookup
  // For now, we'll return some sample data based on business type
  const conversionRates: Record<string, number> = {
    roofing: 3.2,
    plumbing: 2.8,
    "home improvement": 2.5,
    landscaping: 3.0,
    electrician: 2.7,
    hvac: 3.1,
    dental: 4.2,
    legal: 3.8,
    automotive: 2.3,
    default: 2.0,
  };

  return conversionRates[businessType.toLowerCase()] || conversionRates.default;
}
