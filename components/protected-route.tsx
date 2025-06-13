"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Temporarily disabled authentication check
  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push("/login")
  //   }
  // }, [user, loading, router])

  // if (loading) {
  //   return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  // }

  // if (!user) {
  //   return null
  // }

  return <>{children}</>
}
