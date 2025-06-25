import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Share } from "lucide-react"
import achievements from "@/mock/achievements"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F9F9] to-[#FFFFFF]">
      {/* Main Content */}
      <main className="px-6 py-8 max-w-4xl mx-auto">
        {/* Profile Section */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-[#FF6F00] to-[#9C27B0] rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden vibrant-shadow">
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-[#00C9A7]/20 to-[#FF6F00]/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">👩🏻</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-[#FF6F00]">Olivia Bennett</h1>
          <p className="text-[#9C27B0] mb-1 font-medium">@olivia.bennett</p>
          <p className="text-gray-600 mb-6">Digital artist and stamp collector</p>

          <Button className="bg-white border border-[#FF6F00]/30 hover:bg-[#FF6F00]/5 px-8 py-2 rounded-full text-[#FF6F00] transition-all duration-300 vibrant-shadow playful-hover">
            <Share className="w-4 h-4 mr-2" />
            Share My Profile
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border border-[#FF6F00]/20 vibrant-shadow playful-hover">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2 text-[#00C9A7]">120</div>
              <div className="text-[#FF6F00] font-medium">Total Stamps</div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-[#9C27B0]/20 vibrant-shadow-purple playful-hover">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2 text-[#FF6F00]">30</div>
              <div className="text-[#9C27B0] font-medium">
                Daily
                <br />
                Streak
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-[#00C9A7]/20 vibrant-shadow-aqua playful-hover">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2 text-[#9C27B0]">7</div>
              <div className="text-[#00C9A7] font-medium">Days Active</div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-[#9C27B0]">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {achievements.filter(achievement => achievement.earned).map((achievement, index) => (
              <div key={achievement.id} className="text-center">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2 transition-all duration-300 hover:scale-110 playful-hover ${
                    index % 3 === 0 ? 'bg-gradient-to-br from-[#FF6F00] to-[#9C27B0] vibrant-shadow' :
                    index % 3 === 1 ? 'bg-gradient-to-br from-[#9C27B0] to-[#00C9A7] vibrant-shadow-purple' :
                    'bg-gradient-to-br from-[#00C9A7] to-[#FF6F00] vibrant-shadow-aqua'
                  }`}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                </div>
                <div className="text-xs text-gray-600 font-medium">{achievement.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-[#00C9A7]">Stats</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white border border-[#FF6F00]/20 vibrant-shadow playful-hover">
              <CardContent className="p-6">
                <div className="text-[#FF6F00] text-sm mb-2 font-medium">Total Clicks</div>
                <div className="text-3xl font-bold text-[#00C9A7]">1,234</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-[#9C27B0]/20 vibrant-shadow-purple playful-hover">
              <CardContent className="p-6">
                <div className="text-[#9C27B0] text-sm mb-2 font-medium">Most Clicked Tag</div>
                <div className="text-3xl font-bold text-[#FF6F00]">Coffee Shop</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-[#00C9A7]/20 vibrant-shadow-aqua playful-hover">
              <CardContent className="p-6">
                <div className="text-[#00C9A7] text-sm mb-2 font-medium">Total Unique Stamps</div>
                <div className="text-3xl font-bold text-[#9C27B0]">56</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
