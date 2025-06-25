"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Bell, Upload } from "lucide-react"
import Link from "next/link"

export default function SubmitTagPage() {
  const [formData, setFormData] = useState({
    tagName: "",
    tagDescription: "",
    tagLocation: "",
    tagImage: null,
    claimRules: {
      firstComeFirstServed: false,
      limitedClaims: false,
      timeLimited: false,
    },
    numberOfClaims: "",
    startDate: "",
    endDate: "",
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleClaimRuleChange = (rule, checked) => {
    setFormData((prev) => ({
      ...prev,
      claimRules: {
        ...prev.claimRules,
        [rule]: checked,
      },
    }))
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        tagImage: file,
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Submitting tag:", formData)
    // Handle form submission here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      {/* Main Content */}
      <main className="px-6 py-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 via-purple-500 to-teal-500 bg-clip-text text-transparent mb-2">
            Submit a Tag
          </h1>
          <p className="text-gray-600 text-lg">Create a new stamp tag for the community</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border-2 border-orange-200 shadow-lg shadow-orange-100/50">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Tag Name */}
            <div className="space-y-3">
              <Label htmlFor="tagName" className="text-lg font-semibold text-gray-800">
                Tag Name
              </Label>
              <Input
                id="tagName"
                type="text"
                placeholder="Enter tagname"
                value={formData.tagName}
                onChange={(e) => handleInputChange("tagName", e.target.value)}
                className="bg-white border-2 border-orange-200 focus:border-orange-500 text-gray-800 placeholder:text-gray-400 rounded-xl p-4 text-lg transition-all duration-200 hover:border-orange-300 focus:shadow-lg focus:shadow-orange-100"
              />
            </div>

            {/* Tag Description */}
            <div className="space-y-3">
              <Label htmlFor="tagDescription" className="text-lg font-semibold text-gray-800">
                Tag Description
              </Label>
              <Textarea
                id="tagDescription"
                placeholder="Enter tagdescription"
                value={formData.tagDescription}
                onChange={(e) => handleInputChange("tagDescription", e.target.value)}
                className="bg-white border-2 border-purple-200 focus:border-purple-500 text-gray-800 placeholder:text-gray-400 rounded-xl p-4 text-lg min-h-[120px] transition-all duration-200 hover:border-purple-300 focus:shadow-lg focus:shadow-purple-100"
              />
            </div>

            {/* Tag Location */}
            <div className="space-y-3">
              <Label htmlFor="tagLocation" className="text-lg font-semibold text-gray-800">
                Tag Location
              </Label>
              <Input
                id="tagLocation"
                type="text"
                placeholder="Enter taglocation"
                value={formData.tagLocation}
                onChange={(e) => handleInputChange("tagLocation", e.target.value)}
                className="bg-white border-2 border-teal-200 focus:border-teal-500 text-gray-800 placeholder:text-gray-400 rounded-xl p-4 text-lg transition-all duration-200 hover:border-teal-300 focus:shadow-lg focus:shadow-teal-100"
              />
            </div>

            {/* Tag Image */}
            <div className="space-y-3">
              <Label htmlFor="tagImage" className="text-lg font-semibold text-gray-800">
                Tag Image
              </Label>
              <div className="relative">
                <Input id="tagImage" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <Label
                  htmlFor="tagImage"
                  className="flex items-center gap-4 bg-gradient-to-r from-orange-50 to-purple-50 border-2 border-dashed border-orange-300 text-gray-600 p-6 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-gradient-to-r hover:from-orange-100 hover:to-purple-100 transition-all duration-200 group"
                >
                  <Upload className="w-6 h-6 text-orange-500 group-hover:text-orange-600 transition-colors" />
                  <span className="text-lg">
                    {formData.tagImage ? formData.tagImage.name : "Upload tagimage"}
                  </span>
                </Label>
              </div>
            </div>

            {/* Claim Rules */}
            <div className="space-y-6">
              <Label className="text-lg font-semibold text-gray-800">Claim Rules</Label>
              <div className="bg-gradient-to-r from-purple-50 to-teal-50 p-6 rounded-xl border-2 border-purple-200">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/50 transition-colors">
                    <Checkbox
                      id="firstCome"
                      checked={formData.claimRules.firstComeFirstServed}
                      onCheckedChange={(checked) => handleClaimRuleChange("firstComeFirstServed", checked)}
                      className="border-2 border-orange-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                    />
                    <Label htmlFor="firstCome" className="text-gray-800 text-lg cursor-pointer">
                      First-come, first-served
                    </Label>
                  </div>

                  <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/50 transition-colors">
                    <Checkbox
                      id="limitedClaims"
                      checked={formData.claimRules.limitedClaims}
                      onCheckedChange={(checked) => handleClaimRuleChange("limitedClaims", checked)}
                      className="border-2 border-purple-300 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                    />
                    <Label htmlFor="limitedClaims" className="text-gray-800 text-lg cursor-pointer">
                      Limited number of claims
                    </Label>
                  </div>

                  <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/50 transition-colors">
                    <Checkbox
                      id="timeLimited"
                      checked={formData.claimRules.timeLimited}
                      onCheckedChange={(checked) => handleClaimRuleChange("timeLimited", checked)}
                      className="border-2 border-teal-300 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                    />
                    <Label htmlFor="timeLimited" className="text-gray-800 text-lg cursor-pointer">
                      Time-limited claim
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Number of Claims */}
            {formData.claimRules.limitedClaims && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                <Label htmlFor="numberOfClaims" className="text-lg font-semibold text-gray-800">
                  Number of Claims
                </Label>
                <Input
                  id="numberOfClaims"
                  type="number"
                  placeholder="Enter numberofclaims"
                  value={formData.numberOfClaims}
                  onChange={(e) => handleInputChange("numberOfClaims", e.target.value)}
                  className="bg-white border-2 border-purple-200 focus:border-purple-500 text-gray-800 placeholder:text-gray-400 rounded-xl p-4 text-lg transition-all duration-200 hover:border-purple-300 focus:shadow-lg focus:shadow-purple-100"
                />
              </div>
            )}

            {/* Date Range */}
            {formData.claimRules.timeLimited && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-3">
                  <Label htmlFor="startDate" className="text-lg font-semibold text-gray-800">
                    Start Date
                  </Label>
                  <Select value={formData.startDate} onValueChange={(value) => handleInputChange("startDate", value)}>
                    <SelectTrigger className="bg-white border-2 border-teal-200 focus:border-teal-500 text-gray-800 rounded-xl p-4 text-lg hover:border-teal-300 transition-all duration-200">
                      <SelectValue placeholder="Select startdate" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-teal-200 rounded-xl">
                      <SelectItem value="today" className="hover:bg-teal-50 text-lg">Today</SelectItem>
                      <SelectItem value="tomorrow" className="hover:bg-teal-50 text-lg">Tomorrow</SelectItem>
                      <SelectItem value="next-week" className="hover:bg-teal-50 text-lg">Next Week</SelectItem>
                      <SelectItem value="custom" className="hover:bg-teal-50 text-lg">Custom Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="endDate" className="text-lg font-semibold text-gray-800">
                    End Date
                  </Label>
                  <Select value={formData.endDate} onValueChange={(value) => handleInputChange("endDate", value)}>
                    <SelectTrigger className="bg-white border-2 border-orange-200 focus:border-orange-500 text-gray-800 rounded-xl p-4 text-lg hover:border-orange-300 transition-all duration-200">
                      <SelectValue placeholder="Select enddate" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-orange-200 rounded-xl">
                      <SelectItem value="1-day" className="hover:bg-orange-50 text-lg">1 Day</SelectItem>
                      <SelectItem value="1-week" className="hover:bg-orange-50 text-lg">1 Week</SelectItem>
                      <SelectItem value="1-month" className="hover:bg-orange-50 text-lg">1 Month</SelectItem>
                      <SelectItem value="custom" className="hover:bg-orange-50 text-lg">Custom Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-8">
              <Button
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50 transition-all duration-200 transform hover:scale-105"
              >
                Submit Tag
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
