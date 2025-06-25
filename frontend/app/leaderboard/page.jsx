import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import Link from "next/link"
import leaderboardData from "@/mock/leaderboard"

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen text-white">
      {/* Main Content */}
      <main className="px-6 py-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">StampQuest Leaderboard</h1>

        {/* Leaderboard Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-white/5 border-b border-white/10">
            <div className="text-white/80 font-medium">Rank</div>
            <div className="text-white/80 font-medium">Collector</div>
            <div className="text-white/80 font-medium text-right">Stamps</div>
          </div>

          {/* Table Rows */}
          {leaderboardData.map((user, index) => (
            <div
              key={user.rank}
              className={`grid grid-cols-3 gap-4 px-6 py-4 hover:bg-white/5 transition-colors ${
                index !== leaderboardData.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <div className="text-white font-medium">{user.rank}</div>
              <div className="text-white">{user.name}</div>
              <div className="text-white text-right">{user.stamps.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Your Rank Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Rank</h2>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-white/5 border-b border-white/10">
              <div className="text-white/80 font-medium">Rank</div>
              <div className="text-white/80 font-medium">Collector</div>
              <div className="text-white/80 font-medium text-right">Stamps</div>
            </div>

            {/* Your Row */}
            <div className="grid grid-cols-3 gap-4 px-6 py-4">
              <div className="text-white font-medium">15</div>
              <div className="text-white">You (Wallet Address: 0x123...456)</div>
              <div className="text-white text-right">550</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button asChild className="bg-green-400 hover:bg-green-500 text-black font-semibold px-8 py-3 rounded-full">
            <Link href="/stamps">View My Stamps</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-full"
          >
            <Link href="/today">Claim Today's Stamp</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
