interface ReportEmailTemplateProps {
  basicInfo: {
    businessUrl: string;
    businessType: string;
    location: string;
    customerValue: number;
    analysisScope: string;
  };
  report: {
    totalSearchVolume: number;
    potentialTraffic: number;
    potentialCustomers: number;
    potentialRevenue: number;
    keywordData: Array<{
      keyword: string;
      searchVolume: number;
      difficulty: number;
      currentRank: number | null;
      competitorRanks: Record<string, number>;
    }>;
    competitorAnalysis: {
      totalCompetitors: number;
      averageRank: number;
      opportunityScore: number;
    };
    insights: {
      marketStatus: string;
      competitionLevel: string;
      opportunityType: string;
      recommendedActions: string[];
      potentialStrategy: string;
      timeToResults: string;
      estimatedPotential: string;
    };
  };
}

export function ReportEmailTemplate({
  basicInfo,
  report,
}: ReportEmailTemplateProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRankingColor = (rank: number | null) => {
    if (!rank) return "#94a3b8";
    if (rank <= 3) return "#10b981";
    if (rank <= 10) return "#f59e0b";
    if (rank <= 20) return "#f97316";
    return "#ef4444";
  };

  const getRankingBadge = (rank: number | null) => {
    if (!rank) return "Not Ranking";
    if (rank <= 3) return `#${rank} - Top 3`;
    if (rank <= 10) return `#${rank} - Page 1`;
    if (rank <= 20) return `#${rank} - Page 2`;
    return `#${rank} - Page 3+`;
  };

  const getOpportunityLevel = (score: number) => {
    if (score >= 80) return { level: "Excellent", color: "#10b981" };
    if (score >= 60) return { level: "Good", color: "#f59e0b" };
    if (score >= 40) return { level: "Moderate", color: "#f97316" };
    return { level: "Challenging", color: "#ef4444" };
  };

  const opportunityLevel = getOpportunityLevel(
    report.competitorAnalysis.opportunityScore
  );

  return (
    <div
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        lineHeight: "1.6",
        color: "#1f2937",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#f8fafc",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "40px 30px",
          textAlign: "center" as const,
          borderRadius: "16px 16px 0 0",
          position: "relative" as const,
        }}
      >
        <div
          style={{
            position: "absolute" as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>\')',
            opacity: 0.3,
          }}
        />
        <div style={{ position: "relative" as const, zIndex: 2 }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 8px 25px rgba(245, 158, 11, 0.3)",
            }}
          >
            <span style={{ fontSize: "24px", color: "white" }}>📊</span>
          </div>
          <h1
            style={{
              margin: "0 0 12px",
              fontSize: "2.2rem",
              fontWeight: "700",
              color: "white",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            SEO Opportunity Report
          </h1>
          <p
            style={{
              margin: "0",
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.9)",
              fontWeight: "400",
            }}
          >
            Discover Your Untapped Revenue Potential
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ backgroundColor: "white", padding: "0" }}>
        {/* Executive Summary */}
        <div
          style={{
            background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
            padding: "30px",
            margin: "0",
            borderBottom: "3px solid #0ea5e9",
            position: "relative" as const,
          }}
        >
          <div
            style={{
              position: "absolute" as const,
              top: 0,
              right: 0,
              width: "100px",
              height: "100px",
              background:
                "linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)",
              borderRadius: "50%",
              transform: "translate(30px, -30px)",
            }}
          />
          <h2
            style={{
              margin: "0 0 20px",
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#0c4a6e",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "20px" }}>🎯</span>
            Executive Summary
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                padding: "20px",
                borderRadius: "12px",
                border: "2px solid #f59e0b",
                textAlign: "center" as const,
                position: "relative" as const,
                overflow: "hidden" as const,
              }}
            >
              <div
                style={{
                  position: "absolute" as const,
                  top: "-10px",
                  right: "-10px",
                  width: "40px",
                  height: "40px",
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
                  borderRadius: "50%",
                  opacity: 0.2,
                }}
              />
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#92400e",
                  marginBottom: "8px",
                }}
              >
                {formatCurrency(report.potentialRevenue)}
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "#92400e",
                  fontWeight: "600",
                }}
              >
                Monthly Revenue Potential
              </div>
            </div>
            <div
              style={{
                background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                padding: "20px",
                borderRadius: "12px",
                border: "2px solid #10b981",
                textAlign: "center" as const,
                position: "relative" as const,
                overflow: "hidden" as const,
              }}
            >
              <div
                style={{
                  position: "absolute" as const,
                  top: "-10px",
                  right: "-10px",
                  width: "40px",
                  height: "40px",
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  borderRadius: "50%",
                  opacity: 0.2,
                }}
              />
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#065f46",
                  marginBottom: "8px",
                }}
              >
                {formatNumber(report.potentialCustomers)}
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "#065f46",
                  fontWeight: "600",
                }}
              >
                New Customers/Month
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: "8px",
              border: "1px solid rgba(14, 165, 233, 0.2)",
            }}
          >
            <p
              style={{
                margin: "0",
                fontSize: "0.95rem",
                color: "#0c4a6e",
                lineHeight: "1.5",
              }}
            >
              <strong>Analysis Scope:</strong>{" "}
              <span
                style={{
                  background:
                    basicInfo.analysisScope === "local" ? "#ddd6fe" : "#fef3c7",
                  color:
                    basicInfo.analysisScope === "local" ? "#5b21b6" : "#92400e",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  textTransform: "uppercase" as const,
                }}
              >
                {basicInfo.analysisScope === "local"
                  ? "📍 Local"
                  : "🌐 National"}
              </span>{" "}
              | <strong>Location:</strong> {basicInfo.location} |{" "}
              <strong>Industry:</strong> {basicInfo.businessType}
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{ padding: "30px" }}>
          <h2
            style={{
              margin: "0 0 24px",
              fontSize: "1.4rem",
              fontWeight: "700",
              color: "#1f2937",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "18px" }}>📈</span>
            Key Performance Metrics
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
                padding: "20px",
                borderRadius: "12px",
                textAlign: "center" as const,
                border: "2px solid #d1d5db",
                transition: "transform 0.3s ease",
              }}
            >
              <div
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "700",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                {formatNumber(report.totalSearchVolume)}
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#6b7280",
                  fontWeight: "600",
                }}
              >
                Total Search Volume
              </div>
            </div>
            <div
              style={{
                background: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
                padding: "20px",
                borderRadius: "12px",
                textAlign: "center" as const,
                border: "2px solid #8b5cf6",
                transition: "transform 0.3s ease",
              }}
            >
              <div
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "700",
                  color: "#5b21b6",
                  marginBottom: "8px",
                }}
              >
                {formatNumber(report.potentialTraffic)}
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#5b21b6",
                  fontWeight: "600",
                }}
              >
                Monthly Traffic Potential
              </div>
            </div>
            <div
              style={{
                background: `linear-gradient(135deg, ${opportunityLevel.color}20 0%, ${opportunityLevel.color}30 100%)`,
                padding: "20px",
                borderRadius: "12px",
                textAlign: "center" as const,
                border: `2px solid ${opportunityLevel.color}`,
                transition: "transform 0.3s ease",
              }}
            >
              <div
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "700",
                  color: opportunityLevel.color,
                  marginBottom: "8px",
                }}
              >
                {report.competitorAnalysis.opportunityScore}%
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: opportunityLevel.color,
                  fontWeight: "600",
                }}
              >
                {opportunityLevel.level} Opportunity
              </div>
            </div>
          </div>
        </div>

        {/* Keyword Analysis */}
        <div style={{ padding: "0 30px 30px" }}>
          <h2
            style={{
              margin: "0 0 20px",
              fontSize: "1.4rem",
              fontWeight: "700",
              color: "#1f2937",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "18px" }}>🔍</span>
            Top Keyword Opportunities
          </h2>
          <div
            style={{
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              borderRadius: "12px",
              overflow: "hidden" as const,
              border: "2px solid #e2e8f0",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
                padding: "16px 20px",
                color: "white",
                fontWeight: "600",
                fontSize: "0.9rem",
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                gap: "16px",
                alignItems: "center",
              }}
            >
              <div>Keyword</div>
              <div style={{ textAlign: "center" as const }}>Search Volume</div>
              <div style={{ textAlign: "center" as const }}>Difficulty</div>
              <div style={{ textAlign: "center" as const }}>Your Ranking</div>
            </div>
            {report.keywordData.slice(0, 8).map((keyword, index) => (
              <div
                key={index}
                style={{
                  padding: "16px 20px",
                  borderBottom: index < 7 ? "1px solid #e5e7eb" : "none",
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  gap: "16px",
                  alignItems: "center",
                  backgroundColor: index % 2 === 0 ? "white" : "#f9fafb",
                  transition: "background-color 0.3s ease",
                }}
              >
                <div style={{ fontWeight: "600", color: "#1f2937" }}>
                  {keyword.keyword}
                </div>
                <div
                  style={{
                    textAlign: "center" as const,
                    color: "#6b7280",
                    fontWeight: "500",
                  }}
                >
                  {formatNumber(keyword.searchVolume)}
                </div>
                <div style={{ textAlign: "center" as const }}>
                  <span
                    style={{
                      background:
                        keyword.difficulty <= 30
                          ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                          : keyword.difficulty <= 60
                          ? "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)"
                          : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                    }}
                  >
                    {keyword.difficulty}%
                  </span>
                </div>
                <div style={{ textAlign: "center" as const }}>
                  <span
                    style={{
                      background: getRankingColor(keyword.currentRank),
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                    }}
                  >
                    {getRankingBadge(keyword.currentRank)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Insights */}
        <div style={{ padding: "0 30px 30px" }}>
          <h2
            style={{
              margin: "0 0 20px",
              fontSize: "1.4rem",
              fontWeight: "700",
              color: "#1f2937",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "18px" }}>💡</span>
            Market Insights & Strategy
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #fef7cd 0%, #fef3c7 100%)",
                padding: "20px",
                borderRadius: "12px",
                border: "2px solid #f59e0b",
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px",
                  color: "#92400e",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                }}
              >
                Market Status
              </h3>
              <p
                style={{
                  margin: "0",
                  color: "#92400e",
                  fontSize: "0.95rem",
                  lineHeight: "1.5",
                }}
              >
                {report.insights.marketStatus}
              </p>
            </div>
            <div
              style={{
                background: "linear-gradient(135deg, #ecfdf5 0%, #dcfce7 100%)",
                padding: "20px",
                borderRadius: "12px",
                border: "2px solid #10b981",
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px",
                  color: "#065f46",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                }}
              >
                Competition Level
              </h3>
              <p
                style={{
                  margin: "0",
                  color: "#065f46",
                  fontSize: "0.95rem",
                  lineHeight: "1.5",
                }}
              >
                {report.insights.competitionLevel}
              </p>
            </div>
          </div>
          <div
            style={{
              marginTop: "20px",
              background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
              padding: "20px",
              borderRadius: "12px",
              border: "2px solid #0ea5e9",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px",
                color: "#0c4a6e",
                fontSize: "1.1rem",
                fontWeight: "700",
              }}
            >
              Recommended Strategy
            </h3>
            <p
              style={{
                margin: "0 0 12px",
                color: "#0c4a6e",
                fontSize: "0.95rem",
                lineHeight: "1.5",
              }}
            >
              {report.insights.potentialStrategy}
            </p>
            <div style={{ display: "flex", gap: "20px", marginTop: "16px" }}>
              <div>
                <strong style={{ color: "#0c4a6e" }}>Time to Results:</strong>{" "}
                <span style={{ color: "#0369a1" }}>
                  {report.insights.timeToResults}
                </span>
              </div>
              <div>
                <strong style={{ color: "#0c4a6e" }}>
                  Estimated Potential:
                </strong>{" "}
                <span style={{ color: "#0369a1" }}>
                  {report.insights.estimatedPotential}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div
          style={{
            background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
            padding: "40px 30px",
            textAlign: "center" as const,
            position: "relative" as const,
            overflow: "hidden" as const,
          }}
        >
          <div
            style={{
              position: "absolute" as const,
              top: "-50px",
              left: "-50px",
              width: "200px",
              height: "200px",
              background:
                "linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute" as const,
              bottom: "-50px",
              right: "-50px",
              width: "150px",
              height: "150px",
              background:
                "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
              borderRadius: "50%",
            }}
          />
          <div style={{ position: "relative" as const, zIndex: 2 }}>
            <h2
              style={{
                margin: "0 0 16px",
                fontSize: "1.8rem",
                fontWeight: "700",
                color: "white",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Ready to Unlock Your SEO Potential?
            </h2>
            <p
              style={{
                margin: "0 0 24px",
                fontSize: "1.1rem",
                color: "rgba(255,255,255,0.9)",
                lineHeight: "1.6",
              }}
            >
              Our SEO experts are ready to help you capture this{" "}
              <strong style={{ color: "#fbbf24" }}>
                {formatCurrency(report.potentialRevenue)}
              </strong>{" "}
              monthly opportunity.
            </p>
            <a
              href={`${process.env.NEXT_PUBLIC_APP_URL}/schedule-call?ref=email&scope=${basicInfo.analysisScope}`}
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                color: "white",
                padding: "16px 32px",
                borderRadius: "12px",
                textDecoration: "none",
                fontSize: "1.1rem",
                fontWeight: "700",
                textTransform: "uppercase" as const,
                letterSpacing: "0.5px",
                boxShadow: "0 8px 25px rgba(249, 115, 22, 0.4)",
                transition: "all 0.3s ease",
              }}
            >
              Schedule Your Free SEO Strategy Call
            </a>
            <p
              style={{
                margin: "20px 0 0",
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.7)",
                lineHeight: "1.4",
              }}
            >
              🎯 30-minute strategy session • 📊 Custom action plan • 🚀 No
              obligation
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: "#f8fafc",
          padding: "30px",
          textAlign: "center" as const,
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <p style={{ margin: "0 0 12px", fontSize: "0.9rem", color: "#6b7280" }}>
          This report was generated by our advanced SEO analysis system
        </p>
        <p style={{ margin: "0", fontSize: "0.8rem", color: "#9ca3af" }}>
          © 2024 SEO Opportunity Calculator. All rights reserved.
        </p>
      </div>
    </div>
  );
}
