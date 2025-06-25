import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Share } from "lucide-react"
import achievements from "@/mock/achievements"

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="px-6 py-8 max-w-4xl mx-auto">
        {/* Profile Section */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-orange-300 to-pink-300 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">👩🏻</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2">Olivia Bennett</h1>
          <p className="text-gray-400 mb-1">@olivia.bennett</p>
          <p className="text-gray-500 mb-6">Digital artist and stamp collector</p>

          <Button className="bg-[rgba(42,90,71,0.1)] border border-[#3D5C4A] hover:bg-[rgba(42,90,71,0.3)] border-0 px-8 py-2 rounded-full">
            <Share className="w-4 h-4 mr-2" />
            Share My Profile
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[rgba(42,90,71,0.1)] border border-[#3D5C4A]">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">120</div>
              <div className="text-gray-400">Total Stamps</div>
            </CardContent>
          </Card>

          <Card className="bg-[rgba(42,90,71,0.1)] border border-[#3D5C4A]">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">30</div>
              <div className="text-gray-400">
                Daily
                <br />
                Streak
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[rgba(42,90,71,0.1)] border border-[#3D5C4A]">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">7</div>
              <div className="text-gray-400">Days Active</div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {achievements.filter(achievement => achievement.earned).map((achievement) => (
              <div key={achievement.id} className="text-center">
                <div
                  className={`w-20 h-20 ${achievement.color} rounded-full flex items-center justify-center mx-auto mb-2`}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                </div>
                <div className="text-xs text-gray-400 font-medium">{achievement.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Stats</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-[rgba(42,90,71,0.1)] border border-[#3D5C4A] border-0">
              <CardContent className="p-6">
                <div className="text-gray-400 text-sm mb-2">Total Clicks</div>
                <div className="text-3xl font-bold">1,234</div>
              </CardContent>
            </Card>

            <Card className="bg-[rgba(42,90,71,0.1)] border border-[#3D5C4A] border-0">
              <CardContent className="p-6">
                <div className="text-gray-400 text-sm mb-2">Most Clicked Tag</div>
                <div className="text-3xl font-bold">Coffee Shop</div>
              </CardContent>
            </Card>

            <Card className="bg-[rgba(42,90,71,0.1)] border border-[#3D5C4A] border-0">
              <CardContent className="p-6">
                <div className="text-gray-400 text-sm mb-2">Total Unique Stamps</div>
                <div className="text-3xl font-bold">56</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
