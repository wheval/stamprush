import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import stamps from "@/mock/stamps"
import Image from "next/image"

const stampData = Object.fromEntries(stamps.map(stamp => [stamp.id, stamp]))

export default async function StampPage({ params }) {
  const { id } = await params
  const stamp = stampData[id]

  if (!stamp) {
    notFound()
  }

  return (
    <div className="min-h-screen text-gray-800 bg-gradient-to-br from-[#F9F9F9] to-[#FFFFFF]">
      {/* Main Content */}
      <main className="px-6 py-8 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-gray-600 mb-8">
          <Link href="/" className="hover:text-[#FF6F00] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/stamps" className="hover:text-[#FF6F00] transition-colors">
            <span>Stamps</span>
          </Link>
          <span>/</span>
          <span className="text-[#FF6F00] font-medium">{stamp.title}</span>
        </div>

        {/* Page Title */}
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#FF6F00] to-[#9C27B0] bg-clip-text text-transparent">Stamp Details</h1>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Stamp Visual */}
          <div className="space-y-6">
            <div className="relative flex items-start justify-start w-full h-96 bg-white border border-[#FF6F00]/20 rounded-xl overflow-hidden vibrant-shadow">
              {stamp.image.endsWith('.gif') ? (
                <img src={stamp.image} alt={stamp.title} className="object-contain object-left-top h-full" />
              ) : (
                <Image src={stamp.image} alt={stamp.title} fill className="object-contain object-left-top" />
              )}
            </div>
          </div>

          {/* Stamp Info */}
          <div className="space-y-6">
            <div className="bg-white border border-[#9C27B0]/20 rounded-xl p-6 vibrant-shadow-purple">
              <h2 className="text-2xl font-bold mb-3 text-[#FF6F00]">{stamp.title}</h2>
              <p className="text-gray-700 text-lg">{stamp.description}</p>
            </div>
          </div>
        </div>

        {/* Metadata Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-8 text-[#9C27B0]">Metadata</h3>

          <div className="bg-white border border-[#00C9A7]/20 rounded-xl p-8 vibrant-shadow-aqua">
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
              {/* Row 1 */}
              <div className="space-y-2">
                <div className="text-[#FF6F00] text-sm font-medium">Timestamp</div>
                <div className="text-gray-800 font-medium">{stamp.timestamp}</div>
                <div className="h-px bg-gray-200"></div>
              </div>

              <div className="space-y-2">
                <div className="text-[#9C27B0] text-sm font-medium">Interaction Type</div>
                <div className="text-gray-800 font-medium">{stamp.interactionType}</div>
                <div className="h-px bg-gray-200"></div>
              </div>

              {/* Row 2 */}
              <div className="space-y-2">
                <div className="text-[#00C9A7] text-sm font-medium">Location</div>
                <div className="text-gray-800 font-medium">{stamp.location}</div>
                <div className="h-px bg-gray-200"></div>
              </div>

              <div className="space-y-2">
                <div className="text-[#FF6F00] text-sm font-medium">Participants</div>
                <div className="text-gray-800 font-medium">{stamp.participants}</div>
                <div className="h-px bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-[#00C9A7]">Actions</h3>

          <div className="flex gap-4">
            <Button className="bg-[#FF6F00] hover:bg-[#FF6F00]/90 text-white font-semibold px-8 vibrant-shadow playful-hover transition-all duration-300">
              Share Stamp
            </Button>
            <Button variant="outline" className="border-[#9C27B0]/30 text-[#9C27B0] hover:bg-[#9C27B0]/10 px-8 playful-hover transition-all duration-300">
              View Transaction
            </Button>
          </div>
        </div>

        {/* Stamp ID */}
        <div className="text-gray-500 font-mono text-sm bg-gray-100 px-4 py-2 rounded-lg inline-block">
          Stamp ID: {stamp.stampId}
        </div>
      </main>
    </div>
  )
}
