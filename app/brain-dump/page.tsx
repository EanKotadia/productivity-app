"use client"

import { useState, useEffect } from "react"
import { Brain, Sparkles, CheckSquare, Calendar, BarChart3, FileText, Loader2, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function BrainDumpPage() {
  const [dumpText, setDumpText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState("")
  const [processedData, setProcessedData] = useState<any>(null)
  const [showResults, setShowResults] = useState(false)
  const [progress, setProgress] = useState(0)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])
  const router = useRouter()
  const { user } = useAuth()

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
    }))
    setParticles(newParticles)
  }, [])

  const processBrainDump = async (text: string) => {
    if (!user) throw new Error("User not authenticated")

    try {
      setProgress(10)
      setProcessingStep("🧠 Initializing AI analysis...")
      await new Promise((resolve) => setTimeout(resolve, 800))

      setProgress(30)
      setProcessingStep("🔍 Scanning for tasks and deadlines...")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const response = await fetch("/api/brain-dump", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          userId: user.id,
        }),
      })

      setProgress(60)
      setProcessingStep("⚡ Processing with OpenAI GPT-4o...")
      await new Promise((resolve) => setTimeout(resolve, 1200))

      if (!response.ok) {
        throw new Error("Failed to process brain dump")
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Processing failed")
      }

      setProgress(80)
      setProcessingStep("📊 Structuring your data...")
      await new Promise((resolve) => setTimeout(resolve, 800))

      setProgress(95)
      setProcessingStep("💾 Saving to dashboard...")
      await new Promise((resolve) => setTimeout(resolve, 600))

      setProgress(100)
      setProcessedData(result.data)
      setShowResults(true)
      setProcessingStep("🎉 Complete! Your thoughts are organized!")

      return result.data
    } catch (error) {
      console.error("Error processing brain dump:", error)
      throw error
    }
  }

  const handleAnalyze = async () => {
    if (!dumpText.trim()) return

    setIsProcessing(true)
    setShowResults(false)
    setProgress(0)
    try {
      await processBrainDump(dumpText)
    } catch (error) {
      console.error("Processing failed:", error)
      setProcessingStep("❌ Processing failed. Please try again.")
    } finally {
      setTimeout(() => setIsProcessing(false), 2000)
    }
  }

  const goToDashboard = () => {
    router.push("/")
  }

  const tryExample = (example: string) => {
    setDumpText(example)
    setShowResults(false)
    setProcessedData(null)
    setProgress(0)
  }

  const exampleDumps = [
    {
      title: "Mixed Academic Tasks",
      text: "Math exam May 30 need to study chapters 5-7 | Finish chemistry lab report due Friday | Biology class every Monday 10am | Group project meeting Wednesday 3pm | Read Shakespeare Act 2 for English | Physics homework problems 1-15 | Study for Spanish quiz next week",
      icon: "📚",
    },
    {
      title: "Research Project",
      text: "Thesis outline due next week | Interview 3 people for research by June 1 | Library books due Thursday | Literature review draft | Methodology section needs work | Data analysis using SPSS | Presentation slides for defense",
      icon: "🔬",
    },
    {
      title: "Exam Preparation",
      text: "Calculus final exam June 5 | Review integration techniques | Practice problems from textbook | Study group Tuesday 7pm | Office hours Wednesday | Make formula sheet | Organic chemistry exam June 8 | Memorize reaction mechanisms",
      icon: "📝",
    },
  ]

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6 relative overflow-hidden">
        {/* Animated Background Particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-blue-500/20 rounded-full animate-float"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${4 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Gradient Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 pointer-events-none" />

        <div className="space-y-6 relative z-10">
          <div className="text-center space-y-4 animate-fade-in">
            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse-glow">
                <Brain className="h-8 w-8 text-white animate-bounce-subtle" />
              </div>
              {isProcessing && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-spin-slow opacity-30" />
              )}
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                AI Brain Dump Processor
              </h1>
              <p className="text-muted-foreground text-lg animate-slide-up">
                Transform your chaotic thoughts into organized productivity
              </p>
              <Badge
                variant="secondary"
                className="mt-2 animate-fade-in-delay bg-gradient-to-r from-blue-100 to-purple-100 border-blue-200"
              >
                <Zap className="h-3 w-3 mr-1 animate-pulse" />
                Powered by OpenAI GPT-4o
              </Badge>
            </div>
          </div>

          <Card className="max-w-4xl mx-auto animate-slide-up-delay backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 animate-sparkle" />
                Dump Your Thoughts
              </CardTitle>
              <CardDescription>
                Paste your unstructured thoughts, tasks, deadlines, and ideas. Our AI will organize everything into a
                personalized dashboard with widgets, calendars, and to-do lists.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Textarea
                  placeholder="Enter your brain dump here...

Example: Math exam May 30 | Finish Econ essay draft | Biology class every Monday at 10am | Review chapter 4 | Set timer for study sessions"
                  value={dumpText}
                  onChange={(e) => setDumpText(e.target.value)}
                  className="min-h-[300px] resize-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 bg-white/50 backdrop-blur-sm"
                  disabled={isProcessing}
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-md animate-pulse" />
                )}
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleAnalyze}
                  disabled={!dumpText.trim() || isProcessing}
                  size="lg"
                  className="px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-5 w-5" />
                      Analyze & Organize
                    </>
                  )}
                </Button>

                {showResults && (
                  <Button
                    onClick={goToDashboard}
                    variant="outline"
                    size="lg"
                    className="animate-slide-in-right border-blue-200 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                  >
                    View Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>

              {isProcessing && (
                <div className="space-y-4 animate-fade-in">
                  <div className="text-center space-y-3">
                    <div className="text-sm font-medium animate-pulse">{processingStep}</div>
                    <Progress value={progress} className="w-full h-2 animate-progress" />
                    <div className="flex justify-center space-x-6 text-xs text-muted-foreground">
                      <span className="animate-bounce-delay-1">🧠 AI Analysis</span>
                      <span className="animate-bounce-delay-2">📊 Data Structuring</span>
                      <span className="animate-bounce-delay-3">💾 Database Storage</span>
                      <span className="animate-bounce-delay-4">🎯 Widget Creation</span>
                    </div>
                  </div>
                </div>
              )}

              {showResults && processedData && (
                <div className="space-y-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 animate-slide-up shadow-lg">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-green-800 animate-bounce-in">✅ Processing Complete!</h3>
                    <p className="text-sm text-green-600">Your thoughts have been organized and saved</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="space-y-1 animate-count-up">
                      <div className="text-2xl font-bold text-blue-600 animate-number">
                        {processedData.todos?.length || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Tasks Created</div>
                    </div>
                    <div className="space-y-1 animate-count-up-delay-1">
                      <div className="text-2xl font-bold text-purple-600 animate-number">
                        {processedData.projects?.length || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Projects</div>
                    </div>
                    <div className="space-y-1 animate-count-up-delay-2">
                      <div className="text-2xl font-bold text-orange-600 animate-number">
                        {processedData.events?.length || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Events</div>
                    </div>
                    <div className="space-y-1 animate-count-up-delay-3">
                      <div className="text-2xl font-bold text-green-600 animate-number">
                        {processedData.notes?.length || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Notes</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center animate-fade-in-delay">
              <h3 className="text-xl font-semibold mb-4">How AI Processes Your Thoughts</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2 group hover:scale-105 transition-transform duration-300">
                  <CheckSquare className="h-8 w-8 mx-auto text-blue-500 group-hover:animate-pulse" />
                  <h4 className="font-medium">Extract Tasks</h4>
                  <p className="text-sm text-muted-foreground">AI identifies deadlines, priorities, and subjects</p>
                </div>
                <div className="space-y-2 group hover:scale-105 transition-transform duration-300">
                  <Calendar className="h-8 w-8 mx-auto text-purple-500 group-hover:animate-pulse" />
                  <h4 className="font-medium">Create Events</h4>
                  <p className="text-sm text-muted-foreground">Schedule classes and recurring activities</p>
                </div>
                <div className="space-y-2 group hover:scale-105 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 mx-auto text-orange-500 group-hover:animate-pulse" />
                  <h4 className="font-medium">Organize Projects</h4>
                  <p className="text-sm text-muted-foreground">Break down complex tasks into manageable steps</p>
                </div>
                <div className="space-y-2 group hover:scale-105 transition-transform duration-300">
                  <FileText className="h-8 w-8 mx-auto text-green-500 group-hover:animate-pulse" />
                  <h4 className="font-medium">Smart Widgets</h4>
                  <p className="text-sm text-muted-foreground">Generate customizable dashboard components</p>
                </div>
              </div>
            </div>

            <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-xl animate-slide-up-delay">
              <CardHeader>
                <CardTitle>Try These Examples</CardTitle>
                <CardDescription>
                  Click any example to see how the AI processes different types of student input
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {exampleDumps.map((example, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-white/50 to-gray-50/50 rounded-lg cursor-pointer hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 border border-gray-200/50 hover:border-blue-200/50 transform hover:scale-[1.02] hover:shadow-lg group"
                    onClick={() => tryExample(example.text)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl group-hover:animate-bounce">{example.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-medium mb-2 group-hover:text-blue-600 transition-colors">
                          {example.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{example.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <style jsx global>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
              opacity: 0.1;
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
              opacity: 0.3;
            }
          }

          @keyframes pulse-glow {
            0%,
            100% {
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
            }
            50% {
              box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
            }
          }

          @keyframes bounce-subtle {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-2px);
            }
          }

          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes sparkle {
            0%,
            100% {
              transform: rotate(0deg) scale(1);
            }
            25% {
              transform: rotate(90deg) scale(1.1);
            }
            50% {
              transform: rotate(180deg) scale(1);
            }
            75% {
              transform: rotate(270deg) scale(1.1);
            }
          }

          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slide-in-right {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes bounce-in {
            0% {
              transform: scale(0.3);
              opacity: 0;
            }
            50% {
              transform: scale(1.05);
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes count-up {
            from {
              transform: scale(0.5);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes progress {
            0% {
              background-position: -200px 0;
            }
            100% {
              background-position: calc(200px + 100%) 0;
            }
          }

          .animate-float {
            animation: float 6s ease-in-out infinite;
          }

          .animate-pulse-glow {
            animation: pulse-glow 2s ease-in-out infinite;
          }

          .animate-bounce-subtle {
            animation: bounce-subtle 2s ease-in-out infinite;
          }

          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }

          .animate-sparkle {
            animation: sparkle 3s ease-in-out infinite;
          }

          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }

          .animate-fade-in-delay {
            animation: fade-in 0.8s ease-out 0.2s both;
          }

          .animate-slide-up {
            animation: slide-up 0.6s ease-out 0.1s both;
          }

          .animate-slide-up-delay {
            animation: slide-up 0.8s ease-out 0.3s both;
          }

          .animate-slide-in-right {
            animation: slide-in-right 0.5s ease-out;
          }

          .animate-bounce-in {
            animation: bounce-in 0.6s ease-out;
          }

          .animate-count-up {
            animation: count-up 0.6s ease-out;
          }

          .animate-count-up-delay-1 {
            animation: count-up 0.6s ease-out 0.1s both;
          }

          .animate-count-up-delay-2 {
            animation: count-up 0.6s ease-out 0.2s both;
          }

          .animate-count-up-delay-3 {
            animation: count-up 0.6s ease-out 0.3s both;
          }

          .animate-bounce-delay-1 {
            animation: bounce-subtle 2s ease-in-out infinite 0.2s;
          }

          .animate-bounce-delay-2 {
            animation: bounce-subtle 2s ease-in-out infinite 0.4s;
          }

          .animate-bounce-delay-3 {
            animation: bounce-subtle 2s ease-in-out infinite 0.6s;
          }

          .animate-bounce-delay-4 {
            animation: bounce-subtle 2s ease-in-out infinite 0.8s;
          }

          .animate-progress {
            background: linear-gradient(
              90deg,
              transparent,
              rgba(59, 130, 246, 0.4),
              transparent
            );
            background-size: 200px 100%;
            animation: progress 2s linear infinite;
          }

          .animate-number {
            display: inline-block;
            animation: count-up 0.8s ease-out;
          }

          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </ProtectedRoute>
  )
}
