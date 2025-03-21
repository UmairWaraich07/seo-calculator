import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { sendReportEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email, reportId } = await request.json();

    if (!email || !reportId) {
      return NextResponse.json(
        { error: "Email and reportId are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Fetch report from database
    const report = await db.collection("reports").findOne({
      _id: new ObjectId(reportId),
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Send email using Resend
    try {
      const emailResult = await sendReportEmail(email, report);

      // Update report in database
      await db.collection("reports").updateOne(
        { _id: new ObjectId(reportId) },
        {
          $set: {
            emailSent: true,
            emailAddress: email,
            emailSentAt: new Date(),
            emailId: emailResult?.id,
          },
        }
      );

      return NextResponse.json({
        success: true,
        emailId: emailResult?.id,
      });
    } catch (emailError: any) {
      console.error("Error sending email:", emailError);

      // Return more specific error information
      return NextResponse.json(
        {
          error: "Failed to send email",
          details: emailError.message || "Unknown email error",
          code: emailError.statusCode || 500,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error processing report:", error);
    return NextResponse.json(
      { error: "Failed to process report", details: error.message },
      { status: 500 }
    );
  }
}
