"use client"

import { HomeValues } from "@/features/home/schema/homeValuesSchema"
import { Eye, ShoppingBag, MapPin, Shield, Star, Heart, Zap, Users, Award, Clock } from "lucide-react"

interface DynamicValuesProps {
  values: HomeValues[]
  siteSettings: string | null
}

// Icon mapping for dynamic icons
const iconMap: { [key: string]: any } = {
  Eye,
  ShoppingBag,
  MapPin,
  Shield,
  Star,
  Heart,
  Zap,
  Users,
  Award,
  Clock
}

export default function DynamicValues({ values, siteSettings }: DynamicValuesProps) {
  if (!values || values.length === 0) {
    return null
  }

  // Take only the first 3 values for home page display
  const featuredValues = values.slice(0, 3)

  // Define colors for each feature icon using CSS variables
  const iconColors = [
    'hsl(var(--primary))', // Primary color
    'hsl(var(--secondary))', // Secondary color
    'hsl(var(--primary))', // Primary color (alternating)
  ]

  const badgeBackground = 'hsl(var(--secondary))' // Secondary color
  const badgeText = 'hsl(var(--secondary-foreground))' // Secondary foreground

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <div 
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{
              backgroundColor: badgeBackground,
              color: badgeText
            }}
          >
            <Shield className="w-4 h-4 mr-2" />
            Pourquoi Choisir {siteSettings || 'nous'} ?
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">Pourquoi Choisir {siteSettings || 'nous'} ?</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Découvrez les valeurs qui font de nous votre partenaire de confiance pour votre vision
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {featuredValues.map((value, index) => {
            const IconComponent = iconMap[value.icon] || Shield
            const iconColor = iconColors[index] || 'hsl(var(--muted-foreground))'
            const isSecondary = index === 1 // Use secondary styling for middle card
            
            return (
              <div key={value.id} className={`text-center group hover:transform hover:scale-105 transition-all duration-300 ${isSecondary ? 'relative' : ''}`}>
                {isSecondary && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-secondary/20 to-primary/10 rounded-2xl blur-sm"></div>
                )}
                <div className={`relative ${isSecondary ? 'bg-gradient-to-br from-background to-secondary/5 border border-secondary/20' : 'bg-background'} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
                  <div 
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:shadow-lg transition-all duration-300 ${isSecondary ? 'bg-secondary/10 border-2 border-secondary/20' : 'bg-primary/10 border-2 border-primary/20'}`}
                  >
                    <IconComponent 
                      className={`h-8 w-8 md:h-10 md:w-10 ${isSecondary ? 'text-secondary' : 'text-primary'}`}
                    />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">{value.title}</h3>
                  <div className="mb-3">
                    <span 
                      className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${isSecondary ? 'bg-secondary/20 text-secondary border border-secondary/30' : 'bg-primary/20 text-primary border border-primary/30'}`}
                    >
                      {value.highlight}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{value.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
