"use client";

import type React from "react";

interface ReportEmailTemplateProps {
  basicInfo: {
    businessUrl: string;
    businessType: string;
    location: string;
    customerValue: number;
    analysisScope: "local" | "national";
  };
  report: {
    totalSearchVolume: number;
    potentialTraffic: number;
    potentialCustomers: number;
    potentialRevenue: number;
    marketStatus: string;
    competitionLevel: string;
    opportunityType: string;
    recommendedActions: string[];
    potentialStrategy: string;
    timeToResults: string;
    estimatedPotential: string;
    keywordData: Array<{
      keyword: string;
      searchVolume: number;
      difficulty: number;
      currentRank: number | null;
      competitorRanks: Record<string, number>;
      opportunity: "high" | "medium" | "low";
    }>;
  };
}

export const ReportEmailTemplate: React.FC<ReportEmailTemplateProps> = ({
  basicInfo,
  report,
}) => {
  // This component is now only used for type checking
  // The actual email HTML is generated in lib/email.ts
  return null;
};
