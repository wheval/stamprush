"use client"

import { Input } from "@/components/ui/input"

export default function DemoPage() {
  return (
    <div className="min-h-screen text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Input Component Demo</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Default Input</label>
            <Input placeholder="Enter your name" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Outline Variant</label>
            <Input variant="outline" placeholder="Outline variant" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Filled Variant</label>
            <Input variant="filled" placeholder="Filled variant" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Error Variant</label>
            <Input variant="error" placeholder="Error variant" error="This field is required" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Small Size</label>
            <Input size="sm" placeholder="Small input" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Large Size</label>
            <Input size="lg" placeholder="Large input" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Extra Large Size</label>
            <Input size="xl" placeholder="Extra large input" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Disabled Input</label>
            <Input placeholder="Disabled input" disabled />
          </div>
        </div>
      </div>
    </div>
  )
} 