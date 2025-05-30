"use client"

import { useState } from "react"
import { CalendarIcon, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"

interface Event {
  id: string
  title: string
  time: string
  date: string
  type: "class" | "exam" | "assignment" | "meeting"
  location?: string
  recurring?: boolean
  subject?: string
}

export default function CalendarPage() {
  const [events] = useState<Event[]>([
    {
      id: "1",
      title: "Biology Class",
      time: "10:00 AM - 11:30 AM",
      date: "Monday",
      type: "class",
      location: "Room 204",
      recurring: true,
      subject: "Biology",
    },
    {
      id: "2",
      title: "Math Exam",
      time: "2:00 PM - 4:00 PM",
      date: "May 30, 2025",
      type: "exam",
      location: "Main Hall",
      subject: "Mathematics",
    },
    {
      id: "3",
      title: "Study Group",
      time: "3:00 PM - 5:00 PM",
      date: "Wednesday",
      type: "meeting",
      location: "Library",
      recurring: true,
    },
    {
      id: "4",
      title: "Chemistry Lab",
      time: "2:00 PM - 4:00 PM",
      date: "Friday",
      type: "class",
      location: "Lab 301",
      recurring: true,
      subject: "Chemistry",
    },
    {
      id: "5",
      title: "English Essay Due",
      time: "11:59 PM",
      date: "Next Friday",
      type: "assignment",
      subject: "English",
    },
  ])

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "class":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "exam":
        return "bg-red-100 text-red-800 border-red-200"
      case "assignment":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "meeting":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const todayEvents = events.filter((event) => event.date === "Monday" || event.date === "Today")
  const upcomingEvents = events.filter((event) => !todayEvents.includes(event))

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Calendar</h1>
            <p className="text-gray-600">Your schedule and upcoming events</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <CalendarIcon className="h-5 w-5 text-blue-500" />
                Today's Schedule
              </CardTitle>
              <CardDescription className="text-gray-600">Monday, May 27, 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayEvents.length > 0 ? (
                todayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start space-x-4 p-3 rounded-lg border border-gray-200/50 bg-white/50"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{event.time}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                      {event.subject && (
                        <Badge variant="outline" className="text-xs bg-white/50">
                          {event.subject}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-600">No events scheduled for today</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-gray-900">Upcoming Events</CardTitle>
              <CardDescription className="text-gray-600">Next 7 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start space-x-4 p-3 rounded-lg border border-gray-200/50 bg-white/50"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {event.location && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.recurring && (
                        <Badge variant="outline" className="text-xs bg-white/50">
                          Recurring
                        </Badge>
                      )}
                      {event.subject && (
                        <Badge variant="outline" className="text-xs bg-white/50">
                          {event.subject}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{events.length}</div>
              <p className="text-xs text-gray-600">This week</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{events.filter((e) => e.type === "class").length}</div>
              <p className="text-xs text-gray-600">Regular classes</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{events.filter((e) => e.type === "exam").length}</div>
              <p className="text-xs text-gray-600">Upcoming exams</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {events.filter((e) => e.type === "assignment").length}
              </div>
              <p className="text-xs text-gray-600">Due soon</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
