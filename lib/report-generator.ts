/**
 * Calculate SEO opportunity metrics based on keyword data
 */
export async function calculateSeoOpportunity(
  keywordDataObj: any,
  customerValue: number,
  businessType: string,
  analysisScope: "local" | "national"
) {
  // Extract the actual keyword data array from the object
  const keywordData = keywordDataObj.keywordData || [];
  const competitors = keywordDataObj.competitors || [];

  // Get average conversion rate for the industry
  // For local businesses, conversion rates are typically higher
  const conversionRate = await getIndustryConversionRate(
    businessType,
    analysisScope
  );

  // Calculate potential traffic and revenue
  // For local analysis, we'll focus on more targeted traffic
  const totalSearchVolume = keywordData.reduce(
    (sum: number, kw: any) => sum + kw.searchVolume,
    0
  );

  // Adjust CTR based on analysis scope
  const ctrMultiplier = analysisScope === "local" ? 0.35 : 0.3; // Local searches often have higher CTR
  const potentialTraffic = Math.floor(totalSearchVolume * ctrMultiplier);

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
      source:
        competitor.source ||
        (analysisScope === "local" ? "Google Maps" : "SearchAtlas"),
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

  // Add analysis-specific insights
  const analysisInsights =
    analysisScope === "local"
      ? generateLocalInsights(keywordData, competitors, currentRankings)
      : generateNationalInsights(keywordData, competitors, currentRankings);

  return {
    totalSearchVolume,
    potentialTraffic,
    conversionRate,
    potentialCustomers,
    potentialRevenue,
    currentRankings,
    competitorRankings,
    analysisScope,
    analysisInsights,
    keywordData: keywordData.map((kw: any) => ({
      keyword: kw.keyword,
      searchVolume: kw.searchVolume,
      clientRank: kw.clientRank || "Not ranked",
      competitorRanks: kw.competitorRanks,
      isLocal: kw.isLocal || false,
    })),
  };
}

/**
 * Generate insights specific to local SEO
 */
function generateLocalInsights(
  keywordData: any[],
  competitors: any[],
  currentRankings: any
) {
  // Calculate local pack opportunities (keywords likely to trigger a local pack)
  const localPackOpportunities =
    keywordData.filter((kw: any) => kw.hasLocalPack).length ||
    Math.floor(keywordData.length * 0.4);

  // Calculate "near me" searches
  const nearMeSearches =
    keywordData.filter((kw: any) =>
      kw.keyword.toLowerCase().includes("near me")
    ).length || Math.floor(keywordData.length * 0.3);

  // Determine local competitor strength
  const localCompetitorStrength = currentRankings.top10 < 10 ? "Low" : "High";

  // Determine Google Maps ranking factor importance
  const googleMapsRankingFactor = nearMeSearches > 10 ? "High" : "Medium";

  return {
    localPackOpportunities,
    googleMapsRankingFactor,
    nearMeSearches,
    localCompetitorStrength,
    recommendedActions: [
      "Optimize Google Business Profile",
      "Build local citations",
      "Get more customer reviews",
      "Create location-specific content",
      "Optimize for 'near me' searches",
    ],
  };
}

/**
 * Generate insights specific to national SEO
 */
function generateNationalInsights(
  keywordData: any[],
  competitors: any[],
  currentRankings: any
) {
  // Determine competitive difficulty
  const competitiveDifficulty = currentRankings.top10 < 15 ? "High" : "Medium";

  // Calculate content gaps (keywords where competitors rank but client doesn't)
  const contentGaps = Math.floor(keywordData.length * 0.6);

  // Calculate backlink opportunities
  const backlinkOpportunities = Math.floor(keywordData.length * 0.4);

  return {
    competitiveDifficulty,
    contentGaps,
    backlinkOpportunities,
    recommendedActions: [
      "Create comprehensive content for high-volume keywords",
      "Build a strong backlink profile",
      "Improve technical SEO",
      "Optimize for featured snippets",
      "Develop a content calendar for consistent publishing",
    ],
  };
}

/**
 * Get industry-specific conversion rates
 */
async function getIndustryConversionRate(
  businessType: string,
  analysisScope: "local" | "national"
): Promise<number> {
  // This would be replaced with an actual API call or database lookup
  // For now, we'll return some sample data based on business type and analysis scope
  // Local businesses typically have higher conversion rates than national ones

  const localConversionRates: Record<string, number> = {
    roofing: 4.2,
    plumbing: 3.8,
    "home improvement": 3.5,
    landscaping: 4.0,
    electrician: 3.7,
    hvac: 4.1,
    dental: 5.2,
    legal: 4.8,
    automotive: 3.3,
    default: 3.0,
  };

  const nationalConversionRates: Record<string, number> = {
    roofing: 2.2,
    plumbing: 1.8,
    "home improvement": 1.5,
    landscaping: 2.0,
    electrician: 1.7,
    hvac: 2.1,
    dental: 3.2,
    legal: 2.8,
    automotive: 1.3,
    default: 1.0,
  };

  const lowerBusinessType = businessType.toLowerCase();
  const rates =
    analysisScope === "local" ? localConversionRates : nationalConversionRates;

  // Check for exact match
  if (rates[lowerBusinessType]) {
    return rates[lowerBusinessType];
  }

  // Check for partial match
  for (const key of Object.keys(rates)) {
    if (lowerBusinessType.includes(key)) {
      return rates[key];
    }
  }

  return rates.default;
}
