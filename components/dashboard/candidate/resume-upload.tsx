// components/dashboard/candidate/resume-upload.tsx
"use client"

import { useState, useCallback, memo } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, CheckCircle, XCircle, Loader2, Trash2, Eye, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import Image from "next/image"
interface ResumeData {
  skills: string[]
  experience: number
  education: string[]
  matchScore?: number
}

export const ResumeUpload = memo(function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [resumeUrl, setResumeUrl] = useState<string>("")
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0]
    if (uploadedFile.type === "application/pdf") {
      setFile(uploadedFile)
      uploadResume(uploadedFile)
    } else {
      toast.error("Please upload a PDF file")
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  })

  const uploadResume = async (file: File) => {
    setUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          setUploadProgress(progress)
        }
      })

      const response = await fetch("/api/candidate/resume/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setResumeUrl(data.url)
        toast.success("Resume uploaded successfully!")
        analyzeResume(data.url)
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      toast.error("Failed to upload resume")
      setFile(null)
    } finally {
      setUploading(false)
    }
  }

  const analyzeResume = async (url: string) => {
    setAnalyzing(true)
    try {
      const response = await fetch("/api/candidate/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeUrl: url }),
      })

      if (response.ok) {
        const data = await response.json()
        setResumeData(data)
        toast.success("Resume analyzed! Skills extracted successfully.")
      }
    } catch (error) {
      toast.error("Failed to analyze resume")
    } finally {
      setAnalyzing(false)
    }
  }

  const deleteResume = async () => {
    try {
      await fetch("/api/candidate/resume", { method: "DELETE" })
      setFile(null)
      setResumeUrl("")
      setResumeData(null)
      toast.success("Resume deleted")
    } catch (error) {
      toast.error("Failed to delete resume")
    }
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
        <CardTitle className="text-2xl flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Resume & AI Analysis
        </CardTitle>
        <CardDescription>
          Upload your resume for AI-powered skill extraction and job matching
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {!resumeUrl ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            ref={getRootProps().ref}
            onClick={getRootProps().onClick}
            onDragEnter={getRootProps().onDragEnter}
            onDragLeave={getRootProps().onDragLeave}
            onDragOver={getRootProps().onDragOver}
            onDrop={getRootProps().onDrop}
            onKeyDown={getRootProps().onKeyDown}
            tabIndex={getRootProps().tabIndex}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
              transition-all duration-200
              ${isDragActive 
                ? "border-primary bg-primary/5 scale-105" 
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50"
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              PDF format only (Max 5MB)
            </p>
            <Button variant="outline">Browse Files</Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-10 w-10 text-primary" />
                <div>
                  <p className="font-medium">{file?.name || "Resume.pdf"}</p>
                  <p className="text-sm text-muted-foreground">
                    Uploaded successfully
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => window.open(resumeUrl, "_blank")}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={deleteResume}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {(uploading || analyzing) && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{uploading ? "Uploading..." : "Analyzing resume..."}</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {resumeData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">AI Extracted Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {resumeData.matchScore !== undefined && (
                  <div className="p-4 bg-blue-500/10 rounded-lg">
                    <h3 className="font-semibold mb-2">AI Match Score</h3>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-blue-500">
                        {resumeData.matchScore}%
                      </div>
                      <Progress value={resumeData.matchScore} className="flex-1 h-3" />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
})