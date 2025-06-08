"use client"

import { useState } from "react"
import { Search, MapPin, Clock, Heart, ExternalLink, Sparkles, Zap, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

// Mock job data with more modern, fun descriptions
const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Solutions",
    location: "Bangalore",
    type: "Full-time",
    experience: "3-5 years",
    salary: "₹12-18 LPA",
    posted: "2d",
    source: "LinkedIn",
    skills: ["React", "TypeScript", "Next.js", "Tailwind"],
    description:
      "Join our awesome team and build the future of web! 🚀 Work with cutting-edge tech and amazing people.",
    saved: false,
    featured: true,
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Mumbai",
    type: "Full-time",
    experience: "2-4 years",
    salary: "₹8-15 LPA",
    posted: "1d",
    source: "Naukri",
    skills: ["Node.js", "React", "MongoDB", "Express"],
    description: "Be part of something big! Help us revolutionize the industry with innovative solutions. ⚡",
    saved: true,
    featured: false,
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "DataTech Inc",
    location: "Hyderabad",
    type: "Full-time",
    experience: "4-6 years",
    salary: "₹15-22 LPA",
    posted: "3d",
    source: "Indeed",
    skills: ["Python", "Django", "PostgreSQL", "AWS"],
    description: "Scale systems that millions love! Work on challenging problems with a brilliant team. 💡",
    saved: false,
    featured: false,
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudFirst Technologies",
    location: "Pune",
    type: "Full-time",
    experience: "3-5 years",
    salary: "₹14-20 LPA",
    posted: "1d",
    source: "Unstop",
    skills: ["Docker", "Kubernetes", "AWS", "Jenkins"],
    description: "Automate everything! Join our mission to make deployments seamless and fun. 🔧",
    saved: false,
    featured: true,
  },
  {
    id: 5,
    title: "UI/UX Designer",
    company: "DesignStudio Pro",
    location: "Delhi",
    type: "Full-time",
    experience: "2-4 years",
    salary: "₹6-12 LPA",
    posted: "4d",
    source: "LinkedIn",
    skills: ["Figma", "Adobe XD", "Prototyping", "Research"],
    description: "Create beautiful experiences that users absolutely love! Design the future with us. 🎨",
    saved: true,
    featured: false,
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "AI Innovations Ltd",
    location: "Chennai",
    type: "Full-time",
    experience: "3-6 years",
    salary: "₹16-25 LPA",
    posted: "2d",
    source: "Naukri",
    skills: ["Python", "ML", "TensorFlow", "SQL"],
    description: "Turn data into magic! Build AI solutions that change the world. 🤖",
    saved: false,
    featured: false,
  },
]

const jobSources = [
  { value: "all", label: "All Sources", icon: "🌐" },
  { value: "linkedin", label: "LinkedIn", icon: "💼" },
  { value: "naukri", label: "Naukri", icon: "🎯" },
  { value: "indeed", label: "Indeed", icon: "🔍" },
  { value: "unstop", label: "Unstop", icon: "🚀" },
]

export default function JobPlatform() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSource, setSelectedSource] = useState("all")
  const [savedJobs, setSavedJobs] = useState(new Set([2, 5]))
  const [selectedJob, setSelectedJob] = useState(mockJobs[0])

  const toggleSaveJob = (jobId: number) => {
    const newSavedJobs = new Set(savedJobs)
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId)
    } else {
      newSavedJobs.add(jobId)
    }
    setSavedJobs(newSavedJobs)
  }

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesSource = selectedSource === "all" || job.source.toLowerCase() === selectedSource

    return matchesSearch && matchesSource
  })

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
              <Button className="h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-2xl shadow-lg">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Listings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{filteredJobs.length} Jobs Found</h3>
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

            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-md ${
                    selectedJob.id === job.id ? "ring-2 ring-blue-400 shadow-blue-100" : "hover:shadow-slate-200"
                  } ${job.featured ? "bg-gradient-to-r from-blue-50 to-purple-50" : "bg-white"} rounded-2xl overflow-hidden`}
                  onClick={() => setSelectedJob(job)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl text-slate-900">{job.title}</CardTitle>
                          {job.featured && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
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
                        <Clock className="h-4 w-4" />
                        {job.posted}
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
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{job.salary}</div>
                        <div className="text-sm text-slate-500">{job.experience}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Job Details */}
          <div className="hidden lg:block">
            <Card className="sticky top-32 border-0 shadow-xl rounded-2xl overflow-hidden bg-white">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 pb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-2xl text-slate-900">{selectedJob.title}</CardTitle>
                      {selectedJob.featured && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-xl font-medium text-slate-700 mb-3">
                      {selectedJob.company}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {selectedJob.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {selectedJob.posted}
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="text-sm text-slate-500 mb-1">Salary</div>
                      <div className="text-xl font-bold text-green-600">{selectedJob.salary}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="text-sm text-slate-500 mb-1">Experience</div>
                      <div className="font-semibold text-slate-900">{selectedJob.experience}</div>
                    </div>
                  </div>

                  <Separator />

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
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-xl shadow-lg flex items-center gap-2">
                      Apply Now
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
