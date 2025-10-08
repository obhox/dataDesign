"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function ScreenSizeDetector() {
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [screenWidth, setScreenWidth] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const checkScreenSize = () => {
      const width = window.innerWidth
      setScreenWidth(width)
      // Consider screens smaller than 768px (typical tablet breakpoint) as small
      setIsSmallScreen(width < 768)
    }

    // Check initial screen size
    checkScreenSize()

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize)

    // Cleanup event listener
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // Reset dismissed state when screen becomes large again
  useEffect(() => {
    if (!isSmallScreen) {
      setDismissed(false)
    }
  }, [isSmallScreen])

  // Don't render anything until component is mounted (prevents hydration mismatch)
  if (!mounted) {
    return null
  }

  // Only show warning on small screens and if not dismissed
  if (!isSmallScreen || dismissed) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="max-w-md w-full p-8 text-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-black">
            Screen Too Small
          </h2>
          
          <p className="text-black text-lg">
            This application requires a larger screen.
          </p>
          
          <div className="space-y-2 text-black">
            <p className="text-sm">Current: {screenWidth}px</p>
            <p className="text-sm">Required: 768px minimum</p>
          </div>
          
          <p className="text-black">
            Please use a PC or tablet.
          </p>
          
          <Button 
            variant="outline" 
            onClick={() => setDismissed(true)}
            className="bg-white text-black border-black hover:bg-black hover:text-white transition-colors"
          >
            Continue Anyway
          </Button>
        </div>
      </div>
    </div>
  )
}