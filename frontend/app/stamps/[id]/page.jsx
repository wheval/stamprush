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
    <div className="min-h-screen text-white">
      {/* Main Content */}
      <main className="px-6 py-8 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-white/60 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/stamps" className="hover:text-white transition-colors">
          <span>Stamp Details</span>
          </Link>
          <span>/</span>
          <Link href={`${id}`} className="hover:text-white transition-colors">
          <span>{id}</span>
          </Link>
        </div>

        {/* Page Title */}
        <h1 className="text-4xl font-bold mb-8">Stamp Details</h1>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Stamp Visual */}
          <div className="space-y-6">
            <div className="relative flex items-start justify-start w-full h-96 bg-[rgba(53, 197, 140, 0.89)] border-[#3a6a57] rounded-lg overflow-hidden">
              {stamp.image.endsWith('.gif') ? (
                <img src={stamp.image} alt={stamp.title} className="object-contain object-left-top h-full" />
              ) : (
                <Image src={stamp.image} alt={stamp.title} fill className="object-contain object-left-top" />
              )}
            </div>
          </div>

          {/* Stamp Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-3">{stamp.title}</h2>
              <p className="text-white/80 text-lg">{stamp.description}</p>
            </div>
          </div>
        </div>

        {/* Metadata Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-8">Metadata</h3>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
            {/* Row 1 */}
            <div className="space-y-2">
              <div className="text-white/60 text-sm">Timestamp</div>
              <div className="text-white font-medium">{stamp.timestamp}</div>
              <div className="h-px bg-white/20"></div>
            </div>

            <div className="space-y-2">
              <div className="text-white/60 text-sm">Interaction Type</div>
              <div className="text-white font-medium">{stamp.interactionType}</div>
              <div className="h-px bg-white/20"></div>
            </div>

            {/* Row 2 */}
            <div className="space-y-2">
              <div className="text-white/60 text-sm">Location</div>
              <div className="text-white font-medium">{stamp.location}</div>
              <div className="h-px bg-white/20"></div>
            </div>

            <div className="space-y-2">
              <div className="text-white/60 text-sm">Participants</div>
              <div className="text-white font-medium">{stamp.participants}</div>
              <div className="h-px bg-white/20"></div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">Actions</h3>

          <div className="flex gap-4">
            <Button className="bg-green-400 hover:bg-green-500 text-black font-semibold px-8">Share Stamp</Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
              View Transaction
            </Button>
          </div>
        </div>

        {/* Stamp ID */}
        <div className="text-white/60">Stamp ID: {stamp.stampId}</div>
      </main>
    </div>
  )
}
