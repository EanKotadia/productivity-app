"use client"

import { useState, useEffect } from "react"
import { TimerIcon, Play, Pause, RotateCcw, Coffee, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"

export default function TimerPage() {
  const [time, setTime] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<"work" | "break">("work")
  const [sessions, setSessions] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1)
      }, 1000)
    } else if (time === 0) {
      setIsRunning(false)
      if (mode === "work") {
        setSessions((s) => s + 1)
        setMode("break")
        setTime(5 * 60) // 5 minute break
      } else {
        setMode("work")
        setTime(25 * 60) // 25 minute work session
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, time, mode])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getProgress = () => {
    const totalTime = mode === "work" ? 25 * 60 : 5 * 60
    return ((totalTime - time) / totalTime) * 100
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTime(mode === "work" ? 25 * 60 : 5 * 60)
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
            <TimerIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Pomodoro Timer</h1>
            <p className="text-gray-600">Stay focused with the Pomodoro Technique</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-gray-900">
                {mode === "work" ? (
                  <>
                    <Target className="h-5 w-5 text-blue-500" />
                    Focus Time
                  </>
                ) : (
                  <>
                    <Coffee className="h-5 w-5 text-green-500" />
                    Break Time
                  </>
                )}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {mode === "work" ? "Time to focus on your tasks" : "Take a well-deserved break"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="text-6xl font-mono font-bold text-gray-900">{formatTime(time)}</div>
                <Progress value={getProgress()} className="w-full h-2" />
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={toggleTimer}
                  size="lg"
                  className="px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  {isRunning ? (
                    <>
                      <Pause className="mr-2 h-5 w-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Start
                    </>
                  )}
                </Button>
                <Button onClick={resetTimer} variant="outline" size="lg" className="bg-white/50 border-gray-200/50">
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reset
                </Button>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => {
                    setMode("work")
                    setTime(25 * 60)
                    setIsRunning(false)
                  }}
                  variant={mode === "work" ? "default" : "outline"}
                  size="sm"
                  className={
                    mode === "work" ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-white/50 border-gray-200/50"
                  }
                >
                  Work (25min)
                </Button>
                <Button
                  onClick={() => {
                    setMode("break")
                    setTime(5 * 60)
                    setIsRunning(false)
                  }}
                  variant={mode === "break" ? "default" : "outline"}
                  size="sm"
                  className={
                    mode === "break" ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-white/50 border-gray-200/50"
                  }
                >
                  Break (5min)
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">Sessions Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{sessions}</div>
                <p className="text-xs text-gray-600">Completed pomodoros</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">Focus Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{sessions * 25}min</div>
                <p className="text-xs text-gray-600">Total focused time</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">Current Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={mode === "work" ? "default" : "secondary"} className="text-sm">
                  {mode === "work" ? "Focus" : "Break"}
                </Badge>
                <p className="text-xs text-gray-600 mt-1">{mode === "work" ? "Stay focused!" : "Relax and recharge"}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">How it works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">1. Focus (25 minutes)</h4>
                  <p className="text-sm text-gray-600">
                    Work on a single task with complete focus. Avoid all distractions.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">2. Break (5 minutes)</h4>
                  <p className="text-sm text-gray-600">Take a short break. Stand up, stretch, or grab some water.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">3. Repeat</h4>
                  <p className="text-sm text-gray-600">After 4 pomodoros, take a longer 15-30 minute break.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">4. Track Progress</h4>
                  <p className="text-sm text-gray-600">Monitor your completed sessions and total focus time.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
