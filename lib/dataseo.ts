/**
 * DataForSEO API client for SEO data
 */

// DataForSEO API credentials
const DATAFORSEO_LOGIN = process.env.DATAFORSEO_LOGIN || "";
const DATAFORSEO_PASSWORD = process.env.DATAFORSEO_PASSWORD || "";
const DATAFORSEO_BASE_URL = "https://api.dataforseo.com/v3";

// Base64 encoded credentials for authentication
const AUTH_HEADER = Buffer.from(
  `${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`
).toString("base64");

/**
 * Make a request to the DataForSEO API
 */
async function makeRequest(
  endpoint: string,
  method: "GET" | "POST" = "GET",
  data?: any
) {
  try {
    if (!DATAFORSEO_LOGIN || !DATAFORSEO_PASSWORD) {
      throw new Error("DataForSEO credentials are not configured");
    }

    const url = `${DATAFORSEO_BASE_URL}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        Authorization: `Basic ${AUTH_HEADER}`,
        "Content-Type": "application/json",
      },
    };

    if (data && method === "POST") {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `DataForSEO API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error making DataForSEO request:", error);
    throw error;
  }
}

/**
 * Get keyword data from DataForSEO using the clickstream data endpoint
 * This endpoint can handle up to 1000 keywords in a single request and is optimized for search volume data
 */
export async function getKeywordData(
  keywords: string[],
  location: string,
  language = "en"
) {
  try {
    // Get location code for the specified location
    const locationCode = await getLocationCode(location);

    // Prepare the request data - this endpoint can handle up to 1000 keywords at once
    const data = [
      {
        keywords: keywords,
        location_code: locationCode,
        language_code: language,
      },
    ];

    // Make the request to DataForSEO's clickstream data endpoint
    console.log(
      `Fetching search volume data for ${keywords.length} keywords from DataForSEO`
    );
    const response = await makeRequest(
      "/keywords_data/clickstream_data/dataforseo_search_volume/live",
      "POST",
      data
    );

    const processedData = processKeywordVolumeData(response, keywords);
    console.log(
      `search volume data fetched for ${processedData.length} keywords`
    );
    return processedData;
  } catch (error) {
    console.error("Error getting keyword data:", error);

    // Generate fallback data if the API call fails
    throw new Error(
      `Failed to fetch keyword data: ${(error as Error).message}`
    );
  }
}

/**
 * Process keyword volume data from DataForSEO response
 */
function processKeywordVolumeData(response: any, originalKeywords: string[]) {
  try {
    const keywordData: any[] = [];
    const processedKeywords = new Set<string>();

    if (response.tasks && Array.isArray(response.tasks)) {
      for (const task of response.tasks) {
        if (task.result && Array.isArray(task.result)) {
          for (const result of task.result) {
            if (result.items && Array.isArray(result.items)) {
              // Process each keyword item
              for (const item of result.items) {
                keywordData.push({
                  keyword: item.keyword,
                  searchVolume: item.search_volume || 0,
                });
                processedKeywords.add(item.keyword);
              }
            }
          }
        }
      }
    }

    // Check if we got data for all keywords, if not, add missing ones with null values
    // This ensures we maintain the same number of keywords as input
    for (const keyword of originalKeywords) {
      if (!processedKeywords.has(keyword)) {
        keywordData.push({
          keyword,
          searchVolume: 0,
          keywordDifficulty: null,
          cpc: null,
          organicResults: [],
        });
      }
    }

    return keywordData;
  } catch (error) {
    console.error("Error processing keyword volume data:", error);
    throw new Error(
      `Failed to process keyword data: ${(error as Error).message}`
    );
  }
}

/**
 * Get ranked keywords for a domain using DataForSEO Labs
 */
export async function getRankedKeywords(
  domain: string,
  location: string,
  limit = 50
) {
  try {
    // Get location code
    const locationCode = await getLocationCode(location);

    // Prepare the request data
    const data = [
      {
        target: domain,
        location_code: locationCode,
        language_code: "en",
        limit: limit,
      },
    ];

    // Make the request to DataForSEO
    const response = await makeRequest(
      "/dataforseo_labs/google/ranked_keywords/live",
      "POST",
      data
    );

    return processRankedKeywordsData(response, domain);
  } catch (error) {
    console.error("Error getting ranked keywords:", error);
    throw error;
  }
}

/**
 * Process ranked keywords data from DataForSEO response
 */
function processRankedKeywordsData(response: any, domain: string) {
  try {
    console.log(
      `Processing ranked keywords data from DataForSEO response for domain: ${domain}`
    );
    const rankedKeywords: any[] = [];

    if (response.tasks && Array.isArray(response.tasks)) {
      for (const task of response.tasks) {
        if (task.result && Array.isArray(task.result)) {
          for (const result of task.result) {
            if (result.items && Array.isArray(result.items)) {
              for (const item of result.items) {
                rankedKeywords.push({
                  keyword: item?.keyword_data?.keyword || "",
                  searchVolume:
                    item?.keyword_data?.keyword_info?.search_volume || 0,
                  keywordDifficulty:
                    item?.ranked_serp_element?.keyword_difficulty || 0,
                  cpc: item?.keyword_data?.keyword_info?.cpc
                    ? Number(item.keyword_data.keyword_info.cpc).toFixed(2)
                    : "0.00",
                  rank:
                    item?.ranked_serp_element?.serp_item?.rank_absolute || 0,
                  url: item?.ranked_serp_element?.serp_item?.url || "",
                  domain: item?.ranked_serp_element?.serp_item?.domain || "",
                });
              }
            }
          }
        }
      }
    }

    console.log(
      `Ranked keywords processed successfully for domain : ${domain} `
    );

    return rankedKeywords;
  } catch (error) {
    console.error("Error processing ranked keywords data:", error);
    throw error;
  }
}

/**
 * Get location code for a specified location
 */
export async function getLocationCode(location: string): Promise<number> {
  try {
    // Make request to get location data
    const response = await makeRequest("/serp/google/locations", "GET");

    // Find the location code for the specified location
    if (response.results && Array.isArray(response.results)) {
      const locationData = response.results.find((loc: any) =>
        loc.location_name.toLowerCase().includes(location.toLowerCase())
      );

      if (locationData) {
        return locationData.location_code;
      }
    }

    // Default to USA if location not found
    return 2840; // USA location code
  } catch (error) {
    console.error("Error getting location code:", error);
    // Default to USA if there's an error
    return 2840;
  }
}

/**
 * Polling function to check task results until they are ready
 * Fetches results for each task ID individually using GET requests
 */
async function pollForResults(
  taskIds: string[],
  maxAttempts = 10,
  delay = 5000
) {
  let attempts = 0;
  const allResults: any[] = [];
  const processedTaskIds = new Set<string>();

  while (attempts < maxAttempts && processedTaskIds.size < taskIds.length) {
    console.log(
      `Checking for results (Attempt ${attempts + 1}/${maxAttempts})...`
    );

    // Process each task ID individually with a GET request
    for (const taskId of taskIds) {
      // Skip already processed tasks
      if (processedTaskIds.has(taskId)) continue;

      try {
        // Use a GET request for each individual task ID
        const endpoint = `/serp/google/organic/task_get/advanced/${taskId}`;
        const response = await makeRequest(endpoint, "GET");

        if (
          response.tasks &&
          response.tasks.length > 0 &&
          response.tasks[0].result
        ) {
          // Add this task's results to our collection
          allResults.push(response.tasks[0]);
          processedTaskIds.add(taskId);
        }
      } catch (error) {
        console.warn(`Error fetching results for task ${taskId}:`, error);
        // Continue with other tasks even if one fails
      }
    }

    // If we have results for all tasks, return them
    if (processedTaskIds.size === taskIds.length) {
      return allResults;
    }

    // Wait before retrying
    await new Promise((resolve) => setTimeout(resolve, delay));
    attempts++;
  }

  console.warn(
    `Tasks did not complete in time. Got ${allResults.length} out of ${taskIds.length} tasks.`
  );
  return allResults;
}

/**
 * Get competitor data for a domain
 */
export async function getCompetitorData(domain: string, location: string) {
  try {
    // Get location code
    const locationCode = await getLocationCode(location);

    // Prepare the request data
    const data = [
      {
        target: domain,
        location_code: locationCode,
        language_code: "en",
        language_name: "English",
        limit: 3,
      },
    ];

    // Make the request to DataForSEO
    const response = await makeRequest(
      "/dataforseo_labs/google/competitors_domain/live",
      "POST",
      data
    );

    console.log("Competitor data response:", response.tasks);

    return processCompetitorData(response, domain);
  } catch (error) {
    console.error("Error getting competitor data:", error);
    throw error;
  }
}

/**
 * Process competitor data from DataForSEO response
 */
function processCompetitorData(response: any, domain: string) {
  try {
    const competitors: any[] = [];

    if (response.tasks && Array.isArray(response.tasks)) {
      for (const task of response.tasks) {
        if (task.result && Array.isArray(task.result)) {
          for (const result of task.result) {
            if (result.items && Array.isArray(result.items)) {
              // Get top 5 competitors
              const topCompetitors = result.items.slice(0, 5);

              for (const competitor of topCompetitors) {
                competitors.push({
                  name: competitor.domain,
                  url: `https://${competitor.domain}`,
                  source: "DataForSEO",
                  organicTraffic: competitor.metrics?.organic?.traffic || 0,
                  keywordCount: competitor.metrics?.organic?.keywords || 0,
                  domainAuthority: competitor.metrics?.domain_rank || 0,
                });
              }
            }
          }
        }
      }
    }

    // If no competitors were found, generate mock data
    if (competitors.length === 0) {
      throw new Error("No competitors found for the domain");
    }

    return competitors;
  } catch (error) {
    console.error("Error processing competitor data:", error);
    throw error;
  }
}

/**
 * Get local competitors using Google Maps data via DataForSEO
 */
export async function getLocalCompetitors(
  businessType: string,
  location: string
) {
  try {
    // Get location code
    const locationCode = await getLocationCode(location);

    // Prepare the request data
    const data = [
      {
        keyword: `${businessType} in ${location}`,
        location_code: locationCode,
        language_code: "en",
      },
    ];

    // Make the request to DataForSEO
    const response = await makeRequest(
      "/serp/google/maps/live/advanced",
      "POST",
      data
    );

    console.log("Local competitors response:", response.tasks);

    return processLocalCompetitorData(response, businessType, location);
  } catch (error) {
    console.error("Error getting local competitors:", error);
    throw error;
  }
}

/**
 * Process local competitor data from DataForSEO response
 */
function processLocalCompetitorData(
  response: any,
  businessType: string,
  location: string
) {
  try {
    const competitors: any[] = [];

    if (response.tasks && Array.isArray(response.tasks)) {
      for (const task of response.tasks) {
        if (task.result && Array.isArray(task.result)) {
          for (const result of task.result) {
            if (result.items && Array.isArray(result.items)) {
              // Get local businesses from the results
              for (const item of result.items) {
                competitors.push({
                  name: item.title,
                  url: item.url,
                  source: "Google Maps",
                  rating: item.rating?.value || 0, // Random rating between 3 and 5
                  reviewCount: item.rating?.votes_count || 0,
                  address: item.address || "",
                });
              }
            }
          }
        }
      }
    }

    // If no competitors were found, generate mock data
    if (competitors.length === 0) {
      throw new Error("No local competitors found");
    }

    return {
      searchTerm: `${businessType} in ${location}`,
      competitors: competitors.slice(0, 3), // Ensures only 3 competitors are returned
    };
  } catch (error) {
    console.error("Error processing local competitor data:", error);
    throw error;
  }
}

/**
 * Get domain rankings for multiple domains and keywords in a single batch of requests
 */
export async function getDomainRankings(
  domains: string[],
  keywords: string[],
  location: string
) {
  try {
    // Get location code
    const locationCode = await getLocationCode(location);

    // Split keywords into batches of 50 (DataForSEO's limit)
    const batchSize = 50; // Reduce batch size to avoid overloading the API
    const keywordBatches = [];

    for (let i = 0; i < keywords.length; i += batchSize) {
      keywordBatches.push(keywords.slice(i, i + batchSize));
    }

    // Process each batch
    const domainRankings: Record<string, Record<string, number | null>> = {};

    // Initialize rankings object for each domain
    domains.forEach((domain) => {
      domainRankings[domain] = {};
    });

    for (const batch of keywordBatches) {
      try {
        // Prepare the request data for task_post - no target domain needed
        const data = batch.map((keyword) => ({
          keyword,
          location_code: locationCode,
          language_code: "en",
          depth: 100, // Get top 100 results
          priority: 2,
        }));

        // Submit tasks
        console.log(
          `Submitting batch of ${batch.length} keywords to DataForSEO SERP API`
        );
        const postResponse = await makeRequest(
          "/serp/google/organic/task_post",
          "POST",
          data
        );

        if (!postResponse.tasks || !postResponse.tasks.length) {
          console.warn("No tasks were created for SERP data");
          continue;
        }

        // Extract task IDs
        const taskIds = postResponse.tasks.map((task: any) => task.id);

        // Wait a moment for tasks to process
        await new Promise((resolve) => setTimeout(resolve, 30000));

        // Poll for results using the updated polling function
        const taskResults = await pollForResults(taskIds);

        // Process the results for all domains at once
        for (const task of taskResults) {
          if (task.result && Array.isArray(task.result)) {
            for (const result of task.result) {
              const keyword = result.keyword;

              // Initialize this keyword for all domains
              domains.forEach((domain) => {
                domainRankings[domain][keyword] = null;
              });

              // Find all domains in the organic results
              if (result.items && Array.isArray(result.items)) {
                for (const item of result.items) {
                  if (item.type === "organic") {
                    // Check if this result matches any of our domains
                    for (const domain of domains) {
                      if (item.domain === domain || item.url.includes(domain)) {
                        domainRankings[domain][keyword] = item.rank_absolute;
                        break; // Found this domain, move to next item
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(
          `Error processing batch of keywords: ${batch.join(", ")}`,
          error
        );
        // Continue with next batch even if this one fails
      }
    }

    // Ensure all keywords are accounted for
    domains.forEach((domain) => {
      keywords.forEach((keyword) => {
        if (!(keyword in domainRankings[domain])) {
          domainRankings[domain][keyword] = null;
        }
      });
    });

    return domainRankings;
  } catch (error) {
    console.error("Error getting domain rankings:", error);

    throw new Error(
      `Failed to get domain rankings: ${(error as Error).message}`
    );
  }
}

/**
 * Fetch keyword data for a client and competitors
 */
export async function fetchKeywordData(
  clientUrl: string,
  competitorUrls: string[],
  keywords: string[],
  analysisScope: "local" | "national" = "local",
  location = "United States"
) {
  try {
    console.log(`Fetching keyword data from DataForSEO for ${clientUrl}`);
    console.log(`Analysis scope: ${analysisScope}`);

    // Get domain from URL
    const clientDomain = getDomainFromUrl(clientUrl);

    // Get competitor domains
    const competitorDomains = competitorUrls.map((url) =>
      getDomainFromUrl(url)
    );
    const competitors = competitorUrls.map((url) => ({
      url,
      name: getDomainFromUrl(url),
      source: url.includes("maps") ? "Google Maps" : "DataForSEO",
    }));

    console.log(
      `Fetching ranked keywords for ${competitorUrls.length} competitors...`
    );

    // 1. Get ranked keywords for competitors only (not for client domain)
    const competitorRankedKeywordsPromises = competitorDomains.map((domain) =>
      getRankedKeywords(domain, location, 10)
    );

    const competitorRankedKeywordsResults = await Promise.all(
      competitorRankedKeywordsPromises
    );

    console.log("Ranked keywords fetched successfully");

    // Flatten and deduplicate competitor ranked keywords
    const allRankedKeywords = new Map();
    competitorRankedKeywordsResults.forEach((rankedKeywords) => {
      rankedKeywords.forEach((kw: any) => {
        if (!allRankedKeywords.has(kw.keyword)) {
          allRankedKeywords.set(kw.keyword, kw);
        }
      });
    });

    console.log(`all ranked keywords`, allRankedKeywords);

    // Combine our generated keywords with competitor ranked keywords
    const allKeywords = [
      ...new Set([...keywords, ...Array.from(allRankedKeywords.keys())]),
    ];

    console.log(`Combined keywords for analysis: ${allKeywords.length}`);

    // 2. Get keyword data for all keywords using the clickstream data endpoint
    const keywordData = await getKeywordData(allKeywords, location);

    // 3. Sort keywords by search volume and take only the top 50
    keywordData.sort((a, b) => (b.searchVolume || 0) - (a.searchVolume || 0));
    const top50Keywords = keywordData.slice(0, 50).map((kw) => kw.keyword);

    console.log(
      `Selected top 50 keywords by search volume for ranking analysis`
    );

    // 4. Get rankings for all domains (client + competitors) but only for top 50 keywords
    const allDomains = [clientDomain, ...competitorDomains];
    const rankingsForTop50 = await getDomainRankings(
      allDomains,
      top50Keywords,
      location
    );
    console.log(
      "Rankings fetched for all domains successfully (top 50 keywords)"
    );

    // 5. Combine all data
    const combinedKeywordData = allKeywords.map((keyword) => {
      // Check if we have data from keyword data
      const keywordDataItem = keywordData.find((kw) => kw.keyword === keyword);

      // Check if we have data from ranked keywords
      const rankedData = allRankedKeywords.get(keyword);

      // Determine if this is a local-specific keyword
      const isLocal =
        keyword.includes("near me") ||
        keyword.toLowerCase().includes("local") ||
        keyword.includes("in ") ||
        keyword.includes("near ");

      // Get client rank for this keyword (only if it's in top 50, otherwise null)
      const clientRank = top50Keywords.includes(keyword)
        ? rankingsForTop50[clientDomain][keyword]
        : null;

      // Get competitor ranks for this keyword (only if it's in top 50, otherwise null)
      const competitorRanks: Record<string, number | null> = {};
      competitorUrls.forEach((url, i) => {
        const domain = competitorDomains[i];
        competitorRanks[url] = top50Keywords.includes(keyword)
          ? rankingsForTop50[domain][keyword]
          : null;
      });

      // Use the best data available
      const searchVolume =
        rankedData?.searchVolume || keywordDataItem?.searchVolume || 0;

      const keywordDifficulty =
        rankedData?.keywordDifficulty ||
        keywordDataItem?.keywordDifficulty ||
        0;

      const cpc = rankedData?.cpc || keywordDataItem?.cpc || "0.00";

      // Add scope-specific data
      const scopeData =
        analysisScope === "local"
          ? {
              hasLocalPack: isLocal,
              localIntent: isLocal ? 8 : 3,
            }
          : {
              keywordDifficulty,
              cpc,
            };

      return {
        keyword,
        searchVolume,
        clientRank,
        competitorRanks,
        isLocal,
        ...scopeData,
      };
    });

    // Sort keywords by search volume (highest first)
    combinedKeywordData.sort((a, b) => b.searchVolume - a.searchVolume);

    return {
      clientUrl,
      competitors,
      keywordData: combinedKeywordData,
      analysisScope,
    };
  } catch (error) {
    console.error("Error fetching data from DataForSEO:", error);
    throw new Error(
      `Failed to fetch keyword data: ${(error as Error).message}`
    );
  }
}

/**
 * Fetch national competitors from DataForSEO
 */
export async function fetchNationalCompetitors(
  businessType: string,
  clientUrl?: string
) {
  try {
    console.log(
      `Fetching national competitors for ${businessType} and ${clientUrl}`
    );

    if (clientUrl) {
      // Get domain from URL
      const clientDomain = getDomainFromUrl(clientUrl);

      // Get competitor data from DataForSEO
      return await getCompetitorData(clientDomain, "United States");
    } else {
      throw new Error("Client URL is required to fetch national competitors");
    }
  } catch (error) {
    console.error("Error fetching national competitors:", error);
    throw new Error(
      `Failed to fetch national competitors: ${(error as Error).message}`
    );
  }
}

/**
 * Fetch local competitors from DataForSEO
 */
export async function fetchLocalCompetitors(
  businessType: string,
  location: string
) {
  try {
    console.log(
      `Fetching local competitors for ${businessType} in ${location}`
    );

    // Get local competitor data from DataForSEO
    return await getLocalCompetitors(businessType, location);
  } catch (error) {
    console.error("Error fetching local competitors:", error);
    throw new Error(
      `Failed to fetch local competitors: ${(error as Error).message}`
    );
  }
}

/**
 * Extract domain name from URL
 */
function getDomainFromUrl(url: string) {
  try {
    const domain = new URL(url).hostname;
    return domain.replace(/^www\./, "");
  } catch (error) {
    return url;
  }
}
