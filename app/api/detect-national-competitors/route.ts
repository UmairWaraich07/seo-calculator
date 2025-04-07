import { NextResponse } from "next/server";
import { fetchNationalCompetitors } from "@/lib/dataseo";

export async function POST(request: Request) {
  try {
    const { businessType, location, businessUrl } = await request.json();

    if (!businessType) {
      return NextResponse.json(
        { error: "Business type is required" },
        { status: 400 }
      );
    }

    // Fetch national competitors using DataForSEO
    const competitors = await fetchNationalCompetitors(
      businessType,
      businessUrl
    );

    return NextResponse.json({
      success: true,
      competitors,
    });
  } catch (error: any) {
    console.error("Error detecting national competitors:", error);
    return NextResponse.json(
      {
        error: "Failed to detect national competitors",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    // Build API URL
    const apiUrl = `https://keyword.searchatlas.com/api/v1/rank-tracker/${SEARCHATLAS_PROJECT_ID}/competitors-by-visibility/`;

    // Make API call with Axios
    const response = await axios.get(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        period2_start: formatDate(startDate),
        period2_end: formatDate(endDate),
        page: 1,
        page_size: 3,
        searchatlas_api_key: SEARCHATLAS_API_KEY,
      },
    });

    console.log("SearchAtlas API response:", response.data);
 */
