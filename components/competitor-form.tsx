"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { CompetitorInfo } from "./calculator"
import { LoadingSpinner } from "./loading-spinner"

const formSchema = z.object({
  competitors: z.array(z.string().url("Please enter a valid URL").or(z.string().length(0))).min(1),
})

interface CompetitorFormProps {
  onSubmit: (data: CompetitorInfo) => void
  competitorType: "manual" | "auto"
  initialValues: CompetitorInfo
}

export const CompetitorForm = ({ onSubmit, competitorType, initialValues }: CompetitorFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [autoCompetitors, setAutoCompetitors] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      competitors: initialValues.competitors,
    },
  })

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    // Filter out empty competitor URLs
    const filteredCompetitors = data.competitors.filter((url) => url.trim() !== "")
    onSubmit({ competitors: filteredCompetitors })
  }

  const detectCompetitors = async () => {
    setIsLoading(true)
    try {
      // This would be replaced with an actual API call to detect competitors
      // For now, we'll simulate a delay and return some fake data
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const fakeCompetitors = ["https://competitor1.com", "https://competitor2.com", "https://competitor3.com"]

      setAutoCompetitors(fakeCompetitors)
      form.setValue("competitors", fakeCompetitors)
    } catch (error) {
      console.error("Error detecting competitors:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-detect competitors if that option was selected
  useState(() => {
    if (competitorType === "auto") {
      detectCompetitors()
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              {competitorType === "auto" ? "Detected Competitors" : "Enter Your Competitors"}
            </h3>
            {competitorType === "auto" && (
              <Button type="button" variant="outline" size="sm" onClick={detectCompetitors} disabled={isLoading}>
                {isLoading ? <LoadingSpinner size="sm" /> : "Re-detect"}
              </Button>
            )}
          </div>

          {isLoading && competitorType === "auto" ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <LoadingSpinner />
              <p className="mt-4 text-sm text-slate-500">Detecting your top competitors...</p>
            </div>
          ) : (
            <>
              {[0, 1, 2, 3, 4].map((index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`competitors.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competitor {index + 1} URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://competitor.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          Continue
        </Button>
      </form>
    </Form>
  )
}

