"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000) // Show after 3 seconds for better UX

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {!isMinimized ? (
        <div className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-2xl shadow-2xl p-4 max-w-sm border border-primary/20 backdrop-blur-sm animate-in slide-in-from-bottom-4 fade-in duration-700 ease-out hover:shadow-primary/30 transition-all duration-300">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <div className="bg-primary-foreground/20 p-2 rounded-full mr-3">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Besoin d'un rendez-vous ?</h3>
                <p className="text-xs text-primary-foreground/80">Réservez en ligne maintenant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/20 h-6 w-6 p-0 transition-colors duration-200"
              onClick={() => setIsMinimized(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Link href="/appointment">
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg">
              <Calendar className="mr-2 h-4 w-4 animate-bounce" />
              Prendre RDV
            </Button>
          </Link>

          <p className="text-xs text-primary-foreground/70 mt-2 text-center">Réponse rapide • Service professionnel</p>
        </div>
      ) : (
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-full h-14 w-14 shadow-2xl border border-primary/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-primary/25 animate-in zoom-in-95 fade-in duration-500 ease-out animate-pulse hover:animate-none"
        >
          <Calendar className="h-6 w-6 animate-bounce" />
        </Button>
      )}
    </div>
  )
}
