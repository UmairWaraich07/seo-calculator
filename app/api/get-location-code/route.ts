import { type NextRequest, NextResponse } from "next/server";

// Helper function for fuzzy matching
function findBestMatch(
  items: any[],
  searchTerm: string,
  threshold = 0.6
): any | null {
  if (!items || items.length === 0) return null;

  const normalizedSearch = searchTerm.toLowerCase().trim();

  // First try exact match
  const exactMatch = items.find(
    (item) =>
      item.name.toLowerCase() === normalizedSearch ||
      item.name.toLowerCase().includes(normalizedSearch) ||
      normalizedSearch.includes(item.name.toLowerCase())
  );

  if (exactMatch) return exactMatch;

  // Then try partial matches with scoring
  let bestMatch = null;
  let bestScore = 0;

  for (const item of items) {
    const itemName = item.name.toLowerCase();
    let score = 0;

    // Calculate similarity score
    if (itemName.includes(normalizedSearch)) {
      score = normalizedSearch.length / itemName.length;
    } else if (normalizedSearch.includes(itemName)) {
      score = itemName.length / normalizedSearch.length;
    } else {
      // Check for word matches
      const searchWords = normalizedSearch.split(" ");
      const itemWords = itemName.split(" ");
      const matchingWords = searchWords.filter((word) =>
        itemWords.some(
          (itemWord: string) =>
            itemWord.includes(word) || word.includes(itemWord)
        )
      );
      score =
        matchingWords.length / Math.max(searchWords.length, itemWords.length);
    }

    if (score > threshold && score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  return bestMatch;
}

// Fetch states from your existing API
async function fetchStates(): Promise<any[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/locations`);

    if (!response.ok) {
      throw new Error(`Failed to fetch states: ${response.status}`);
    }

    const states = await response.json();
    return states;
  } catch (error) {
    console.error("Error fetching states:", error);
    throw new Error("Failed to fetch states from DataForSEO API");
  }
}

// Fetch cities for a specific state from your existing API
async function fetchCities(stateName: string): Promise<any[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/locations?state=${encodeURIComponent(stateName)}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch cities: ${response.status}`);
    }

    const cities = await response.json();
    return cities;
  } catch (error) {
    console.error(`Error fetching cities for ${stateName}:`, error);
    throw new Error(
      `Failed to fetch cities for ${stateName} from DataForSEO API`
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");
    const city = searchParams.get("city");

    if (!state) {
      return NextResponse.json(
        {
          error: "State parameter is required",
          usage: "Use ?state=StateName or ?state=StateName&city=CityName",
        },
        { status: 400 }
      );
    }

    console.log(
      `[get-location-code] Looking up location code for state: ${state}${
        city ? `, city: ${city}` : ""
      }`
    );

    // Fetch states from DataForSEO via your existing API
    const states = await fetchStates();
    const matchedState = findBestMatch(states, state);

    if (!matchedState) {
      return NextResponse.json(
        {
          error: `State "${state}" not found`,
          suggestion: "Check spelling or try a different state name",
        },
        { status: 404 }
      );
    }

    console.log(
      `[get-location-code] Matched state: ${matchedState.name} (code: ${matchedState.code})`
    );

    // If city is provided, try to find it
    if (city) {
      try {
        const cities = await fetchCities(matchedState.name);
        const matchedCity = findBestMatch(cities, city);

        if (matchedCity) {
          console.log(
            `[get-location-code] Matched city: ${matchedCity.name} (code: ${matchedCity.code})`
          );
          return NextResponse.json({
            success: true,
            location_code: matchedCity.code,
            matched: {
              state: matchedState.name,
              state_code: matchedState.code,
              city: matchedCity.name,
              city_code: matchedCity.code,
            },
            type: "city",
            source: "DataForSEO",
          });
        } else {
          console.log(
            `[get-location-code] City "${city}" not found in ${matchedState.name}, falling back to state`
          );
        }
      } catch (error) {
        console.error(
          `[get-location-code] Error fetching cities for ${matchedState.name}:`,
          error
        );
        // Fall back to state code if city lookup fails
      }
    }

    // Fallback to state code
    console.log(
      `[get-location-code] Using state code: ${matchedState.code} for ${matchedState.name}`
    );
    return NextResponse.json({
      success: true,
      location_code: matchedState.code,
      matched: {
        state: matchedState.name,
        state_code: matchedState.code,
      },
      type: "state",
      source: "DataForSEO",
    });
  } catch (error) {
    console.error("[get-location-code] Error in API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { state, city } = body;

    if (!state) {
      return NextResponse.json(
        {
          error: "State is required in request body",
          usage:
            'Send JSON: {"state": "StateName"} or {"state": "StateName", "city": "CityName"}',
        },
        { status: 400 }
      );
    }

    console.log(
      `[get-location-code] POST request - Looking up location code for state: ${state}${
        city ? `, city: ${city}` : ""
      }`
    );

    // Fetch states from DataForSEO via your existing API
    const states = await fetchStates();
    const matchedState = findBestMatch(states, state);

    if (!matchedState) {
      return NextResponse.json(
        {
          error: `State "${state}" not found`,
          suggestion: "Check spelling or try a different state name",
        },
        { status: 404 }
      );
    }

    console.log(
      `[get-location-code] POST - Matched state: ${matchedState.name} (code: ${matchedState.code})`
    );

    // If city is provided, try to find it
    if (city) {
      try {
        const cities = await fetchCities(matchedState.name);
        const matchedCity = findBestMatch(cities, city);

        if (matchedCity) {
          console.log(
            `[get-location-code] POST - Matched city: ${matchedCity.name} (code: ${matchedCity.code})`
          );
          return NextResponse.json({
            success: true,
            location_code: matchedCity.code,
            matched: {
              state: matchedState.name,
              state_code: matchedState.code,
              city: matchedCity.name,
              city_code: matchedCity.code,
            },
            type: "city",
            source: "DataForSEO",
          });
        } else {
          console.log(
            `[get-location-code] POST - City "${city}" not found in ${matchedState.name}, falling back to state`
          );
        }
      } catch (error) {
        console.error(
          `[get-location-code] POST - Error fetching cities for ${matchedState.name}:`,
          error
        );
        // Fall back to state code if city lookup fails
      }
    }

    // Fallback to state code
    console.log(
      `[get-location-code] POST - Using state code: ${matchedState.code} for ${matchedState.name}`
    );
    return NextResponse.json({
      success: true,
      location_code: matchedState.code,
      matched: {
        state: matchedState.name,
        state_code: matchedState.code,
      },
      type: "state",
      source: "DataForSEO",
    });
  } catch (error) {
    console.error("[get-location-code] POST - Error in API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
