"use client"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import stamps from "@/mock/stamps"
import Navigation from "@/components/Navigation.jsx"
import Pagination from "@/components/ui/pagination"
import { useState } from "react"
import Image from "next/image"

export default function StampsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const stampsPerPage = 15;
  const totalPages = Math.ceil(stamps.length / stampsPerPage);
  const paginatedStamps = stamps.slice((currentPage - 1) * stampsPerPage, currentPage * stampsPerPage);

  return (
    <div className="min-h-screen text-gray-800 bg-gradient-to-br from-[#F9F9F9] to-[#FFFFFF]">
      {/* Main Content */}
      <main className="px-6 py-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#FF6F00] to-[#9C27B0] bg-clip-text text-transparent">My Stamps</h1>
        {/* Stamps Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {paginatedStamps.map((stamp, index) => (
                                <Link key={stamp.id} href={`/my-stamps/${stamp.id}`}>
              <Card
                className={`border-0 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer group bg-white playful-hover ${
                  index % 3 === 0 ? 'border border-[#FF6F00]/20 hover:border-[#FF6F00]/40 vibrant-shadow' :
                  index % 3 === 1 ? 'border border-[#9C27B0]/20 hover:border-[#9C27B0]/40 vibrant-shadow-purple' :
                  'border border-[#00C9A7]/20 hover:border-[#00C9A7]/40 vibrant-shadow-aqua'
                }`}
              >
                <div className="relative aspect-[3/4] p-0 flex items-center justify-center w-full h-48">
                  {stamp.image.endsWith('.gif') ? (
                    <img src={stamp.image} alt={stamp.title} className="w-full h-full object-contain" />
                  ) : (
                    <Image src={stamp.image} alt={stamp.title} fill className="object-contain" />
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </main>
    </div>
  )
}
