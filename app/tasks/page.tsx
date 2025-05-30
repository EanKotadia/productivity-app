"use client"

import { useState, useEffect } from "react"
import { Plus, Filter, Calendar, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { supabase } from "@/lib/supabase"

interface Task {
  id: string
  text: string
  due?: string
  priority: "high" | "medium" | "low"
  completed: boolean
  subject?: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState("all")
  const [newTask, setNewTask] = useState("")

  const { user } = useAuth()

  // Load tasks from database
  useEffect(() => {
    if (user) {
      loadTasks()
    }
  }, [user])

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      const formattedTasks = data.map((task) => ({
        id: task.id,
        text: task.text,
        due: task.due_date,
        priority: task.priority as "high" | "medium" | "low",
        completed: task.completed,
        subject: task.subject,
      }))

      setTasks(formattedTasks)
    } catch (error) {
      console.error("Error loading tasks:", error)
    }
  }

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    try {
      const { error } = await supabase.from("tasks").update({ completed: !task.completed }).eq("id", id)

      if (error) throw error

      setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const addTask = async () => {
    if (newTask.trim() && user) {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .insert({
            user_id: user.id,
            text: newTask,
            priority: "medium",
            completed: false,
          })
          .select()
          .single()

        if (error) throw error

        const task: Task = {
          id: data.id,
          text: data.text,
          priority: data.priority as "high" | "medium" | "low",
          completed: data.completed,
          subject: data.subject,
        }

        setTasks([task, ...tasks])
        setNewTask("")
      } catch (error) {
        console.error("Error adding task:", error)
      }
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed
    if (filter === "pending") return !task.completed
    if (filter === "high") return task.priority === "high"
    return true
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500 text-red-500 bg-red-50"
      case "medium":
        return "border-yellow-500 text-yellow-500 bg-yellow-50"
      case "low":
        return "border-green-500 text-green-500 bg-green-50"
      default:
        return "border-gray-500 text-gray-500 bg-gray-50"
    }
  }

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tasks</h1>
            <p className="text-gray-600">Manage your assignments and deadlines</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[150px] bg-white/80 backdrop-blur-sm border-gray-200/50">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Plus className="h-5 w-5 text-blue-500" />
              Add New Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTask()}
                className="flex-1 bg-white/50 border-gray-200/50"
              />
              <Button
                onClick={addTask}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{tasks.filter((t) => t.completed).length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {tasks.filter((t) => t.priority === "high" && !t.completed).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Task List</CardTitle>
            <CardDescription className="text-gray-600">
              {filteredTasks.length} {filter === "all" ? "total" : filter} tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200/50 hover:bg-gray-50/50 transition-colors bg-white/50"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <div className="flex-1 space-y-1">
                  <p className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                    {task.text}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {task.due && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Due: {task.due}</span>
                      </div>
                    )}
                    {task.subject && (
                      <Badge variant="outline" className="text-xs bg-white/50">
                        {task.subject}
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className={`${getPriorityColor(task.priority)}`}>
                  <Flag className="mr-1 h-3 w-3" />
                  {task.priority}
                </Badge>
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <div className="text-center py-8 text-gray-600">No tasks found for the selected filter.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
