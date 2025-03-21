import { Suspense } from "react"
import { Calculator } from "@/components/calculator"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <div className="container px-4 mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
            SEO Opportunity Calculator
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover your untapped SEO potential and calculate the revenue impact of ranking higher for your most
            valuable keywords.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <Suspense fallback={<LoadingSpinner />}>
            <Calculator />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

