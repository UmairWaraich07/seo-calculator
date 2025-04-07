import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResultsOverviewProps {
  reportData: any;
  basicInfo: any;
}

export const ResultsOverview = ({
  reportData,
  basicInfo,
}: ResultsOverviewProps) => {
  const {
    totalSearchVolume,
    potentialTraffic,
    conversionRate,
    potentialCustomers,
    potentialRevenue,
    currentRankings,
    competitorRankings,
    analysisScope,
    analysisInsights,
  } = reportData;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Prepare data for the rankings chart
  const rankingsData = [
    {
      name: "Your Website",
      top3: currentRankings.top3,
      top10: currentRankings.top10 - currentRankings.top3,
      top50: currentRankings.top50 - currentRankings.top10,
      top100: currentRankings.top100 - currentRankings.top50,
    },
    ...(competitorRankings || []).map((competitor: any) => ({
      name: competitor.name,
      top3: competitor.top3,
      top10: competitor.top10 - competitor.top3,
      top50: competitor.top50 - competitor.top10,
      top100: competitor.top100 - competitor.top50,
      source: competitor.source,
    })),
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">SEO Opportunity Report</h2>
        <Badge
          variant={analysisScope === "local" ? "default" : "secondary"}
          className="flex items-center gap-1"
        >
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

      <Card className="p-6 bg-primary/5 border-primary/20">
        <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
        <p className="text-lg mb-4">
          There are currently{" "}
          <span className="font-bold">
            {totalSearchVolume.toLocaleString()}
          </span>{" "}
          searches per month
          {analysisScope === "local"
            ? ` in ${basicInfo.location}`
            : " nationwide"}{" "}
          for keywords that could drive your business. If you captured that
          traffic and converted even{" "}
          <span className="font-bold">{conversionRate}%</span>, that would be{" "}
          <span className="font-bold">{potentialCustomers}</span> new customers
          every month.
        </p>
        <p className="text-lg">
          Based on your average customer value of{" "}
          <span className="font-bold">
            {formatCurrency(basicInfo.customerValue)}
          </span>
          , that means SEO could drive you{" "}
          <span className="font-bold text-primary">
            {formatCurrency(potentialRevenue)}
          </span>{" "}
          additional revenue per month if you were ranked #1 for all keyword
          terms.
        </p>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Current Ranking Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">
                {currentRankings.top3}
              </div>
              <div className="text-sm text-slate-600">Top 3 Rankings</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">
                {currentRankings.top10}
              </div>
              <div className="text-sm text-slate-600">Top 10 Rankings</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">
                {currentRankings.top50}
              </div>
              <div className="text-sm text-slate-600">Top 50 Rankings</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">
                {currentRankings.top100}
              </div>
              <div className="text-sm text-slate-600">Top 100 Rankings</div>
            </div>
          </div>
          <p className="text-slate-600">
            Out of {currentRankings.total} relevant keywords, your website
            currently ranks in the top 100 for {currentRankings.top100}{" "}
            keywords.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Competitor Comparison</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rankingsData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="top3" stackId="a" fill="#4ade80" name="Top 3" />
                <Bar
                  dataKey="top10"
                  stackId="a"
                  fill="#60a5fa"
                  name="Top 4-10"
                />
                <Bar
                  dataKey="top50"
                  stackId="a"
                  fill="#a78bfa"
                  name="Top 11-50"
                />
                <Bar
                  dataKey="top100"
                  stackId="a"
                  fill="#f87171"
                  name="Top 51-100"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6 mt-6">
        <h2 className="text-2xl font-bold mb-6">Analysis Insights</h2>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="pt-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Key Metrics</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-slate-600">
                      Monthly Search Volume:
                    </span>
                    <span className="font-medium">
                      {totalSearchVolume.toLocaleString()}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-slate-600">
                      Potential Monthly Traffic:
                    </span>
                    <span className="font-medium">
                      {potentialTraffic.toLocaleString()}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-slate-600">Conversion Rate:</span>
                    <span className="font-medium">{conversionRate}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-slate-600">
                      Potential Monthly Customers:
                    </span>
                    <span className="font-medium">{potentialCustomers}</span>
                  </li>
                  <li className="flex justify-between border-t pt-2">
                    <span className="text-slate-600">
                      Potential Monthly Revenue:
                    </span>
                    <span className="font-bold text-primary">
                      {formatCurrency(potentialRevenue)}
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">
                  {analysisScope === "local"
                    ? "Local SEO Insights"
                    : "National SEO Insights"}
                </h3>
                <ul className="space-y-2">
                  {analysisScope === "local" ? (
                    <>
                      <li className="flex justify-between">
                        <span className="text-slate-600">
                          Google Maps Ranking Factor:
                        </span>
                        <span className="font-medium">
                          {analysisInsights.googleMapsRankingFactor}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-slate-600">
                          Local Pack Opportunities:
                        </span>
                        <span className="font-medium">
                          {analysisInsights.localPackOpportunities}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-slate-600">
                          "Near Me" Searches:
                        </span>
                        <span className="font-medium">
                          {analysisInsights.nearMeSearches}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-slate-600">
                          Local Competitor Strength:
                        </span>
                        <span className="font-medium">
                          {analysisInsights.localCompetitorStrength}
                        </span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex justify-between">
                        <span className="text-slate-600">
                          Competitive Difficulty:
                        </span>
                        <span className="font-medium">
                          {analysisInsights.competitiveDifficulty}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-slate-600">
                          Content Gap Opportunities:
                        </span>
                        <span className="font-medium">
                          {analysisInsights.contentGaps}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-slate-600">
                          Backlink Opportunities:
                        </span>
                        <span className="font-medium">
                          {analysisInsights.backlinkOpportunities}
                        </span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="competitors" className="pt-4">
            <div className="space-y-4">
              <p className="text-slate-600">
                {analysisScope === "local"
                  ? `These are your top local competitors in ${basicInfo.location}.`
                  : "These are your top national competitors in organic search."}
              </p>

              <div className="grid gap-4">
                {competitorRankings.map((competitor: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{competitor.name}</h4>
                        <p className="text-sm text-slate-500">
                          {competitor.url}
                        </p>
                      </div>
                      <Badge variant="outline">{competitor.source}</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {competitor.top3}
                        </div>
                        <div className="text-xs text-slate-500">Top 3</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {competitor.top10}
                        </div>
                        <div className="text-xs text-slate-500">Top 10</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {competitor.top50}
                        </div>
                        <div className="text-xs text-slate-500">Top 50</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {competitor.top100}
                        </div>
                        <div className="text-xs text-slate-500">Top 100</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="pt-4">
            <div className="space-y-4">
              <p className="text-slate-600">
                Based on our {analysisScope} analysis, here are our top
                recommendations:
              </p>

              <ul className="space-y-2">
                {analysisInsights.recommendedActions.map(
                  (action: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-2" />
                      <span>{action}</span>
                    </li>
                  )
                )}
              </ul>

              <div className="bg-slate-50 p-4 rounded-lg mt-6">
                <h4 className="font-medium mb-2">Next Steps</h4>
                <p className="text-sm text-slate-600">
                  Schedule a consultation with our SEO experts to discuss how we
                  can implement these recommendations and help you achieve the
                  potential {formatCurrency(potentialRevenue)} in monthly
                  revenue.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </>
  );
};
