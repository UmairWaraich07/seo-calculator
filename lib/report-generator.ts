import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

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
  console.log("Conversion Rate:", conversionRate);

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
 * Get industry-specific conversion rates using OpenAI API with fallback
 */
async function getIndustryConversionRate(
  businessType: string,
  analysisScope: "local" | "national"
): Promise<number> {
  try {
    // Try OpenAI API first
    const openAIConversionRate = await getConversionRateFromOpenAI(
      businessType,
      analysisScope
    );
    return openAIConversionRate;
  } catch (error) {
    console.error("OpenAI API failed, using fallback data:", error);
    return getFallbackConversionRate(businessType, analysisScope);
  }
}

// OpenAI API integration
async function getConversionRateFromOpenAI(
  businessType: string,
  scope: "local" | "national"
): Promise<number> {
  const prompt = `
  You are an SEO expert specializing in conversion rate estimation. 
  Provide a SINGLE NUMERIC VALUE representing the average conversion rate percentage for:
  - Industry: ${businessType}
  - Scope: ${scope}
  - Value should reflect 2023 marketing benchmarks
  - Consider local scope as 30% higher than national averages
  - Format: Only respond with the numeric value, no text
  - Example: For "plumbing"+"local", return "3.8"
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 10,
  });

  const rateText = response.choices[0]?.message?.content?.trim() || "0%";
  const rate = parseFloat(rateText.replace("%", ""));

  if (isNaN(rate)) throw new Error("Invalid numeric response from OpenAI");
  if (rate < 0.1 || rate > 10)
    throw new Error("Unrealistic conversion rate from OpenAI");

  return rate;
}

// Fallback conversion rates
const FALLBACK_CONVERSION_RATES: Record<
  string,
  { local: number; national: number }
> = {
  // Home Services
  plumbing: { local: 3.8, national: 2.5 },
  roofing: { local: 4.2, national: 2.8 },
  electrical: { local: 4.0, national: 2.6 },
  hvac: { local: 4.1, national: 2.7 },
  landscaping: { local: 4.5, national: 3.0 },
  cleaning: { local: 3.9, national: 2.6 },
  painting: { local: 3.7, national: 2.4 },
  "pest control": { local: 4.3, national: 2.9 },

  // Professional Services
  dental: { local: 5.5, national: 3.8 },
  legal: { local: 4.8, national: 3.2 },
  accounting: { local: 4.2, national: 3.0 },
  "real estate": { local: 3.5, national: 2.4 },
  insurance: { local: 3.2, national: 2.1 },
  architecture: { local: 3.0, national: 2.0 },

  // Medical
  veterinary: { local: 4.6, national: 3.1 },
  chiropractic: { local: 4.4, national: 3.0 },
  "physical therapy": { local: 4.0, national: 2.8 },
  optometry: { local: 4.1, national: 2.9 },

  // Automotive
  "auto repair": { local: 3.9, national: 2.6 },
  "car dealership": { local: 2.8, national: 2.3 },
  "tire shop": { local: 3.5, national: 2.4 },
  "car wash": { local: 3.2, national: 2.1 },

  // Retail
  restaurant: { local: 4.0, national: 2.7 },
  "coffee shop": { local: 3.8, national: 2.6 },
  bakery: { local: 3.6, national: 2.5 },
  furniture: { local: 2.9, national: 2.2 },
  jewelry: { local: 3.1, national: 2.3 },

  // Technology
  "software development": { local: 2.5, national: 2.4 },
  "it support": { local: 3.0, national: 2.5 },
  "web design": { local: 3.2, national: 2.7 },
  cybersecurity: { local: 2.8, national: 2.6 },

  // Personal Services
  fitness: { local: 3.7, national: 2.6 },
  "hair salon": { local: 4.2, national: 2.9 },
  spa: { local: 4.0, national: 2.8 },
  tattoo: { local: 3.5, national: 2.5 },
  yoga: { local: 3.3, national: 2.4 },

  // Education
  tutoring: { local: 3.8, national: 2.7 },
  "language school": { local: 3.2, national: 2.5 },
  "driving school": { local: 3.6, national: 2.6 },

  // Specialized Services
  "event planning": { local: 3.4, national: 2.5 },
  photography: { local: 3.1, national: 2.3 },
  catering: { local: 3.7, national: 2.6 },
  "funeral services": { local: 4.5, national: 3.2 },

  // Industrial
  manufacturing: { local: 2.8, national: 2.5 },
  construction: { local: 3.3, national: 2.4 },
  logistics: { local: 2.7, national: 2.3 },

  // E-commerce
  fashion: { local: 2.6, national: 2.6 },
  electronics: { local: 2.4, national: 2.4 },
  supplements: { local: 3.0, national: 3.0 },

  // Defaults
  "default service": { local: 3.0, national: 2.0 },
  "default product": { local: 2.5, national: 2.5 },
};

// Enhanced matching logic with plural/synonym support
function getFallbackConversionRate(
  businessType: string,
  scope: "local" | "national"
): number {
  const cleanType = businessType
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove special chars
    .replace(/(services|service|company|shop|store)$/g, "") // Remove common suffixes
    .trim();

  const industryMap: Record<string, string> = {
    lawyer: "legal",
    attorney: "legal",
    dentist: "dental",
    vet: "veterinary",
    gym: "fitness",
    barber: "hair salon",
    tutor: "tutoring",
    tech: "it support",
  };

  // Check for direct matches first
  const directMatch = Object.keys(FALLBACK_CONVERSION_RATES).find((key) =>
    cleanType.includes(key)
  );

  // Check for synonym matches
  const synonymMatch = Object.entries(industryMap).find(([synonym]) =>
    cleanType.includes(synonym)
  );

  const matchedKey =
    directMatch || (synonymMatch ? industryMap[synonymMatch[0]] : null);

  // Determine category type
  const isProductBased = cleanType.match(/(product|goods|shop|store)/);
  const defaultKey = isProductBased ? "default product" : "default service";

  const rates = matchedKey
    ? FALLBACK_CONVERSION_RATES[matchedKey]
    : FALLBACK_CONVERSION_RATES[defaultKey];

  return scope === "local" ? rates.local : rates.national;
}
