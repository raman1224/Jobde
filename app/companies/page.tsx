// app/companies/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Building2, MapPin, Users, Briefcase, CheckCircle, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
 const Navbar = dynamic(() => import("@/components/layout/navbar").then(mod => mod.Navbar))
 const Footer = dynamic(() => import("@/components/layout/footer").then(mod => mod.Footer))
import dynamic from "next/dynamic"
interface Company {
  id: string
  name: string
  logo?: string
  industry?: string
  location?: string
  size?: string
  isVerified: boolean
  _count: { jobs: number }
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchCompanies()
  }, [])

  useEffect(() => {
    filterCompanies()
  }, [companies, searchQuery])

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/companies")
      const data = await res.json()
      setCompanies(data)
    } catch (error) {
      console.error("Failed to fetch companies:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterCompanies = () => {
    let filtered = [...companies]
    if (searchQuery) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    setFilteredCompanies(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-32">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-32">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Top <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">Companies</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover companies hiring in Nepal and find your perfect workplace
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search companies by name or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Companies Grid */}
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-semibold mb-2">No companies found</h3>
            <p className="text-slate-500">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/companies/${company.id}`}>
                  <Card className="h-full hover:shadow-xl transition-all cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="h-16 w-16 rounded-xl">
                          <AvatarImage src={company.logo} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-orange-500 text-white text-xl">
                            {company.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                              {company.name}
                            </h3>
                            {company.isVerified && (
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <p className="text-sm text-slate-500">{company.industry || "Various Industries"}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {company.location && (
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <MapPin className="h-4 w-4" />
                            {company.location}
                          </div>
                        )}
                        {company.size && (
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Users className="h-4 w-4" />
                            {company.size} employees
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Briefcase className="h-4 w-4" />
                          {company._count?.jobs || 0} open positions
                        </div>
                      </div>

                      <Button variant="outline" className="w-full gap-2 group-hover:border-blue-500">
                        View Company
                        <Briefcase className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}