// components/job-card.tsx - Make sure this exists
"use client"

import Link from "next/link"
import { Briefcase, MapPin, DollarSign, Clock, Building2, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

export function JobCard({ job }: { job: any }) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 h-full group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-600 to-orange-500 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <Badge variant="outline" className="text-xs">
            {job.employmentType?.replace("_", " ") || "Full Time"}
          </Badge>
        </div>
        
        <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
          <Link href={`/jobs/${job.id}`}>{job.title}</Link>
        </h3>
        <p className="text-sm text-slate-500 mb-3">{job.company?.name || "Company"}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{job.location || "Location not specified"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <DollarSign className="h-4 w-4 flex-shrink-0" />
            <span>
              {job.salaryMin && job.salaryMax 
                ? `NPR ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
                : "Salary not specified"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills?.slice(0, 3).map((skill: any) => (
            <Badge key={skill.id} variant="secondary" className="text-xs">
              {skill.name}
            </Badge>
          ))}
        </div>
        
        <Link href={`/jobs/${job.id}`}>
          <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}