"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ComponentsDemoPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [search, setSearch] = useState("")
  const [errorInput, setErrorInput] = useState("")

  return (
    <div className="min-h-screen text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Input Component Demo</h1>
        
        <div className="grid gap-8">
          {/* Basic Inputs */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Basic Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Default Input</label>
                <Input 
                  placeholder="Enter your name" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email Input</label>
                <Input 
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Password Input</label>
                <Input 
                  type="password" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Input Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Default Variant</label>
                <Input 
                  variant="default"
                  placeholder="Default variant"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Outline Variant</label>
                <Input 
                  variant="outline"
                  placeholder="Outline variant"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Filled Variant</label>
                <Input 
                  variant="filled"
                  placeholder="Filled variant"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Error Variant</label>
                <Input 
                  variant="error"
                  placeholder="Error variant"
                  error="This field is required"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sizes */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Input Sizes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Small Size</label>
                <Input 
                  size="sm"
                  placeholder="Small input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Default Size</label>
                <Input 
                  size="default"
                  placeholder="Default size"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Large Size</label>
                <Input 
                  size="lg"
                  placeholder="Large input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Extra Large Size</label>
                <Input 
                  size="xl"
                  placeholder="Extra large input"
                />
              </div>
            </CardContent>
          </Card>

          {/* Interactive Examples */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Interactive Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Search Input</label>
                <Input 
                  placeholder="Search for stamps..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Input with Error</label>
                <Input 
                  placeholder="Enter required field"
                  value={errorInput}
                  onChange={(e) => setErrorInput(e.target.value)}
                  error={errorInput.length === 0 ? "This field is required" : ""}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Disabled Input</label>
                <Input 
                  placeholder="Disabled input"
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          {/* Usage Examples */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Usage Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800 p-4 rounded-lg">
                <pre className="text-sm text-green-400">
{`// Basic usage
<Input placeholder="Enter text" />

// With variants
<Input variant="outline" placeholder="Outline style" />
<Input variant="filled" placeholder="Filled style" />
<Input variant="error" error="Error message" />

// With sizes
<Input size="sm" placeholder="Small" />
<Input size="lg" placeholder="Large" />
<Input size="xl" placeholder="Extra Large" />

// With controlled value
<Input 
  value={value} 
  onChange={(e) => setValue(e.target.value)} 
/>`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 