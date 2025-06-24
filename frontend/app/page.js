import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Zap, Award } from "lucide-react"
import Image from "next/image"
import Navigation from "@/components/Navigation"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="relative">
          {/* Hero Image */}
          <div className="relative w-full max-w-4xl mx-auto mb-8">
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
                <h1 className="text-4xl md:text-6xl font-bold mb-4">Proof of Contact</h1>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                  Verify real-world interactions and mint proof-of-contact stamps on the blockchain. No crypto required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Powered by Starknet Section */}
      <section className="px-6 py-8 max-w-7xl mx-auto text-center">
        <p className="text-lg mb-6">Powered by Starknet <img url="/strk-logo.svg" /></p>
        
        <Link href="/scan">
        <Button
          size="lg"
          className="bg-green-400 font-semibold hover:bg-green-500 text-black font-bold px-8 py-3 text-lg mb-4"
        >
          TAP HERE
        </Button>
        </Link>

        <p className="text-white/80">Hold near NFC tag</p>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Features</h2>
          <p className="text-lg text-white/80">Explore the key features of StampTag</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Instant Stamps */}
          <Card className="bg-[rgba(42,90,71,0.35)] border-[#3a6a57] hover:bg-[#2f5f4c] transition-colors">
            <CardContent className="p-6 text-[#9CBFAB]">
              <div className="mb-4">
                <Zap className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Instant Stamps</h3>
              <p className="text-white/80">
                Tap NFC tags to instantly create blockchain stamps of your real-world interactions
              </p>
            </CardContent>
          </Card>

          {/* No Crypto Needed */}
          <Card className="bg-[rgba(42,90,71,0.35)] border-[#3a6a57] hover:bg-[#2f5f4c] transition-colors">
            <CardContent className="p-6 text-[#9CBFAB]">
              <div className="mb-4">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">No Crypto Needed</h3>
              <p className="text-white/80">
                Simple email login. No wallets, seed phrases, or crypto knowledge required
              </p>
            </CardContent>
          </Card>

          {/* Digital Badges */}
          <Card className="bg-[rgba(42,90,71,0.35)] border-[#3a6a57] hover:bg-[#2f5f4c] transition-colors">
            <CardContent className="p-6 text-[#9CBFAB]">
              <div className="mb-4">
                <Award className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Digital Badges</h3>
              <p className="text-white/80">
                Collect and showcase your stamps as beautiful digital badges in your history
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-8">
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>

          <p className="text-white/60 text-sm">@2024 StampTag. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}