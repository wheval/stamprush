import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import Link from "next/link"
import leaderboardData from "@/mock/leaderboard"

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen text-gray-800 bg-gradient-to-br from-[#F9F9F9] to-[#FFFFFF]">
      {/* Main Content */}
      <main className="px-6 py-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#FF6F00] to-[#9C27B0] bg-clip-text text-transparent">StampQuest Leaderboard</h1>

        {/* Leaderboard Table */}
        <div className="bg-white border border-[#FF6F00]/20 rounded-2xl overflow-hidden mb-8 vibrant-shadow">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gradient-to-r from-[#FF6F00]/5 to-[#9C27B0]/5 border-b border-gray-200">
            <div className="text-[#FF6F00] font-semibold">Rank</div>
            <div className="text-[#9C27B0] font-semibold">Collector</div>
            <div className="text-[#00C9A7] font-semibold text-right">Stamps</div>
          </div>

          {/* Table Rows */}
          {leaderboardData.map((user, index) => (
            <div
              key={user.rank}
              className={`grid grid-cols-3 gap-4 px-6 py-4 hover:bg-gray-50 transition-all duration-300 playful-hover ${
                index !== leaderboardData.length - 1 ? "border-b border-gray-100" : ""
              } ${
                user.rank <= 3 ? "bg-gradient-to-r from-[#FF6F00]/5 to-[#00C9A7]/5" : ""
              }`}
            >
              <div className={`font-semibold ${
                user.rank === 1 ? "text-[#FF6F00]" :
                user.rank === 2 ? "text-[#9C27B0]" :
                user.rank === 3 ? "text-[#00C9A7]" :
                "text-gray-700"
              }`}>{user.rank}</div>
              <div className="text-gray-800">{user.name}</div>
              <div className="text-gray-800 text-right font-medium">{user.stamps.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Your Rank Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-[#FF6F00]">Your Rank</h2>

          <div className="bg-white border border-[#9C27B0]/20 rounded-2xl overflow-hidden vibrant-shadow-purple">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gradient-to-r from-[#9C27B0]/5 to-[#00C9A7]/5 border-b border-gray-200">
              <div className="text-[#FF6F00] font-semibold">Rank</div>
              <div className="text-[#9C27B0] font-semibold">Collector</div>
              <div className="text-[#00C9A7] font-semibold text-right">Stamps</div>
            </div>

            {/* Your Row */}
            <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gradient-to-r from-[#FF6F00]/5 to-[#9C27B0]/5">
              <div className="text-[#00C9A7] font-semibold">15</div>
              <div className="text-gray-800">You (Wallet Address: 0x123...456)</div>
              <div className="text-gray-800 text-right font-medium">550</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button asChild className="bg-[#FF6F00] hover:bg-[#FF6F00]/90 text-white font-semibold px-8 py-3 rounded-full vibrant-shadow transition-all duration-300 playful-hover">
            <Link href="/my-stamps">View My Stamps</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-[#9C27B0]/30 text-[#9C27B0] hover:bg-[#9C27B0]/10 px-8 py-3 rounded-full transition-all duration-300 playful-hover"
          >
            <Link href="/stamps">Claim Today's Stamp</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
