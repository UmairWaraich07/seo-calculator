import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ResultsOverviewProps {
  reportData: any
  basicInfo: any
}

export const ResultsOverview = ({ reportData, basicInfo }: ResultsOverviewProps) => {
  const {
    totalSearchVolume,
    potentialTraffic,
    conversionRate,
    potentialCustomers,
    potentialRevenue,
    currentRankings,
    competitorRankings,
  } = reportData

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

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
    })),
  ]

  return (
    <>
      <Card className="p-6 bg-primary/5 border-primary/20">
        <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
        <p className="text-lg mb-4">
          There are currently <span className="font-bold">{totalSearchVolume.toLocaleString()}</span> searches per month
          in your area for keywords that could drive your business. If you captured that traffic and converted even{" "}
          <span className="font-bold">{conversionRate}%</span>, that would be{" "}
          <span className="font-bold">{potentialCustomers}</span> new customers every month.
        </p>
        <p className="text-lg">
          Based on your average customer value of{" "}
          <span className="font-bold">{formatCurrency(basicInfo.customerValue)}</span>, that means SEO could drive you{" "}
          <span className="font-bold text-primary">{formatCurrency(potentialRevenue)}</span> additional revenue per
          month if you were ranked #1 for all keyword terms.
        </p>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Current Ranking Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">{currentRankings.top3}</div>
              <div className="text-sm text-slate-600">Top 3 Rankings</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">{currentRankings.top10}</div>
              <div className="text-sm text-slate-600">Top 10 Rankings</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">{currentRankings.top50}</div>
              <div className="text-sm text-slate-600">Top 50 Rankings</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">{currentRankings.top100}</div>
              <div className="text-sm text-slate-600">Top 100 Rankings</div>
            </div>
          </div>
          <p className="text-slate-600">
            Out of {currentRankings.total} relevant keywords, your website currently ranks in the top 100 for{" "}
            {currentRankings.top100} keywords.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Competitor Comparison</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rankingsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="top3" stackId="a" fill="#4ade80" name="Top 3" />
                <Bar dataKey="top10" stackId="a" fill="#60a5fa" name="Top 4-10" />
                <Bar dataKey="top50" stackId="a" fill="#a78bfa" name="Top 11-50" />
                <Bar dataKey="top100" stackId="a" fill="#f87171" name="Top 51-100" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </>
  )
}

