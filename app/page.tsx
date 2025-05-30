"use client"

import { useState, useCallback, useEffect } from "react"
import { Brain, Calendar, CheckSquare, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

// Dynamically import react-grid-layout to avoid SSR issues
const GridLayout = dynamic(() => import("react-grid-layout").then((mod) => mod.Responsive), {
  ssr: false,
  loading: () => <div className="text-gray-600">Loading dashboard...</div>,
})

interface ProcessedData {
  todos: Array<{ id: string; text: string; due?: string; priority: "high" | "medium" | "low"; completed: boolean }>
  projects: Array<{ id: string; name: string; steps: Array<{ id: string; text: string; completed: boolean }> }>
  events: Array<{ id: string; name: string; time: string; recurring?: boolean }>
  notes: Array<{ id: string; content: string; subject?: string }>
  widgets: string[]
  subjects: string[]
}

interface LayoutItem {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
}

interface WidgetProps {
  data: ProcessedData
  onDataUpdate: (data: ProcessedData) => void
}

// Widget Components
const TodoWidget = ({ data, onDataUpdate }: WidgetProps) => {
  const toggleTodo = (id: string) => {
    const updatedTodos = data.todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    onDataUpdate({ ...data, todos: updatedTodos })
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 h-full shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-gray-800 text-sm flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-blue-500" />
          To-Do List
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 overflow-y-auto max-h-[calc(100%-80px)]">
        {data.todos.slice(0, 5).map((todo) => (
          <div
            key={todo.id}
            className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
          >
            <input
              type="checkbox"
              defaultChecked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${todo.completed ? "line-through text-gray-500" : "text-gray-700"}`}>
                {todo.text}
              </p>
              {todo.due && <p className="text-xs text-gray-500">Due: {todo.due}</p>}
            </div>
            <Badge
              variant="outline"
              className={`text-xs ${
                todo.priority === "high"
                  ? "border-red-400 text-red-600 bg-red-50"
                  : todo.priority === "medium"
                    ? "border-yellow-400 text-yellow-600 bg-yellow-50"
                    : "border-green-400 text-green-600 bg-green-50"
              }`}
            >
              {todo.priority}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const ProjectWidget = ({ data, onDataUpdate }: WidgetProps) => {
  const toggleStep = (projectId: string, stepId: string) => {
    const updatedProjects = data.projects.map((project) =>
      project.id === projectId
        ? {
            ...project,
            steps: project.steps.map((step) => (step.id === stepId ? { ...step, completed: !step.completed } : step)),
          }
        : project,
    )
    onDataUpdate({ ...data, projects: updatedProjects })
  }

  const currentProject = data.projects[0]

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 h-full shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-gray-800 text-sm flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-purple-500" />
          {currentProject?.name || "Projects"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 overflow-y-auto max-h-[calc(100%-80px)]">
        {currentProject?.steps.slice(0, 4).map((step) => (
          <div
            key={step.id}
            className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
          >
            <input
              type="checkbox"
              defaultChecked={step.completed}
              onChange={() => toggleStep(currentProject.id, step.id)}
              className="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
            />
            <span className={`text-sm ${step.completed ? "line-through text-gray-500" : "text-gray-700"}`}>
              {step.text}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const CalendarWidget = ({ data }: WidgetProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 h-full shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-gray-800 text-sm flex items-center gap-2">
          <Calendar className="h-4 w-4 text-orange-500" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 overflow-y-auto max-h-[calc(100%-80px)]">
        {data.events.slice(0, 4).map((event) => (
          <div key={event.id} className="p-2 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
            <p className="text-gray-800 text-sm font-medium">{event.name}</p>
            <p className="text-xs text-gray-600">{event.time}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const StatsWidget = ({ data }: WidgetProps) => {
  const completedTodos = data.todos.filter((todo) => todo.completed).length
  const totalTodos = data.todos.length
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 h-full shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-gray-800 text-sm flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-green-500" />
          Progress Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{completionRate}%</div>
          <p className="text-xs text-gray-600">Tasks Completed</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-800">{data.projects.length}</div>
            <p className="text-xs text-gray-600">Projects</p>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-800">{data.subjects.length}</div>
            <p className="text-xs text-gray-600">Subjects</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { user } = useAuth()

  const [processedData, setProcessedData] = useState<ProcessedData>({
    todos: [],
    projects: [
      {
        id: "1",
        name: "Science Fair Project",
        steps: [
          { id: "1", text: "Research topic", completed: true },
          { id: "2", text: "Build model", completed: false },
          { id: "3", text: "Prepare presentation", completed: false },
        ],
      },
    ],
    events: [
      { id: "1", name: "Biology class", time: "Monday 10:00 AM", recurring: true },
      { id: "2", name: "Math exam", time: "May 30, 2025", recurring: false },
      { id: "3", name: "Study group", time: "Wednesday 3:00 PM", recurring: true },
    ],
    notes: [],
    widgets: ["timer", "calendar", "todo", "notes"],
    subjects: ["Mathematics", "Biology", "Chemistry", "English", "Physics"],
  })

  // Load user data from Supabase
  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    try {
      // Load tasks
      const { data: tasks } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      // Load notes
      const { data: notes } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (tasks) {
        const formattedTodos = tasks.map((task) => ({
          id: task.id,
          text: task.text,
          due: task.due_date,
          priority: task.priority as "high" | "medium" | "low",
          completed: task.completed,
        }))

        setProcessedData((prev) => ({ ...prev, todos: formattedTodos }))
      }

      if (notes) {
        const formattedNotes = notes.map((note) => ({
          id: note.id,
          content: note.content,
          subject: note.subject,
        }))

        setProcessedData((prev) => ({ ...prev, notes: formattedNotes }))
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const [layouts, setLayouts] = useState<{ [key: string]: LayoutItem[] }>({
    lg: [
      { i: "todos", x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
      { i: "projects", x: 6, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
      { i: "calendar", x: 0, y: 4, w: 6, h: 4, minW: 4, minH: 3 },
      { i: "stats", x: 6, y: 4, w: 6, h: 4, minW: 3, minH: 3 },
    ],
  })

  const [activeWidgets] = useState(["todos", "projects", "calendar", "stats"])

  const onLayoutChange = useCallback((layout: LayoutItem[], layouts: { [key: string]: LayoutItem[] }) => {
    setLayouts(layouts)
  }, [])

  const renderWidget = (widgetId: string) => {
    const widgets = {
      todos: TodoWidget,
      projects: ProjectWidget,
      calendar: CalendarWidget,
      stats: StatsWidget,
    }

    const WidgetComponent = widgets[widgetId as keyof typeof widgets]
    if (!WidgetComponent) return null

    return (
      <div key={widgetId}>
        <WidgetComponent data={processedData} onDataUpdate={setProcessedData} />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
              <p className="text-gray-600">Here's your productivity overview for today.</p>
            </div>
            <Link href="/brain-dump">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Brain className="mr-2 h-4 w-4" />
                New Brain Dump
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Pending Tasks</CardTitle>
                <CheckSquare className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {processedData.todos.filter((t) => !t.completed).length}
                </div>
                <p className="text-xs text-gray-600">
                  {processedData.todos.filter((t) => t.priority === "high" && !t.completed).length} high priority
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Active Projects</CardTitle>
                <BarChart3 className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{processedData.projects.length}</div>
                <p className="text-xs text-gray-600">Across {processedData.subjects.length} subjects</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Today's Events</CardTitle>
                <Calendar className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">3</div>
                <p className="text-xs text-gray-600">2 classes, 1 study session</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Completion Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(
                    (processedData.todos.filter((t) => t.completed).length / processedData.todos.length) * 100,
                  )}
                  %
                </div>
                <p className="text-xs text-gray-600">This week</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Your Widgets</h2>
              <Badge variant="outline" className="bg-white/50 border-gray-300">
                {activeWidgets.length} Active Widgets
              </Badge>
            </div>

            <GridLayout
              className="layout"
              layouts={layouts}
              onLayoutChange={onLayoutChange}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={60}
              isDraggable={true}
              isResizable={true}
              margin={[16, 16]}
              containerPadding={[0, 0]}
            >
              {activeWidgets.map(renderWidget)}
            </GridLayout>
          </div>
        </div>

        <style jsx global>{`
          .react-grid-layout {
            position: relative;
          }
          .react-grid-item {
            transition: all 200ms ease;
            transition-property: left, top;
          }
          .react-grid-item.cssTransforms {
            transition-property: transform;
          }
          .react-grid-item > .react-resizable-handle {
            position: absolute;
            width: 20px;
            height: 20px;
            bottom: 0;
            right: 0;
            cursor: se-resize;
          }
          .react-grid-item > .react-resizable-handle::after {
            content: "";
            position: absolute;
            right: 3px;
            bottom: 3px;
            width: 5px;
            height: 5px;
            border-right: 2px solid rgba(0, 0, 0, 0.4);
            border-bottom: 2px solid rgba(0, 0, 0, 0.4);
          }
          .react-grid-item.react-grid-placeholder {
            background: rgba(0, 0, 0, 0.1);
            opacity: 0.2;
            transition-duration: 100ms;
            z-index: 2;
          }
        `}</style>
      </div>
    </ProtectedRoute>
  )
}
