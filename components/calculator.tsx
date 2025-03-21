"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { BasicInfoForm } from "@/components/basic-info-form";
import { CompetitorForm } from "@/components/competitor-form";
import { EmailForm } from "@/components/email-form";
import { ProcessingScreen } from "@/components/processing-screen";
import { Progress } from "@/components/ui/progress";

type CalculatorStep = "basic-info" | "competitors" | "processing" | "email";

export type BasicInfo = {
  businessUrl: string;
  businessType: string;
  location: string;
  customerValue: string;
  competitorType: "manual" | "auto";
};

export type CompetitorInfo = {
  competitors: string[];
};

export const Calculator = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CalculatorStep>("basic-info");
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    businessUrl: "",
    businessType: "",
    location: "",
    customerValue: "",
    competitorType: "auto",
  });
  const [competitorInfo, setCompetitorInfo] = useState<CompetitorInfo>({
    competitors: ["", "", ""],
  });
  const [reportId, setReportId] = useState<string>("");
  const [progress, setProgress] = useState(0);

  const handleBasicInfoSubmit = async (data: BasicInfo) => {
    setBasicInfo(data);
    setCurrentStep("competitors");
  };

  const handleCompetitorSubmit = async (data: CompetitorInfo) => {
    setCompetitorInfo(data);
    setCurrentStep("processing");

    // Start the processing
    try {
      const response = await fetch("/api/process-seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          basicInfo,
          competitorInfo: data,
        }),
      });

      console.log("Processing response:", response);

      if (!response.ok) {
        throw new Error("Failed to process SEO data");
      }

      const result = await response.json();
      setReportId(result.reportId);

      // Simulate progress updates
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            setCurrentStep("email");
            return 100;
          }
          return prev + 5;
        });
      }, 3000);
    } catch (error) {
      console.error("Error processing SEO data:", error);
      // Handle error state
    }
  };

  const handleEmailSubmit = async (email: string) => {
    try {
      await fetch("/api/send-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reportId,
        }),
      });

      // Redirect to thank you page
      router.push(`/thank-you?reportId=${reportId}`);
    } catch (error) {
      console.error("Error sending report:", error);
      // Handle error state
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">
            Step{" "}
            {currentStep === "basic-info"
              ? "1"
              : currentStep === "competitors"
              ? "2"
              : currentStep === "processing"
              ? "3"
              : "4"}{" "}
            of 4
          </span>
          <span className="text-sm font-medium">
            {currentStep === "basic-info"
              ? "Business Information"
              : currentStep === "competitors"
              ? "Competitors"
              : currentStep === "processing"
              ? "Processing"
              : "Get Your Report"}
          </span>
        </div>
        <Progress
          value={
            currentStep === "basic-info"
              ? 25
              : currentStep === "competitors"
              ? 50
              : currentStep === "processing"
              ? progress
              : 100
          }
          className="h-2"
        />
      </div>

      {currentStep === "basic-info" && (
        <BasicInfoForm onSubmit={handleBasicInfoSubmit} />
      )}

      {currentStep === "competitors" && (
        <CompetitorForm
          onSubmit={handleCompetitorSubmit}
          competitorType={basicInfo.competitorType}
          initialValues={competitorInfo}
        />
      )}

      {currentStep === "processing" && <ProcessingScreen progress={progress} />}

      {currentStep === "email" && <EmailForm onSubmit={handleEmailSubmit} />}
    </Card>
  );
};
