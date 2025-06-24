import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Navigation() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="StampTag" width={200} height={200} />
      </div>

      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="hover:text-green-300 transition-colors">
          How it works
        </a>
        {/* <a href="#" className="hover:text-green-300 transition-colors">
          Pricing
        </a>
        <a href="#" className="hover:text-green-300 transition-colors">
          Contact
        </a> */}
      </div>

      <Button className="bg-green-400 hover:bg-green-500 text-black font-semibold px-6 rounded-full">
        Get Started
      </Button>
    </nav>
  )
} 