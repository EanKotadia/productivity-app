"use client"

import { useState } from "react"
import { FolderOpen, Upload, File, Download, Trash2, Search, Filter, FileText, ImageIcon, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/protected-route"

interface FileItem {
  id: string
  name: string
  type: "pdf" | "doc" | "image" | "video" | "other"
  size: string
  subject: string
  uploadDate: string
  url?: string
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "Biology Lab Report.pdf",
      type: "pdf",
      size: "2.4 MB",
      subject: "Biology",
      uploadDate: "2025-05-25",
    },
    {
      id: "2",
      name: "Math Homework Solutions.doc",
      type: "doc",
      size: "1.2 MB",
      subject: "Mathematics",
      uploadDate: "2025-05-24",
    },
    {
      id: "3",
      name: "Chemistry Diagram.png",
      type: "image",
      size: "856 KB",
      subject: "Chemistry",
      uploadDate: "2025-05-23",
    },
    {
      id: "4",
      name: "Physics Lecture Recording.mp4",
      type: "video",
      size: "125 MB",
      subject: "Physics",
      uploadDate: "2025-05-22",
    },
    {
      id: "5",
      name: "English Essay Draft.doc",
      type: "doc",
      size: "945 KB",
      subject: "English",
      uploadDate: "2025-05-21",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  const subjects = ["Biology", "Mathematics", "Chemistry", "Physics", "English"]
  const fileTypes = ["pdf", "doc", "image", "video", "other"]

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = selectedSubject === "all" || file.subject === selectedSubject
    const matchesType = selectedType === "all" || file.type === selectedType
    return matchesSearch && matchesSubject && matchesType
  })

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
      case "doc":
        return <FileText className="h-8 w-8" />
      case "image":
        return <ImageIcon className="h-8 w-8" />
      case "video":
        return <Video className="h-8 w-8" />
      default:
        return <File className="h-8 w-8" />
    }
  }

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "pdf":
        return "bg-red-100 text-red-800"
      case "doc":
        return "bg-blue-100 text-blue-800"
      case "image":
        return "bg-green-100 text-green-800"
      case "video":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const deleteFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id))
  }

  const totalSize = files.reduce((total, file) => {
    const size = Number.parseFloat(file.size)
    const unit = file.size.includes("MB") ? 1024 : 1
    return total + size * unit
  }, 0)

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Files</h1>
            <p className="text-gray-600">Manage your study materials and documents</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[120px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {fileTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{files.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalSize > 1024 ? `${(totalSize / 1024).toFixed(1)} GB` : `${totalSize.toFixed(0)} MB`}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {files.filter((f) => f.type === "pdf" || f.type === "doc").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Media Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {files.filter((f) => f.type === "image" || f.type === "video").length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>File Library</CardTitle>
              <CardDescription>
                {filteredFiles.length} of {files.length} files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-muted-foreground">{getFileIcon(file.type)}</div>
                      <div className="space-y-1">
                        <p className="font-medium">{file.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{file.size}</span>
                          <span>{file.uploadDate}</span>
                          <Badge variant="outline" className={getFileTypeColor(file.type)}>
                            {file.type.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{file.subject}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteFile(file.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredFiles.length === 0 && (
                <div className="text-center py-12">
                  <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No files found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || selectedSubject !== "all" || selectedType !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Upload your first file to get started"}
                  </p>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
