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

  // Generate keyword table rows - remove keyword difficulty column
  const keywordRows = keywordData
    .slice(0, 50) // Limit to top 50 keywords
    .map(
      (kw: any) => `
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">${kw.keyword} ${
        kw.isLocal
          ? '<span style="font-size: 10px; background-color: #e2e8f0; border-radius: 9999px; padding: 2px 6px; margin-left: 4px;">Local</span>'
          : ""
      }</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${kw.searchVolume.toLocaleString()}</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center; ${
        kw.clientRank === "Not ranked"
          ? "color: #64748b;"
          : kw.clientRank <= 3
          ? "color: #22c55e; font-weight: 600;"
          : kw.clientRank <= 10
          ? "color: #3b82f6; font-weight: 600;"
          : kw.clientRank <= 50
          ? "color: #f59e0b;"
          : "color: #ef4444;"
      }">${kw.clientRank}</td>
    </tr>
  `
    )
    .join("");

  // Generate competitor ranking comparison
  const competitorComparison = competitorRankings
    .map(
      (competitor: any) => `
     <tr>
       <td style="padding: 12px; border: 1px solid #ddd;">${competitor.name} <span style="font-size: 10px; color: #64748b;">(${competitor.source})</span></td>
       <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${competitor.top3}</td>
       <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${competitor.top10}</td>
       <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${competitor.top50}</td>
       <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${competitor.top100}</td>
     </tr>
   `
    )
    .join("");

  // Generate analysis-specific insights
  const analysisSpecificInsights =
    analysisScope === "local"
      ? `
     <div style="margin-top: 30px; background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
       <h3 style="color: #0369a1; margin-top: 0; font-size: 18px;">Local SEO Insights</h3>
       <ul style="margin-bottom: 0; padding-left: 20px;">
         <li style="margin-bottom: 8px;"><strong>Google Maps Ranking Factor:</strong> <span style="color: #0369a1;">${analysisInsights.googleMapsRankingFactor}</span></li>
         <li style="margin-bottom: 8px;"><strong>Local Pack Opportunities:</strong> <span style="color: #0369a1;">${analysisInsights.localPackOpportunities}</span></li>
         <li style="margin-bottom: 8px;"><strong>"Near Me" Searches:</strong> <span style="color: #0369a1;">${analysisInsights.nearMeSearches}</span></li>
         <li style="margin-bottom: 8px;"><strong>Local Competitor Strength:</strong> <span style="color: #0369a1;">${analysisInsights.localCompetitorStrength}</span></li>
       </ul>
     </div>
   `
      : `
     <div style="margin-top: 30px; background-color: #f0f7ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
       <h3 style="color: #1d4ed8; margin-top: 0; font-size: 18px;">National SEO Insights</h3>
       <ul style="margin-bottom: 0; padding-left: 20px;">
         <li style="margin-bottom: 8px;"><strong>Competitive Difficulty:</strong> <span style="color: #1d4ed8;">${analysisInsights.competitiveDifficulty}</span></li>
         <li style="margin-bottom: 8px;"><strong>Content Gap Opportunities:</strong> <span style="color: #1d4ed8;">${analysisInsights.contentGaps}</span></li>
         <li style="margin-bottom: 8px;"><strong>Backlink Opportunities:</strong> <span style="color: #1d4ed8;">${analysisInsights.backlinkOpportunities}</span></li>
       </ul>
     </div>
   `;

  // Generate recommended actions
  const recommendedActions = analysisInsights.recommendedActions
    .map(
      (action: string) =>
        `<li style="margin-bottom: 10px; padding-left: 5px;"><div style="display: flex; align-items: flex-start;"><span style="color: ${
          analysisScope === "local" ? "#0ea5e9" : "#3b82f6"
        }; font-size: 18px; margin-right: 10px;">→</span><span>${action}</span></div></li>`
    )
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
        background-color: #f8fafc;
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
        max-width: 650px; 
        margin: 0 auto; 
        padding: 20px; 
      }
      .header { 
        text-align: center; 
        margin-bottom: 30px; 
        padding: 30px 20px;
        background-color: #ffffff;
        border-bottom: 3px solid #2563eb;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      }
      .section { 
        margin-bottom: 30px; 
        background-color: #ffffff;
        border-radius: 8px;
        padding: 25px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      }
      .highlight { 
        background-color: #f8f9fa; 
        padding: 20px; 
        border-radius: 8px; 
        margin-bottom: 20px; 
        border-left: 4px solid #2563eb;
      }
      .stats-container {
        width: 100%;
        margin-bottom: 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .stat-box { 
        text-align: center; 
        padding: 15px; 
        background-color: #f0f4f8; 
        border-radius: 8px; 
        width: 22%; 
        margin-bottom: 15px;
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
        border-radius: 8px;
        overflow: hidden;
      }
      th { 
        background-color: #f1f5f9; 
        text-align: left; 
        padding: 12px; 
        border: 1px solid #ddd; 
        font-weight: 600;
      }
      td { 
        padding: 12px; 
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
        padding: 14px 28px; 
        text-decoration: none; 
        border-radius: 8px; 
        font-weight: bold; 
        font-size: 16px;
        box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
      }
      .button:hover {
        background-color: #1d4ed8;
      }
      .footer {
        text-align: center;
        margin-top: 40px; 
        padding: 20px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        font-size: 12px; 
        color: #64748b; 
      }
      .badge {
        display: inline-block;
        padding: 6px 12px;
        font-size: 14px;
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
      .section-title {
        color: #1e3a8a; 
        border-bottom: 1px solid #e2e8f0; 
        padding-bottom: 10px;
        font-size: 22px;
        margin-top: 0;
      }
      .key-metric {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #f1f5f9;
      }
      .key-metric:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }
      .key-metric-label {
        color: #64748b;
      }
      .key-metric-value {
        font-weight: 600;
      }
      .key-metric-highlight {
        color: #2563eb;
        font-weight: 700;
      }
      @media only screen and (max-width: 600px) {
        .stat-box {
          width: 46%;
        }
        .container {
          padding: 10px;
        }
        .section {
          padding: 15px;
        }
      }
    </style>
  </head>
  <body>
    <div class="preheader">${previewText}</div>
    <div class="container">
      <div class="header">
        <h1 style="color: #1e3a8a; margin-bottom: 5px; font-size: 28px;">Your SEO Opportunity Report</h1>
        <p style="margin-top: 0; color: #64748b; font-size: 16px;">Prepared for ${
          basicInfo.businessUrl
        }</p>
        <div style="margin-top: 15px;">
          <span class="badge badge-${
            analysisScope === "local" ? "local" : "national"
          }">
            ${
              analysisScope === "local" ? "Local Analysis" : "National Analysis"
            }
          </span>
        </div>
      </div>
      
      <div class="section">
        <h2 class="section-title">Executive Summary</h2>
        <div class="highlight">
          <p style="font-size: 16px;">There are currently <strong>${totalSearchVolume.toLocaleString()}</strong> searches per month ${
    analysisScope === "local" ? `in ${basicInfo.location}` : "nationwide"
  } for keywords that could drive your business. If you captured that traffic and converted even <strong>${conversionRate}%</strong>, that would be <strong>${potentialCustomers}</strong> new customers every month.</p>
          <p style="font-size: 16px;">Based on your average customer value of <strong>${formatCurrency(
            basicInfo.customerValue
          )}</strong>, that means SEO could drive you <strong style="color: #2563eb; font-size: 18px;">${formatCurrency(
    potentialRevenue
  )}</strong> additional revenue per month if you were ranked #1 for all keyword terms below.</p>
        </div>
        
        ${analysisSpecificInsights}
      </div>
      
      <div class="section">
        <h2 class="section-title">Current Ranking Overview</h2>
        <p>Out of ${
          currentRankings.total
        } relevant keywords, your website currently ranks:</p>
        
        <div class="stats-container">
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
      
      <div class="section">
        <h2 class="section-title">Competitor Comparison</h2>
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
        <h2 class="section-title">Traffic Potential</h2>
        <p>If you ranked #1 for all these keywords, you could receive approximately <strong>${potentialTraffic.toLocaleString()}</strong> visitors per month.</p>
        
        <div class="highlight">
          <div class="key-metric">
            <span class="key-metric-label">Monthly Search Volume:</span>
            <span class="key-metric-value">${totalSearchVolume.toLocaleString()}</span>
          </div>
          <div class="key-metric">
            <span class="key-metric-label">Potential Monthly Traffic:</span>
            <span class="key-metric-value">${potentialTraffic.toLocaleString()}</span>
          </div>
          <div class="key-metric">
            <span class="key-metric-label">Conversion Rate:</span>
            <span class="key-metric-value">${conversionRate}%</span>
          </div>
          <div class="key-metric">
            <span class="key-metric-label">Potential Monthly Customers:</span>
            <span class="key-metric-value">${potentialCustomers}</span>
          </div>
          <div class="key-metric">
            <span class="key-metric-label">Potential Monthly Revenue:</span>
            <span class="key-metric-value key-metric-highlight">${formatCurrency(
              potentialRevenue
            )}</span>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h2 class="section-title">Recommended Actions</h2>
        <p>Based on our ${analysisScope} analysis, here are our top recommendations:</p>
        
        <ul style="margin-bottom: 20px; padding-left: 10px; list-style-type: none;">
          ${recommendedActions}
        </ul>
      </div>
      
      <div class="section">
        <h2 class="section-title">Top Keywords & Opportunities</h2>
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
