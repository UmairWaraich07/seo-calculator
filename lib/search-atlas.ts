// This file would contain functions to interact with the SearchAtlas API
// For now, we'll simulate the API responses

export async function fetchKeywordData(
  clientUrl: string,
  competitorUrls: string[],
  keywords: string[]
) {
  // In a real implementation, this would make API calls to SearchAtlas
  // For now, we'll generate sample data

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Generate competitor data
  const competitors = competitorUrls.map((url) => ({
    url,
    name: getDomainFromUrl(url),
  }));

  // Generate keyword data
  const keywordData = keywords.map((keyword) => {
    // Generate random search volume between 10 and 1000
    const searchVolume = Math.floor(Math.random() * 990) + 10;

    // Generate random client rank (sometimes not ranking at all)
    const clientRank =
      Math.random() > 0.3 ? Math.floor(Math.random() * 100) + 1 : null;

    // Generate random competitor ranks
    const competitorRanks: Record<string, number | null> = {};
    competitorUrls.forEach((url) => {
      competitorRanks[url] =
        Math.random() > 0.2 ? Math.floor(Math.random() * 100) + 1 : null;
    });

    return {
      keyword,
      searchVolume,
      clientRank,
      competitorRanks,
    };
  });

  // Sort keywords by search volume (highest first)
  keywordData.sort((a, b) => b.searchVolume - a.searchVolume);

  return {
    clientUrl,
    competitors,
    keywordData,
  };
}

function getDomainFromUrl(url: string) {
  try {
    const domain = new URL(url).hostname;
    return domain.replace(/^www\./, "");
  } catch (error) {
    return url;
  }
}
