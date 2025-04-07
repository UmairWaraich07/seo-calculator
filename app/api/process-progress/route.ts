import { NextResponse } from "next/server";

// Store progress updates for each session
const progressStore: Record<string, { stage: string; progress: number }> = {};

// This endpoint will be used to stream progress updates to the client
export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 }
    );
  }

  // Create a response with event stream headers
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Initialize progress for this session if it doesn't exist
      if (!progressStore[sessionId]) {
        progressStore[sessionId] = { stage: "initializing", progress: 0 };
      }

      // Function to send current progress
      const sendProgress = () => {
        const currentProgress = progressStore[sessionId] || {
          stage: "initializing",
          progress: 0,
        };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(currentProgress)}\n\n`)
        );

        // If processing is complete, close the stream
        if (currentProgress.progress >= 100) {
          controller.close();
          // Clean up
          delete progressStore[sessionId];
          return false;
        }
        return true;
      };

      // Send initial progress
      sendProgress();

      // Set up interval to check for progress updates
      const intervalId = setInterval(() => {
        const shouldContinue = sendProgress();
        if (!shouldContinue) {
          clearInterval(intervalId);
        }
      }, 1000);

      // Clean up when the client disconnects
      request.signal.addEventListener("abort", () => {
        clearInterval(intervalId);
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// Export a function to update progress that can be called from other API routes
export function updateProgress(
  sessionId: string,
  stage: string,
  progress: number
) {
  if (sessionId) {
    progressStore[sessionId] = { stage, progress };
  }
}
