import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { sendReportEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { agencyId, formData, reportId, referrer } = await request.json();

    if (!formData || !formData.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // In a real implementation, we would process the data and generate a report
    // For now, we'll just save the lead and simulate sending an email

    // Save the lead to database
    const leadId = await db.collection("widget_leads").insertOne({
      agencyId,
      formData,
      reportId,
      referrer,
      timestamp: new Date(),
      status: "new",
    });

    // In a real implementation, we would generate a report here
    // For now, we'll create a mock report
    const mockReport = {
      basicInfo: {
        businessUrl: formData.businessUrl,
        businessType: formData.businessType,
        location: formData.location,
        customerValue: Number.parseFloat(formData.customerValue),
      },
      report: {
        totalSearchVolume: 3201,
        potentialTraffic: 960,
        conversionRate: 3.2,
        potentialCustomers: 32,
        potentialRevenue: Number.parseFloat(formData.customerValue) * 32,
        currentRankings: {
          top3: 5,
          top10: 12,
          top50: 28,
          top100: 35,
          total: 50,
        },
        competitorRankings: [
          {
            name: "Competitor 1",
            url: formData.competitors[0] || "https://competitor1.com",
            top3: 8,
            top10: 15,
            top50: 32,
            top100: 42,
          },
          {
            name: "Competitor 2",
            url: formData.competitors[1] || "https://competitor2.com",
            top3: 6,
            top10: 14,
            top50: 30,
            top100: 38,
          },
        ],
        keywordData: Array.from({ length: 50 }, (_, i) => ({
          keyword: `${formData.businessType} ${
            i % 2 === 0 ? formData.location : "services"
          } ${i + 1}`,
          searchVolume: Math.floor(Math.random() * 500) + 50,
          clientRank:
            Math.random() > 0.3
              ? Math.floor(Math.random() * 100) + 1
              : "Not ranked",
          competitorRanks: {},
        })),
      },
    };

    // Send email with mock report
    try {
      await sendReportEmail(formData.email, mockReport);

      // Update lead status in database
      await db.collection("widget_leads").updateOne(
        { _id: leadId.insertedId },
        {
          $set: {
            status: "email_sent",
            emailSentAt: new Date(),
          },
        }
      );

      return NextResponse.json({
        success: true,
        message: "Report sent successfully",
      });
    } catch (emailError: any) {
      console.error("Error sending email:", emailError);

      // Update lead status in database
      await db.collection("widget_leads").updateOne(
        { _id: leadId.insertedId },
        {
          $set: {
            status: "email_failed",
            emailError: emailError.message,
          },
        }
      );

      return NextResponse.json(
        {
          error: "Failed to send email",
          details: emailError.message || "Unknown email error",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error processing widget submission:", error);
    return NextResponse.json(
      { error: "Failed to process submission", details: error.message },
      { status: 500 }
    );
  }
}
