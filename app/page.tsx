"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, MapPin, Clock, Heart, ExternalLink, Sparkles, Zap, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { fetchJobs, type Job } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const jobSources = [
  { value: "all", label: "All Sources", icon: "🌐" },
  { value: "linkedin", label: "LinkedIn", icon: "💼" },
  { value: "naukri", label: "Naukri", icon: "🎯" },
  { value: "indeed", label: "Indeed", icon: "🔍" },
  { value: "unstop", label: "Unstop", icon: "🚀" },
]

const countries = [
  { value: "in", label: "India" },
  { value: "gb", label: "United Kingdom" },
  { value: "us", label: "United States" },
  // Add more as needed
];
const statesInIndia = [
  "Karnataka", "Maharashtra", "Delhi", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Gujarat", "West Bengal", "Rajasthan", "Madhya Pradesh", "Punjab", "Haryana", "Bihar", "Kerala", "Odisha", "Chhattisgarh", "Assam", "Jharkhand", "Uttarakhand", "Himachal Pradesh", "Goa", "Puducherry", "Chandigarh", "Tripura", "Meghalaya", "Manipur", "Nagaland", "Arunachal Pradesh", "Mizoram", "Sikkim", "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Ladakh", "Jammu and Kashmir"
];

const experienceOptions = [
  { value: 'any', label: 'Any Experience' },
  { value: '0-1', label: '0-1 years' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5+', label: '5+ years' },
];

export default function JobPlatform() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSource, setSelectedSource] = useState("all")
  const [savedJobs, setSavedJobs] = useState(new Set<string>())
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const [country, setCountry] = useState("in");
  const [state, setState] = useState("all");
  const [experience, setExperience] = useState('any');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async (newPage = page) => {
    try {
      setIsLoading(true)
      setError(null)
      let where = country;
      if (country === "in" && state && state !== "all") where += ", " + state;
      const expParam = experience === 'any' ? '' : experience;
      const data = await fetchJobs(searchQuery, selectedSource === "all" ? "" : selectedSource, where, expParam, newPage)
      setJobs(data)
      if (data.length > 0 && !selectedJob) {
        setSelectedJob(data[0])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load jobs"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSaveJob = (jobId: string) => {
    const newSavedJobs = new Set(savedJobs)
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId)
      toast({
        title: "Job Unsaved",
        description: "Job has been removed from your saved jobs",
      })
    } else {
      newSavedJobs.add(jobId)
      toast({
        title: "Job Saved",
        description: "Job has been added to your saved jobs",
      })
    }
    setSavedJobs(newSavedJobs)
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Existing search and source filter
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesSource = selectedSource === "all" || job.source.toLowerCase() === selectedSource
      return matchesSearch && matchesSource;
    });
  }, [jobs, searchQuery, selectedSource]);

  const getSourceIcon = (source: string) => {
    const sourceMap: { [key: string]: string } = {
      LinkedIn: "💼",
      Naukri: "🎯",
      Indeed: "🔍",
      Unstop: "🚀",
    }
    return sourceMap[source] || "🌐"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  JobFinder Pro
                </h1>
                <p className="text-sm text-slate-500">Find your dream job ✨</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                Sign In
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg">
                Post Job
              </Button>
            </div>
          </div>

          {/* Search Section */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-slate-900 mb-3">Discover Amazing Jobs 🎯</h2>
              <p className="text-lg text-slate-600">Search across all platforms in one place</p>
            </div>

            <div className="flex flex-wrap gap-4 mb-4 items-center">
              {/* Country filter */}
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="w-40 rounded-2xl border-slate-200">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* State filter (only for India) */}
              {country === "in" && (
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger className="w-48 rounded-2xl border-slate-200">
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="all" value="all">All States</SelectItem>
                    {statesInIndia.filter(Boolean).map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search for your next adventure..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-2xl shadow-sm"
                />
              </div>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-48 h-14 rounded-2xl border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {jobSources.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      <span className="flex items-center gap-2">
                        <span>{source.icon}</span>
                        {source.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger className="w-48 rounded-2xl border-slate-200">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  {experienceOptions.map((exp) => (
                    <SelectItem key={exp.value} value={exp.value}>{exp.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                className="h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-2xl shadow-lg"
                onClick={() => { setPage(1); loadJobs(1); }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Listings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {isLoading ? "Loading..." : `${filteredJobs.length} Jobs Found`}
                </h3>
                <p className="text-slate-600">Perfect matches for you</p>
              </div>
              <Select defaultValue="recent">
                <SelectTrigger className="w-40 rounded-xl border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">✨ Most Recent</SelectItem>
                  <SelectItem value="relevant">🎯 Most Relevant</SelectItem>
                  <SelectItem value="salary">💰 Highest Salary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-4">
                      <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-slate-200 rounded w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-slate-200 rounded w-full mb-4" />
                      <div className="flex gap-2">
                        <div className="h-6 bg-slate-200 rounded w-20" />
                        <div className="h-6 bg-slate-200 rounded w-20" />
                        <div className="h-6 bg-slate-200 rounded w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">No jobs found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Card
                    key={job.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-md ${
                      selectedJob?.id === job.id ? "ring-2 ring-blue-400 shadow-blue-100" : "hover:shadow-slate-200"
                    } rounded-2xl overflow-hidden`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl text-slate-900">{job.title}</CardTitle>
                          </div>
                          <CardDescription className="text-lg font-medium text-slate-700">{job.company}</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleSaveJob(job.id)
                          }}
                          className="hover:bg-red-50 rounded-full"
                        >
                          <Heart
                            className={`h-5 w-5 transition-colors ${
                              savedJobs.has(job.id) ? "fill-red-500 text-red-500" : "text-slate-400 hover:text-red-400"
                            }`}
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-6 text-sm text-slate-500 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{getSourceIcon(job.source)}</span>
                          {job.source}
                        </div>
                      </div>

                      <p className="text-slate-600 mb-4 leading-relaxed">{job.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 3).map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-full px-3 py-1"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 3 && (
                            <Badge variant="outline" className="rounded-full">
                              +{job.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex justify-center gap-4 mt-6">
              <Button onClick={() => { if (page > 1) { setPage(page - 1); loadJobs(page - 1); } }} disabled={page === 1 || isLoading}>
                Previous
              </Button>
              <span>Page {page}</span>
              <Button onClick={() => { setPage(page + 1); loadJobs(page + 1); }} disabled={isLoading}>
                Next
              </Button>
            </div>
          </div>

          {/* Job Details */}
          <div className="hidden lg:block">
            {selectedJob ? (
              <Card className="sticky top-32 border-0 shadow-xl rounded-2xl overflow-hidden bg-white">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 pb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-2xl text-slate-900">{selectedJob.title}</CardTitle>
                      </div>
                      <CardDescription className="text-xl font-medium text-slate-700 mb-3">
                        {selectedJob.company}
                      </CardDescription>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {selectedJob.location}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSaveJob(selectedJob.id)}
                      className="hover:bg-red-50 rounded-full"
                    >
                      <Heart
                        className={`h-6 w-6 transition-colors ${
                          savedJobs.has(selectedJob.id)
                            ? "fill-red-500 text-red-500"
                            : "text-slate-400 hover:text-red-400"
                        }`}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-blue-500" />
                        Required Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skills.map((skill) => (
                          <Badge
                            key={skill}
                            className="bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full px-3 py-1 border-0"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">About this role</h4>
                      <p className="text-slate-600 leading-relaxed">{selectedJob.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>{getSourceIcon(selectedJob.source)}</span>
                        <span>via {selectedJob.source}</span>
                      </div>
                      {selectedJob && selectedJob.url ? (
                        <a
                          href={selectedJob.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none' }}
                        >
                          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-xl shadow-lg flex items-center gap-2">
                            Apply Now
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      ) : (
                        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-xl shadow-lg flex items-center gap-2" disabled>
                          Apply Now
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12 text-slate-500">
                Select a job to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
