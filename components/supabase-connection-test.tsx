"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function SupabaseConnectionTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"untested" | "success" | "error">("untested")
  const [errorMessage, setErrorMessage] = useState("")
  const [envVars, setEnvVars] = useState<{ [key: string]: boolean }>({})

  // Check environment variables
  useEffect(() => {
    const vars = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }
    setEnvVars(vars)
  }, [])

  const testConnection = async () => {
    setIsLoading(true)
    setConnectionStatus("untested")
    setErrorMessage("")

    try {
      console.log("Testing Supabase connection...")

      // Simple query to test connection
      const { data, error } = await supabase.from("profiles").select("count").limit(1)

      if (error) {
        console.error("Supabase connection error:", error)
        setConnectionStatus("error")
        setErrorMessage(error.message)
        return
      }

      console.log("Supabase connection successful:", data)
      setConnectionStatus("success")
    } catch (err: any) {
      console.error("Unexpected error testing connection:", err)
      setConnectionStatus("error")
      setErrorMessage(err.message || "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
        <CardDescription>Check if your Supabase connection is working properly</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Environment Variables</h3>
          <div className="space-y-1">
            {Object.entries(envVars).map(([key, isSet]) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span>{key}</span>
                {isSet ? (
                  <span className="text-green-600 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" /> Set
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" /> Missing
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Button onClick={testConnection} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            "Test Connection"
          )}
        </Button>

        {connectionStatus === "success" && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">Successfully connected to Supabase!</AlertDescription>
          </Alert>
        )}

        {connectionStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Failed</AlertTitle>
            <AlertDescription className="break-all">
              {errorMessage || "Could not connect to Supabase. Check your environment variables."}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
