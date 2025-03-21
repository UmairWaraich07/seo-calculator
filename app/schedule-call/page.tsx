import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Clock, Phone } from "lucide-react"

export default function ScheduleCallPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <div className="container px-4 mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
            Schedule a Free SEO Consultation
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Let's discuss your SEO report and how we can help you achieve your business goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Calendar className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium text-lg">Choose a Date & Time</h3>
                  <p className="text-slate-600">Select a convenient time for your 30-minute consultation.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium text-lg">Expert Consultation</h3>
                  <p className="text-slate-600">
                    Speak with an SEO specialist who will analyze your report and provide actionable insights.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium text-lg">Quick Response</h3>
                  <p className="text-slate-600">We'll confirm your appointment within 24 hours.</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Available Time Slots</h2>

            <div className="space-y-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                <div key={day} className="border-b pb-4">
                  <h3 className="font-medium mb-2">{day}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"].map((time) => (
                      <Button key={time} variant="outline" className="justify-start">
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button asChild className="w-full">
                <Link href="/contact">Contact Us Directly</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}

