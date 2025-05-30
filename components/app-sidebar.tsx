"use client"

import { useState } from "react"
import {
  Home,
  Calendar,
  CheckSquare,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Brain,
  Book,
  Files,
  Timer,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { usePathname } from "next/navigation"
import Link from "next/link"

export const AppSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Brain Dump", href: "/brain-dump", icon: Brain },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Timer", href: "/timer", icon: Timer },
    { name: "Notes", href: "/notes", icon: FileText },
    { name: "Subjects", href: "/subjects", icon: Book },
    { name: "Files", href: "/files", icon: Files },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        bg-white/95 backdrop-blur-sm border-r border-gray-200/50 shadow-xl
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                StudyFlow
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10 ring-2 ring-blue-500/20">
                <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                  {user?.user_metadata?.full_name?.slice(0, 2).toUpperCase() || user?.email?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.user_metadata?.full_name || "Student"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      active
                        ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 border border-blue-200/50 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100/70 hover:text-gray-900"
                    }
                    group
                  `}
                >
                  <Icon
                    className={`h-5 w-5 transition-colors ${active ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"}`}
                  />
                  <span>{item.name}</span>
                  {active && <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200/50 space-y-1">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  isActive("/settings")
                    ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 border border-blue-200/50"
                    : "text-gray-700 hover:bg-gray-100/70 hover:text-gray-900"
                }
                group
              `}
            >
              <Settings
                className={`h-5 w-5 transition-colors ${isActive("/settings") ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"}`}
              />
              <span>Settings</span>
            </Link>

            <button
              onClick={signOut}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full group"
            >
              <LogOut className="h-5 w-5 text-gray-500 group-hover:text-red-500 transition-colors" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
