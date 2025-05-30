"use client"

import { TrendingUp, Clock, Target, CheckSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"

export default function AnalyticsPage() {
  const weeklyData = [
    { day: "Mon", tasks: 8, completed: 6, studyTime: 4.5 },
    { day: "Tue", tasks: 6, completed: 5, studyTime: 3.2 },
    { day: "Wed", tasks: 10, completed: 8, studyTime: 5.1 },
    { day: "Thu", tasks: 7, completed: 7, studyTime: 4.8 },
    { day: "Fri", tasks: 9, completed: 6, studyTime: 3.9 },
    { day: "Sat", tasks: 5, completed: 4, studyTime: 2.5 },
    { day: "Sun", tasks: 4, completed: 3, studyTime: 2.1 },
  ]

  const subjectProgress = [
    { subject: "Biology", progress: 85, tasks: 12, completed: 10 },
    { subject: "Mathematics", progress: 72, tasks: 15, completed: 11 },
    { subject: "Chemistry", progress: 68, tasks: 18, completed: 12 },
    { subject: "English", progress: 90, tasks: 8, completed: 7 },
    { subject: "Physics", progress: 55, tasks: 14, completed: 8 },
  ]

  const totalTasks = weeklyData.reduce((sum, day) => sum + day.tasks, 0)
  const totalCompleted = weeklyData.reduce((sum, day) => sum + day.completed, 0)
  const totalStudyTime = weeklyData.reduce((sum, day) => sum + day.studyTime, 0)
  const completionRate = Math.round((totalCompleted / totalTasks) * 100)

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your productivity and academic progress</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalCompleted}/{totalTasks}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5%</span> from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudyTime.toFixed(1)}h</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2.3h</span> from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8</span> from last week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Overview</CardTitle>
              <CardDescription>Task completion and study time for this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day) => (
                  <div key={day.day} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{day.day}</span>
                      <div className="flex items-center gap-4">
                        <span>
                          {day.completed}/{day.tasks} tasks
                        </span>
                        <span>{day.studyTime}h study</span>
                      </div>
                    </div>
                    <Progress value={(day.completed / day.tasks) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subject Progress</CardTitle>
              <CardDescription>Progress across all your subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectProgress.map((subject) => (
                  <div key={subject.subject} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{subject.subject}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {subject.completed}/{subject.tasks}
                        </span>
                        <Badge variant="outline">{subject.progress}%</Badge>
                      </div>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Study Patterns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Most Productive Day</span>
                  <span className="font-medium">Wednesday</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average Session</span>
                  <span className="font-medium">45 minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Peak Hours</span>
                  <span className="font-medium">2-4 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Streak</span>
                  <span className="font-medium">7 days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Goals & Targets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Weekly Tasks Goal</span>
                    <span>40/50</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Study Time Goal</span>
                    <span>26/30h</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Completion Rate</span>
                    <span>87/85%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">🏆</div>
                <div>
                  <p className="text-sm font-medium">Week Warrior</p>
                  <p className="text-xs text-muted-foreground">Completed all tasks this week</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">📚</div>
                <div>
                  <p className="text-sm font-medium">Study Streak</p>
                  <p className="text-xs text-muted-foreground">7 days in a row</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">⚡</div>
                <div>
                  <p className="text-sm font-medium">Productivity Pro</p>
                  <p className="text-xs text-muted-foreground">85%+ completion rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
