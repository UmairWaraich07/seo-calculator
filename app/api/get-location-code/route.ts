import { type NextRequest, NextResponse } from "next/server";

// DataForSEO API credentials
const DATAFORSEO_LOGIN = process.env.DATAFORSEO_LOGIN || "";
const DATAFORSEO_PASSWORD = process.env.DATAFORSEO_PASSWORD || "";
const DATAFORSEO_BASE_URL = "https://api.dataforseo.com/v3";

// Cache the locations to avoid repeated API calls
let cachedLocations: { states: any[]; cities: Record<string, any[]> } | null =
  null;
let cacheTimestamp = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in ms

// Helper: fuzzy matching
function findBestMatch(
  items: any[],
  searchTerm: string,
  threshold = 0.6
): any | null {
  if (!items || items.length === 0) return null;
  const normalizedSearch = searchTerm.toLowerCase().trim();
  // Exact / includes
  const exact = items.find(
    (item) =>
      item.name.toLowerCase() === normalizedSearch ||
      item.name.toLowerCase().includes(normalizedSearch) ||
      normalizedSearch.includes(item.name.toLowerCase())
  );
  if (exact) return exact;

  // Scoring fallback
  let best: any = null,
    bestScore = 0;
  for (const item of items) {
    const name = item.name.toLowerCase();
    let score = 0;
    if (name.includes(normalizedSearch)) {
      score = normalizedSearch.length / name.length;
    } else if (normalizedSearch.includes(name)) {
      score = name.length / normalizedSearch.length;
    } else {
      const ws = normalizedSearch.split(" "),
        nws = name.split(" ");
      const matches = ws.filter((w) =>
        nws.some((nw: string) => nw.includes(w) || w.includes(nw))
      );
      score = matches.length / Math.max(ws.length, nws.length);
    }
    if (score > threshold && score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  return best;
}

// Fetch & cache location data (merged from /api/locations)
async function loadLocationData(): Promise<{
  states: any[];
  cities: Record<string, any[]>;
}> {
  const now = Date.now();
  if (cachedLocations && now - cacheTimestamp < CACHE_DURATION) {
    return cachedLocations;
  }

  const states: any[] = [];
  const cities: Record<string, any[]> = {};
  const country = "us";

  try {
    const resp = await fetch(
      `${DATAFORSEO_BASE_URL}/keywords_data/google_ads/locations/${country}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`
          ).toString("base64")}`,
        },
      }
    );
    if (!resp.ok) throw new Error(`DataForSEO API error: ${resp.statusText}`);
    const json = await resp.json();
    const usLocations = json.tasks[0].result || [];

    // --- STATES ---
    usLocations.forEach((loc: any) => {
      if (loc.location_type === "State") {
        states.push({
          name: loc.location_name,
          code: loc.location_code,
        });
        cities[loc.location_name] = [];
      }
    });
    // Sort so longer names match first (e.g. "West Virginia")
    states.sort((a, b) => b.name.length - a.name.length);

    // --- CITIES: first map raw to objects with `.name` ---
    const allCities = usLocations
      .filter((loc: any) => loc.location_type === "City")
      .map((loc: any) => ({
        name: loc.location_name,
        code: loc.location_code,
      }));

    // Assign cities to their states
    for (const city of allCities) {
      const cityLower = city.name.toLowerCase();
      let assigned = false;

      // Try exact "City, State" match
      for (const st of states) {
        const stLower = st.name.toLowerCase();
        if (
          cityLower.includes(`, ${stLower},`) ||
          cityLower.endsWith(`, ${stLower}`)
        ) {
          cities[st.name].push(city);
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        // Fallback: regex on state name
        for (const st of states) {
          const stLower = st.name.toLowerCase();
          const words = stLower.split(" ").join("\\s+");
          const regex = new RegExp(`\\b${words}\\b`, "i");
          if (regex.test(cityLower)) {
            cities[st.name].push(city);
            break;
          }
        }
      }
    }

    // Sort alphabetically
    states.sort((a, b) => a.name.localeCompare(b.name));
    Object.keys(cities).forEach((st) => {
      cities[st].sort((a, b) => a.name.localeCompare(b.name));
    });

    // Cache and return
    cachedLocations = { states, cities };
    cacheTimestamp = now;
    return cachedLocations;
  } catch (e) {
    console.error("Error fetching location data:", e);
    throw new Error("Failed to load location data from DataForSEO");
  }
}

export async function POST(request: NextRequest) {
  try {
    const { state, city } = await request.json();
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
      `[get-location-code] Request for state=${state}, city=${city || "n/a"}`
    );

    const { states, cities } = await loadLocationData();
    const matchedState = findBestMatch(states, state);
    if (!matchedState) {
      return NextResponse.json(
        {
          error: `State "${state}" not found`,
          suggestion: "Check spelling or try a different name",
        },
        { status: 404 }
      );
    }

    // City-level match?
    if (city) {
      const stateCities = cities[matchedState.name] || [];
      const matchedCity = findBestMatch(stateCities, city);
      if (matchedCity) {
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
      }
      console.warn(
        `[get-location-code] No city match for "${city}", falling back to state`
      );
    }

    // Fallback: return state code
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
  } catch (err) {
    console.error("[get-location-code] Internal error:", err);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
