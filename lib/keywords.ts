// This file would contain functions to generate relevant keywords
// based on business type and location

export async function generateKeywords(businessType: string, location: string) {
  // In a real implementation, this would use AI or a keyword API
  // For now, we'll generate some sample keywords

  const baseKeywords = getBaseKeywords(businessType)
  const locationKeywords = getLocationVariants(location)

  const keywords = []

  // Combine base keywords with location variants
  for (const base of baseKeywords) {
    for (const loc of locationKeywords) {
      keywords.push(`${base} ${loc}`)
    }
    // Also add some without location for broader terms
    keywords.push(base)
  }

  // Add some long-tail variations
  const longTailPrefixes = [
    "best",
    "top",
    "affordable",
    "professional",
    "local",
    "experienced",
    "trusted",
    "licensed",
    "emergency",
  ]

  for (const prefix of longTailPrefixes) {
    for (const base of baseKeywords.slice(0, 3)) {
      // Use just the top few base keywords
      for (const loc of locationKeywords.slice(0, 2)) {
        // Use just the main location variants
        keywords.push(`${prefix} ${base} ${loc}`)
      }
    }
  }

  // Deduplicate and return
  return [...new Set(keywords)].slice(0, 50) // Limit to 50 keywords
}

function getBaseKeywords(businessType: string) {
  // Sample base keywords for common business types
  const keywordMap: Record<string, string[]> = {
    roofing: [
      "roof repair",
      "roof replacement",
      "roofing company",
      "roofing contractor",
      "roof installation",
      "roof inspection",
      "metal roofing",
      "shingle roof",
      "commercial roofing",
      "residential roofing",
    ],
    plumbing: [
      "plumber",
      "plumbing services",
      "plumbing repair",
      "emergency plumber",
      "water heater installation",
      "drain cleaning",
      "pipe repair",
      "bathroom plumbing",
      "kitchen plumbing",
      "commercial plumbing",
    ],
    "home improvement": [
      "home renovation",
      "kitchen remodeling",
      "bathroom remodeling",
      "home remodeling",
      "home addition",
      "basement finishing",
      "deck building",
      "interior painting",
      "exterior painting",
      "flooring installation",
    ],
    // Add more business types as needed
  }

  // Return keywords for the specified business type, or generic ones if not found
  return (
    keywordMap[businessType.toLowerCase()] || [
      `${businessType} services`,
      `${businessType} company`,
      `${businessType} near me`,
      `best ${businessType}`,
      `affordable ${businessType}`,
      `local ${businessType}`,
      `${businessType} prices`,
      `${businessType} cost`,
      `${businessType} quotes`,
      `professional ${businessType}`,
    ]
  )
}

function getLocationVariants(location: string) {
  // Extract city and state if provided in format "City, State"
  let city = location
  let state = ""

  if (location.includes(",")) {
    const parts = location.split(",").map((part) => part.trim())
    city = parts[0]
    state = parts[1]
  }

  // Generate location variants
  const variants = [
    location, // Original location
    city, // Just the city
    `${city} area`, // City area
    `near ${city}`, // Near city
    `in ${city}`, // In city
  ]

  // Add state variants if state is provided
  if (state) {
    variants.push(state)
    variants.push(`${city} ${state}`)
  }

  // Add "near me" as a common search term
  variants.push("near me")

  return variants
}

