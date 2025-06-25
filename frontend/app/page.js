import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Zap, Award } from "lucide-react"
import Image from "next/image"
import Navigation from "@/components/Navigation"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F9F9] to-[#FFFFFF]">
      {/* Hero Section */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="relative">
          {/* Hero Image */}
          <div className="relative w-full max-w-6xl mx-auto mb-8">
            {/* <Image
              src="/hero-illustration.png"
              alt="Hands interacting with mobile device showing proof of contact"
              width={800}
              height={400}
              className="w-full h-auto rounded-2xl"
              priority
            /> */}

            {/* Overlay Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#FF6F00] to-[#9C27B0] bg-clip-text text-transparent">
                  Find fast. Claim fast. Flex hard.
                </h1>
                <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
                  Collect rare digital stamps at lightning speed! Claim, Flex, Dominate the leaderboards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Powered by Starknet Section */}
      <section className="px-6 py-8 max-w-7xl mx-auto text-center">
        <Link href="/today">
          <Button
            size="lg"
            className="bg-[#FF6F00] hover:bg-[#FF6F00]/90 text-white font-bold px-8 py-3 text-lg mb-4 vibrant-shadow uppercase font-semibold transition-all duration-300 playful-hover"
          >
            Start Collecting
          </Button>
        </Link>
        <p className="text-sm flex items-center justify-center gap-2 text-[#00C9A7] font-medium">
          Powered by Starknet <img src="/strk-logo.svg" alt="Starknet Logo" className="h-6 w-auto" />
        </p>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#FF6F00]">Features</h2>
          <p className="text-lg text-gray-600">Explore the key features of StampQuest</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Instant Stamps */}
          <Card className="bg-white border-[#FF6F00]/20 hover:border-[#FF6F00]/40 transition-all duration-300 vibrant-shadow playful-hover">
            <CardContent className="p-6">
              <div className="mb-4">
                <Zap className="w-8 h-8 text-[#00C9A7]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#FF6F00]">Instant Stamps</h3>
              <p className="text-gray-600">
                Tap NFC tags to instantly create blockchain stamps of your real-world interactions
              </p>
            </CardContent>
          </Card>

          {/* No Crypto Needed */}
          <Card className="bg-white border-[#9C27B0]/20 hover:border-[#9C27B0]/40 transition-all duration-300 vibrant-shadow-purple playful-hover">
            <CardContent className="p-6">
              <div className="mb-4">
                <Shield className="w-8 h-8 text-[#FF6F00]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#9C27B0]">No Crypto Needed</h3>
              <p className="text-gray-600">
                Simple email login. No wallets, seed phrases, or crypto knowledge required
              </p>
            </CardContent>
          </Card>

          {/* Digital Badges */}
          <Card className="bg-white border-[#00C9A7]/20 hover:border-[#00C9A7]/40 transition-all duration-300 vibrant-shadow-aqua playful-hover">
            <CardContent className="p-6">
              <div className="mb-4">
                <Award className="w-8 h-8 text-[#9C27B0]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#00C9A7]">Digital Badges</h3>
              <p className="text-gray-600">
                Collect and showcase your stamps as beautiful digital badges in your history
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 max-w-7xl mx-auto border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-8">
            <a href="#" className="text-gray-500 hover:text-[#FF6F00] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-[#FF6F00] transition-colors">
              Terms of Service
            </a>
          </div>

          <p className="text-gray-500 text-sm">@2024 StampTag. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}