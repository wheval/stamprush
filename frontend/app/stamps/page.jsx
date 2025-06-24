"use client"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import stamps from "../mock/stamps"
import Navigation from "@/components/Navigation"
import Pagination from "@/components/ui/pagination"
import { useState } from "react"
import Image from "next/image"

export default function StampsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const stampsPerPage = 15;
  const totalPages = Math.ceil(stamps.length / stampsPerPage);
  const paginatedStamps = stamps.slice((currentPage - 1) * stampsPerPage, currentPage * stampsPerPage);

  return (
    <div className="min-h-screen text-white">
      {/* Main Content */}
      <main className="px-6 py-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Stamps</h1>
        {/* Stamps Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {paginatedStamps.map((stamp) => (
            <Link key={stamp.id} href={`/stamps/${stamp.id}`}>
              <Card
                className={"border-0 rounded-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer group"}
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
