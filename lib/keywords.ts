import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type AnalysisScope = "local" | "national";

export async function generateKeywords(
  businessType: string,
  location: string,
  analysisScope: AnalysisScope = "local"
): Promise<string[]> {
  try {
    // Generate location variants including surrounding areas (only for local)
    const locationVariants =
      analysisScope === "local"
        ? await generateLocalLocationVariants(location)
        : [];

    // Generate base keywords using AI
    const baseKeywords = await generateAIBasedKeywords(
      businessType,
      location,
      analysisScope
    );

    // Generate location patterns only if we have valid location variants
    const locationPatterns =
      locationVariants.length > 0
        ? createLocationPatterns(businessType, locationVariants)
        : [];

    // Combine and deduplicate keywords
    return Array.from(new Set([...baseKeywords, ...locationPatterns])).slice(
      0,
      50
    );
  } catch (error) {
    console.error("Keyword generation failed:", error);
    return [];
  }
}

async function generateLocalLocationVariants(
  location: string
): Promise<string[]> {
  try {
    const prompt = `Generate 15-20 neighboring cities/areas for ${location} in comma-separated format.
      Example for Chicago: Chicago Heights, Lockport, Riverside, Oak Park, Evanston...`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content;
    return content ? parseLocationVariants(content) : [];
  } catch (error) {
    console.error("Location variant generation failed:", error);
    return [];
  }
}

function parseLocationVariants(rawText: string): string[] {
  return rawText
    .split(",")
    .map((l) => l.trim().replace(/\.$/, ""))
    .filter((l) => l.length > 0);
}

async function generateAIBasedKeywords(
  businessType: string,
  location: string,
  scope: AnalysisScope
): Promise<string[]> {
  try {
    const prompt = `Generate 30-40 ${scope} SEO keywords for ${businessType}.
      ${scope === "local" ? `Location: ${location}` : "National scope"}
      Include: service terms, location modifiers, buyer intent phrases
      Format: comma-separated`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    // console.log("AI-generated keywords:", content);
    return content ? parseAIKeywords(content) : [];
  } catch (error) {
    console.error("AI keyword generation failed:", error);
    return [];
  }
}

function parseAIKeywords(rawText: string): string[] {
  return rawText
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter((k) => k.length > 2 && k.length < 60);
}

function createLocationPatterns(
  businessType: string,
  locations: string[]
): string[] {
  const serviceForms = [
    businessType,
    `${businessType} services`,
    `${businessType} company`,
    `${businessType} near me`,
    `best ${businessType}`,
    `affordable ${businessType}`,
  ];

  const patterns: string[] = [];

  for (const service of serviceForms) {
    for (const location of locations) {
      patterns.push(`${service} ${location}`);
      patterns.push(`${location} ${service}`);
    }
  }

  return patterns;
}
