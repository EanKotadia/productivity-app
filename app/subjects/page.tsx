"use client"

import { useState } from "react"
import { Plus, Users, CheckSquare, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ProtectedRoute } from "@/components/protected-route"

interface Subject {
  id: string
  name: string
  code: string
  instructor: string
  credits: number
  description: string
  color: string
  schedule: string[]
  progress: number
  totalTasks: number
  completedTasks: number
  nextDeadline?: string
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: "1",
      name: "Advanced Biology",
      code: "BIO-301",
      instructor: "Dr. Sarah Johnson",
      credits: 4,
      description: "Advanced study of cellular biology and genetics",
      color: "bg-green-500",
      schedule: ["Monday 10:00 AM", "Wednesday 10:00 AM", "Friday 2:00 PM"],
      progress: 75,
      totalTasks: 12,
      completedTasks: 9,
      nextDeadline: "Lab Report - May 30",
    },
    {
      id: "2",
      name: "Calculus II",
      code: "MATH-202",
      instructor: "Prof. Michael Chen",
      credits: 3,
      description: "Integration, series, and differential equations",
      color: "bg-blue-500",
      schedule: ["Tuesday 9:00 AM", "Thursday 9:00 AM"],
      progress: 60,
      totalTasks: 15,
      completedTasks: 9,
      nextDeadline: "Midterm Exam - June 2",
    },
    {
      id: "3",
      name: "Organic Chemistry",
      code: "CHEM-301",
      instructor: "Dr. Emily Rodriguez",
      credits: 4,
      description: "Structure and reactions of organic compounds",
      color: "bg-purple-500",
      schedule: ["Monday 2:00 PM", "Wednesday 2:00 PM", "Friday 10:00 AM"],
      progress: 45,
      totalTasks: 18,
      completedTasks: 8,
      nextDeadline: "Problem Set 5 - May 29",
    },
    {
      id: "4",
      name: "English Literature",
      code: "ENG-250",
      instructor: "Prof. David Wilson",
      credits: 3,
      description: "Survey of British literature from 1800-1900",
      color: "bg-red-500",
      schedule: ["Tuesday 11:00 AM", "Thursday 11:00 AM"],
      progress: 80,
      totalTasks: 8,
      completedTasks: 6,
      nextDeadline: "Essay Draft - June 1",
    },
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newSubject, setNewSubject] = useState({
    name: "",
    code: "",
    instructor: "",
    credits: "",
    description: "",
    color: "bg-blue-500",
  })

  const createSubject = () => {
    if (newSubject.name && newSubject.code) {
      const subject: Subject = {
        id: Date.now().toString(),
        name: newSubject.name,
        code: newSubject.code,
        instructor: newSubject.instructor,
        credits: Number.parseInt(newSubject.credits) || 3,
        description: newSubject.description,
        color: newSubject.color,
        schedule: [],
        progress: 0,
        totalTasks: 0,
        completedTasks: 0,
      }
      setSubjects([...subjects, subject])
      setNewSubject({ name: "", code: "", instructor: "", credits: "", description: "", color: "bg-blue-500" })
      setIsCreateDialogOpen(false)
    }
  }

  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0)
  const averageProgress = subjects.reduce((sum, subject) => sum + subject.progress, 0) / subjects.length

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Subjects</h1>
            <p className="text-gray-600">Manage your courses and academic progress</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Plus className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
                <DialogDescription>Create a new subject to track your academic progress</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Subject Name</Label>
                    <Input
                      id="name"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                      placeholder="e.g., Advanced Biology"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Course Code</Label>
                    <Input
                      id="code"
                      value={newSubject.code}
                      onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                      placeholder="e.g., BIO-301"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Instructor</Label>
                    <Input
                      id="instructor"
                      value={newSubject.instructor}
                      onChange={(e) => setNewSubject({ ...newSubject, instructor: e.target.value })}
                      placeholder="e.g., Dr. Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="credits">Credits</Label>
                    <Input
                      id="credits"
                      type="number"
                      value={newSubject.credits}
                      onChange={(e) => setNewSubject({ ...newSubject, credits: e.target.value })}
                      placeholder="3"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newSubject.description}
                    onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                    placeholder="Brief description of the course..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createSubject}>Add Subject</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCredits}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(averageProgress)}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.filter((s) => s.nextDeadline).length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {subjects.map((subject) => (
            <Card key={subject.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className={`w-3 h-3 rounded-full ${subject.color}`} />
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{subject.code}</span>
                    <span>{subject.credits} credits</span>
                  </div>
                </div>
                <Badge variant="outline">{subject.progress}% Complete</Badge>
              </CardHeader>
              <CardDescription>{subject.description}</CardDescription>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {subject.completedTasks}/{subject.totalTasks} tasks
                    </span>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>{subject.instructor}</span>
                  </div>
                  {subject.schedule.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <Calendar className="h-4 w-4 mt-0.5" />
                      <div className="space-y-1">
                        {subject.schedule.map((time, index) => (
                          <div key={index}>{time}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  {subject.nextDeadline && (
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <CheckSquare className="h-4 w-4" />
                      <span>Next: {subject.nextDeadline}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Add Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
    </ProtectedRoute>
  )
}
