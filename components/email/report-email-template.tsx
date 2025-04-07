import { formatCurrency } from "@/lib/email";

interface ReportEmailTemplateProps {
  report: any;
  basicInfo: any;
  previewText: string;
}

export function ReportEmailTemplate({
  report,
  basicInfo,
  previewText,
}: ReportEmailTemplateProps): string {
  const {
    totalSearchVolume,
    potentialTraffic,
    conversionRate,
    potentialCustomers,
    potentialRevenue,
    currentRankings,
    competitorRankings,
    keywordData,
    analysisScope,
    analysisInsights,
  } = report;

  // Generate keyword table rows
  const keywordRows = keywordData
    .slice(0, 50) // Limit to top 50 keywords
    .map(
      (kw: any) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${kw.keyword} ${
        kw.isLocal
          ? '<span style="font-size: 10px; background-color: #e2e8f0; border-radius: 9999px; padding: 2px 6px; margin-left: 4px;">Local</span>'
          : ""
      }</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${kw.searchVolume.toLocaleString()}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${
          kw.clientRank
        }</td>
      </tr>
    `
    )
    .join("");

  // Generate competitor ranking comparison
  const competitorComparison = competitorRankings
    .map(
      (competitor: any) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${competitor.name} <span style="font-size: 10px; color: #64748b;">(${competitor.source})</span></td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${competitor.top3}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${competitor.top10}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${competitor.top50}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${competitor.top100}</td>
      </tr>
    `
    )
    .join("");

  // Generate analysis-specific insights
  const analysisSpecificInsights =
    analysisScope === "local"
      ? `
      <div style="margin-top: 30px; background-color: #f0f9ff; padding: 20px; border-radius: 5px; border-left: 4px solid #0ea5e9;">
        <h3 style="color: #0369a1; margin-top: 0;">Local SEO Insights</h3>
        <ul style="margin-bottom: 0;">
          <li>Google Maps Ranking Factor: <strong>${analysisInsights.googleMapsRankingFactor}</strong></li>
          <li>Local Pack Opportunities: <strong>${analysisInsights.localPackOpportunities}</strong></li>
          <li>"Near Me" Searches: <strong>${analysisInsights.nearMeSearches}</strong></li>
          <li>Local Competitor Strength: <strong>${analysisInsights.localCompetitorStrength}</strong></li>
        </ul>
      </div>
    `
      : `
      <div style="margin-top: 30px; background-color: #f0f7ff; padding: 20px; border-radius: 5px; border-left: 4px solid #3b82f6;">
        <h3 style="color: #1d4ed8; margin-top: 0;">National SEO Insights</h3>
        <ul style="margin-bottom: 0;">
          <li>Competitive Difficulty: <strong>${analysisInsights.competitiveDifficulty}</strong></li>
          <li>Content Gap Opportunities: <strong>${analysisInsights.contentGaps}</strong></li>
          <li>Backlink Opportunities: <strong>${analysisInsights.backlinkOpportunities}</strong></li>
        </ul>
      </div>
    `;

  // Generate recommended actions
  const recommendedActions = analysisInsights.recommendedActions
    .map((action: string) => `<li>${action}</li>`)
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Your SEO Opportunity Report</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .preheader {
          display: none !important;
          visibility: hidden;
          mso-hide: all;
          font-size: 1px;
          line-height: 1px;
          max-height: 0;
          max-width: 0;
          opacity: 0;
          overflow: hidden;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          padding: 20px;
          background-color: #f8f9fa;
          border-bottom: 3px solid #2563eb;
        }
        .section { 
          margin-bottom: 30px; 
        }
        .highlight { 
          background-color: #f8f9fa; 
          padding: 20px; 
          border-radius: 5px; 
          margin-bottom: 20px; 
          border-left: 4px solid #2563eb;
        }
        .stats-container {
          width: 100%;
          margin-bottom: 20px;
        }
        .stats-row {
          display: block;
          width: 100%;
          text-align: center;
        }
        .stat-box { 
          display: inline-block;
          text-align: center; 
          padding: 15px; 
          background-color: #f0f4f8; 
          border-radius: 5px; 
          width: 22%; 
          margin: 0 1%;
          vertical-align: top;
        }
        .stat-value { 
          font-size: 24px; 
          font-weight: bold; 
          color: #2563eb; 
          margin-bottom: 5px; 
        }
        .stat-label { 
          font-size: 14px; 
          color: #64748b; 
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-bottom: 20px; 
        }
        th { 
          background-color: #f1f5f9; 
          text-align: left; 
          padding: 10px; 
          border: 1px solid #ddd; 
        }
        td { 
          padding: 8px; 
          border: 1px solid #ddd; 
        }
        .cta { 
          text-align: center; 
          margin-top: 30px; 
          margin-bottom: 30px;
        }
        .button { 
          display: inline-block; 
          background-color: #2563eb; 
          color: white !important; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 5px; 
          font-weight: bold; 
        }
        .footer {
          text-align: center;
          margin-top: 40px; 
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 12px; 
          color: #64748b; 
        }
        .badge {
          display: inline-block;
          padding: 4px 8px;
          font-size: 12px;
          font-weight: 600;
          line-height: 1;
          border-radius: 9999px;
          margin-left: 8px;
          color: white;
        }
        .badge-local {
          background-color: #2563eb;
        }
        .badge-national {
          background-color: #6b7280;
        }
        @media only screen and (max-width: 600px) {
          .stat-box {
            width: 46%;
            margin-bottom: 10px;
          }
        }
      </style>
    </head>
    <body>
      <div class="preheader">${previewText}</div>
      <div class="container">
        <div class="header">
          <h1 style="color: #1e3a8a; margin-bottom: 5px;">Your SEO Opportunity Report</h1>
          <p style="margin-top: 0; color: #64748b;">Prepared for ${
            basicInfo.businessUrl
          }</p>
          <div style="margin-top: 10px;">
            <span class="badge badge-${
              analysisScope === "local" ? "local" : "national"
            }">
              ${
                analysisScope === "local"
                  ? "Local Analysis"
                  : "National Analysis"
              }
            </span>
          </div>
        </div>
        
        <div class="section">
          <h2 style="color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Executive Summary</h2>
          <div class="highlight">
            <p>There are currently <strong>${totalSearchVolume.toLocaleString()}</strong> searches per month ${
    analysisScope === "local" ? `in ${basicInfo.location}` : "nationwide"
  } for keywords that could drive your business. If you captured that traffic and converted even <strong>${conversionRate}%</strong>, that would be <strong>${potentialCustomers}</strong> new customers every month.</p>
            <p>Based on your average customer value of <strong>${formatCurrency(
              basicInfo.customerValue
            )}</strong>, that means SEO could drive you <strong>${formatCurrency(
    potentialRevenue
  )}</strong> additional revenue per month if you were ranked #1 for all keyword terms below.</p>
          </div>
          
          ${analysisSpecificInsights}
        </div>
        
        <div class="section">
          <h2 style="color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Current Ranking Overview</h2>
          <p>Out of ${
            currentRankings.total
          } relevant keywords, your website currently ranks:</p>
          
          <div class="stats-container">
            <div class="stats-row">
              <div class="stat-box">
                <div class="stat-value">${currentRankings.top3}</div>
                <div class="stat-label">Top 3</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${currentRankings.top10}</div>
                <div class="stat-label">Top 10</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${currentRankings.top50}</div>
                <div class="stat-label">Top 50</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${currentRankings.top100}</div>
                <div class="stat-label">Top 100</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2 style="color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Competitor Comparison</h2>
          <p>See how your rankings compare to your ${
            analysisScope === "local" ? "local" : "national"
          } competitors:</p>
          
          <table>
            <thead>
              <tr>
                <th>Website</th>
                <th style="text-align: center;">Top 3</th>
                <th style="text-align: center;">Top 10</th>
                <th style="text-align: center;">Top 50</th>
                <th style="text-align: center;">Top 100</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: bold;">${basicInfo.businessUrl}</td>
                <td style="text-align: center; font-weight: bold;">${
                  currentRankings.top3
                }</td>
                <td style="text-align: center; font-weight: bold;">${
                  currentRankings.top10
                }</td>
                <td style="text-align: center; font-weight: bold;">${
                  currentRankings.top50
                }</td>
                <td style="text-align: center; font-weight: bold;">${
                  currentRankings.top100
                }</td>
              </tr>
              ${competitorComparison}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h2 style="color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Traffic Potential</h2>
          <p>If you ranked #1 for all these keywords, you could receive approximately <strong>${potentialTraffic.toLocaleString()}</strong> visitors per month.</p>
          
          <div class="highlight">
            <p>With an ${
              analysisScope === "local" ? "local" : "industry"
            } average conversion rate of <strong>${conversionRate}%</strong>, this traffic could generate <strong>${potentialCustomers}</strong> new customers per month.</p>
            <p>At your average customer value of <strong>${formatCurrency(
              basicInfo.customerValue
            )}</strong>, this represents a potential monthly revenue of <strong>${formatCurrency(
    potentialRevenue
  )}</strong>.</p>
          </div>
        </div>
        
        <div class="section">
          <h2 style="color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Recommended Actions</h2>
          <p>Based on our ${analysisScope} analysis, here are our top recommendations:</p>
          
          <ul style="margin-bottom: 20px;">
            ${recommendedActions}
          </ul>
        </div>
        
        <div class="section">
          <h2 style="color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Top Keywords & Opportunities</h2>
          <p>Here are the top keywords we analyzed for your business:</p>
          
          <table>
            <thead>
              <tr>
                <th>Keyword</th>
                <th style="text-align: center;">Monthly Searches</th>
                <th style="text-align: center;">Current Rank</th>
              </tr>
            </thead>
            <tbody>
              ${keywordRows}
            </tbody>
          </table>
        </div>
        
        <div class="cta">
          <p style="font-size: 18px; margin-bottom: 15px;">Ready to unlock your SEO potential?</p>
          <a href="https://youragency.com/schedule" class="button">Schedule a Free Consultation</a>
        </div>
        
        <div class="cta" style="margin-top: 15px;">
          <a href="https://youragency.com/get-started" style="color: #2563eb; text-decoration: underline;">Get Started Now</a>
        </div>
        
        <div class="footer">
          <p>This report was generated based on current search data and industry averages. Actual results may vary.</p>
          <p>© ${new Date().getFullYear()} Your Agency Name. All rights reserved.</p>
          <p>123 SEO Street, Digital City, DC 12345</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
