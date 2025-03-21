import { Progress } from "@/components/ui/progress"
import { LoadingSpinner } from "./loading-spinner"

interface ProcessingScreenProps {
  progress: number
}

export const ProcessingScreen = ({ progress }: ProcessingScreenProps) => {
  const getStatusMessage = () => {
    if (progress < 25) {
      return "Analyzing your website..."
    } else if (progress < 50) {
      return "Gathering competitor data..."
    } else if (progress < 75) {
      return "Collecting keyword rankings..."
    } else {
      return "Calculating revenue opportunities..."
    }
  }

  return (
    <div className="py-8 flex flex-col items-center justify-center">
      <LoadingSpinner />
      <div className="mt-8 w-full max-w-md">
        <Progress value={progress} className="h-2" />
        <p className="mt-4 text-center text-slate-600">{getStatusMessage()}</p>
        <p className="mt-2 text-center text-sm text-slate-500">
          This may take a few minutes. We're analyzing your website and competitors to identify SEO opportunities.
        </p>
      </div>
    </div>
  )
}

