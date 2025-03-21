import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { businessUrl, businessType, location } = await request.json()

    // In a real implementation, this would use a service like Google Search API
    // or scrape Google search results to find competitors
    // For now, we'll generate sample competitors based on business type

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const competitors = generateSampleCompetitors(businessType, location)

    return NextResponse.json({
      success: true,
      competitors,
    })
  } catch (error) {
    console.error("Error detecting competitors:", error)
    return NextResponse.json({ error: "Failed to detect competitors" }, { status: 500 })
  }
}

function generateSampleCompetitors(businessType: string, location: string) {
  // Sample competitors for common business types
  const competitorMap: Record<string, string[]> = {
    roofing: [
      "https://www.abcroofing.com",
      "https://www.qualityroofpros.com",
      "https://www.toproofers.com",
      "https://www.eliteroofingservices.com",
      "https://www.premierroofingco.com",
    ],
    plumbing: [
      "https://www.fastplumbers.com",
      "https://www.reliableplumbingservices.com",
      "https://www.expertplumbingsolutions.com",
      "https://www.proplumbingco.com",
      "https://www.emergencyplumbingpros.com",
    ],
    "home improvement": [
      "https://www.homeprosremodeling.com",
      "https://www.elitehomeimprovements.com",
      "https://www.premierrenovations.com",
      "https://www.qualityhomeservices.com",
      "https://www.dreamhomerenovations.com",
    ],
    // Add more business types as needed
  }

  // Return competitors for the specified business type, or generic ones if not found
  const businessTypeKey = Object.keys(competitorMap).find((key) => businessType.toLowerCase().includes(key))

  return businessTypeKey
    ? competitorMap[businessTypeKey]
    : [
        "https://www.competitor1.com",
        "https://www.competitor2.com",
        "https://www.competitor3.com",
        "https://www.competitor4.com",
        "https://www.competitor5.com",
      ]
}

