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

  // Define colors for each feature icon
  const iconColors = [
    '#10B981', // Green
    '#F59E0B', // Amber
    '#8B5CF6', // Purple
  ]

  const badgeBackground = '#3B82F6' // Blue
  const badgeText = '#FFFFFF' // White

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
            const iconColor = iconColors[index] || '#6B7280'
            
            return (
              <div key={value.id} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${iconColor}20, ${iconColor}40)`
                  }}
                >
                  <IconComponent 
                    className="h-8 w-8 md:h-10 md:w-10" 
                    style={{ color: iconColor }}
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">{value.title}</h3>
                <div className="mb-3">
                  <span 
                    className="inline-block text-sm font-medium px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: `${iconColor}20`,
                      color: iconColor
                    }}
                  >
                    {value.highlight}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{value.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
