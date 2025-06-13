"use client"

import { useState, useCallback } from "react"
import { Brain, Calendar, CheckSquare, BarChart3, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"
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
              checked={todo.completed}
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
        {data.todos.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <p>No tasks yet</p>
            <Link href="/tasks">
              <Button variant="link" className="text-blue-500 p-0 h-auto mt-1">
                Add your first task
              </Button>
            </Link>
          </div>
        )}
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
              checked={step.completed}
              onChange={() => toggleStep(currentProject.id, step.id)}
              className="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
            />
            <span className={`text-sm ${step.completed ? "line-through text-gray-500" : "text-gray-700"}`}>
              {step.text}
            </span>
          </div>
        ))}
        {!currentProject && (
          <div className="text-center py-4 text-gray-500">
            <p>No projects yet</p>
            <Link href="/subjects">
              <Button variant="link" className="text-purple-500 p-0 h-auto mt-1">
                Create your first project
              </Button>
            </Link>
          </div>
        )}
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
        {data.events.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <p>No events scheduled</p>
            <Link href="/calendar">
              <Button variant="link" className="text-orange-500 p-0 h-auto mt-1">
                Add your first event
              </Button>
            </Link>
          </div>
        )}
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

const AIInsightsWidget = ({ data }: WidgetProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 h-full shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-gray-800 text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="p-2 rounded-lg bg-amber-50/50 border border-amber-100">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Study tip:</span> Based on your schedule, your most productive study time
            appears to be between 2-4 PM.
          </p>
        </div>
        <div className="p-2 rounded-lg bg-blue-50/50 border border-blue-100">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Task suggestion:</span> Consider breaking down your Biology project into
            smaller tasks.
          </p>
        </div>
        <div className="p-2 rounded-lg bg-purple-50/50 border border-purple-100">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Reminder:</span> Your Math exam is coming up in 5 days. Time to start
            reviewing!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const [processedData, setProcessedData] = useState<ProcessedData>({
    todos: [
      {
        id: "1",
        text: "Complete Biology assignment",
        due: "Tomorrow",
        priority: "high",
        completed: false,
      },
      {
        id: "2",
        text: "Review Math formulas",
        due: "Today",
        priority: "medium",
        completed: true,
      },
      {
        id: "3",
        text: "Prepare for Chemistry quiz",
        due: "Friday",
        priority: "high",
        completed: false,
      },
      {
        id: "4",
        text: "Read English literature chapter",
        priority: "low",
        completed: false,
      },
      {
        id: "5",
        text: "Submit Physics lab report",
        due: "Next Monday",
        priority: "medium",
        completed: false,
      },
    ],
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

  const [layouts, setLayouts] = useState<{ [key: string]: LayoutItem[] }>({
    lg: [
      { i: "todos", x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
      { i: "projects", x: 6, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
      { i: "calendar", x: 0, y: 4, w: 6, h: 4, minW: 4, minH: 3 },
      { i: "stats", x: 6, y: 4, w: 6, h: 4, minW: 3, minH: 3 },
      { i: "ai", x: 0, y: 8, w: 12, h: 3, minW: 6, minH: 3 },
    ],
    md: [
      { i: "todos", x: 0, y: 0, w: 5, h: 4, minW: 4, minH: 3 },
      { i: "projects", x: 5, y: 0, w: 5, h: 4, minW: 4, minH: 3 },
      { i: "calendar", x: 0, y: 4, w: 5, h: 4, minW: 4, minH: 3 },
      { i: "stats", x: 5, y: 4, w: 5, h: 4, minW: 3, minH: 3 },
      { i: "ai", x: 0, y: 8, w: 10, h: 3, minW: 6, minH: 3 },
    ],
    sm: [
      { i: "todos", x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
      { i: "projects", x: 0, y: 4, w: 6, h: 4, minW: 4, minH: 3 },
      { i: "calendar", x: 0, y: 8, w: 6, h: 4, minW: 4, minH: 3 },
      { i: "stats", x: 0, y: 12, w: 6, h: 4, minW: 3, minH: 3 },
      { i: "ai", x: 0, y: 16, w: 6, h: 3, minW: 6, minH: 3 },
    ],
  })

  const [activeWidgets] = useState(["todos", "projects", "calendar", "stats", "ai"])

  const onLayoutChange = useCallback((layout: LayoutItem[], layouts: { [key: string]: LayoutItem[] }) => {
    setLayouts(layouts)
  }, [])

  const renderWidget = (widgetId: string) => {
    const widgets = {
      todos: TodoWidget,
      projects: ProjectWidget,
      calendar: CalendarWidget,
      stats: StatsWidget,
      ai: AIInsightsWidget,
    }

    const WidgetComponent = widgets[widgetId as keyof typeof widgets]
    if (!WidgetComponent) return null

    return (
      <div key={widgetId}>
        <WidgetComponent data={processedData} onDataUpdate={setProcessedData} />
      </div>
    )
  }

  // Get current date in a nice format
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to StudyFlow!</h1>
            <p className="text-gray-600">{currentDate} • Here's your productivity overview</p>
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
                {Math.round((processedData.todos.filter((t) => t.completed).length / processedData.todos.length) * 100)}
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
  )
}
