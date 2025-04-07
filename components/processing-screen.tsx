"use client";

import { Progress } from "@/components/ui/progress";
import { LoadingSpinner } from "./loading-spinner";
import { MapPin, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface ProcessingScreenProps {
  progress: number;
  analysisScope: "local" | "national";
  stage: string;
}

export const ProcessingScreen = ({
  progress,
  analysisScope,
  stage,
}: ProcessingScreenProps) => {
  // Define the stages and their corresponding progress percentages
  const stages = {
    initializing: 0,
    analyzing_website: 5,
    gathering_competitor_data: 20,
    collecting_keyword_rankings: 40,
    analyzing_search_volume: 60,
    calculating_opportunities: 80,
    finalizing_report: 95,
    complete: 100,
  };

  // Get the status message based on the current stage
  const getStatusMessage = () => {
    switch (stage) {
      case "initializing":
        return "Initializing analysis...";
      case "analyzing_website":
        return "Analyzing your website...";
      case "gathering_competitor_data":
        return analysisScope === "local"
          ? "Gathering local competitor data..."
          : "Gathering national competitor data...";
      case "collecting_keyword_rankings":
        return "Collecting keyword rankings...";
      case "analyzing_search_volume":
        return "Analyzing search volume data...";
      case "calculating_opportunities":
        return "Calculating revenue opportunities...";
      case "finalizing_report":
        return "Finalizing your SEO report...";
      case "complete":
        return "Analysis complete!";
      default:
        return "Processing your data...";
    }
  };

  // Animated progress indicator
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    // Smoothly animate to the target progress
    const animateProgress = () => {
      if (animatedProgress < progress) {
        setAnimatedProgress((prev) => Math.min(prev + 1, progress));
      }
    };

    const timer = setTimeout(animateProgress, 50);
    return () => clearTimeout(timer);
  }, [animatedProgress, progress]);

  return (
    <div className="py-8 flex flex-col items-center justify-center">
      <div className="mb-4">
        <Badge variant="outline" className="flex items-center gap-1">
          {analysisScope === "local" ? (
            <>
              <MapPin className="h-3 w-3" />
              Local Analysis
            </>
          ) : (
            <>
              <Globe className="h-3 w-3" />
              National Analysis
            </>
          )}
        </Badge>
      </div>

      <LoadingSpinner />
      <div className="mt-8 w-full max-w-md">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>0%</span>
          <span>{animatedProgress}%</span>
          <span>100%</span>
        </div>
        <Progress value={animatedProgress} className="h-2" />
        <p className="mt-4 text-center text-slate-600 font-medium">
          {getStatusMessage()}
        </p>
        <p className="mt-2 text-center text-sm text-slate-500">
          {analysisScope === "local"
            ? "We're analyzing your website and local competitors to identify SEO opportunities in your area."
            : "We're analyzing your website and national competitors to identify SEO opportunities across the country."}
        </p>
      </div>
    </div>
  );
};
