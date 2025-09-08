"use client"

import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ContactSettings {
  address?: string
  phone?: string
  contactEmail?: string
  openingHours?: string
  googleMapEmbed?: string
}

interface DynamicContactSectionProps {
  contactSettings: ContactSettings | null
}

export default function DynamicContactSection({ contactSettings }: DynamicContactSectionProps) {
  if (!contactSettings) return null

  // Use standard colors
  const badgeBackground = '#FF6B6B' // Coral
  const badgeText = '#FFFFFF' // White

  // Define varied colors for different contact icons
  const iconColors = {
    address: '#3B82F6',      // Blue for location
    phone: '#10B981',        // Green for phone
    email: '#8B5CF6',        // Purple for email
    clock: '#F59E0B',        // Amber for time
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div 
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{
              backgroundColor: badgeBackground,
              color: badgeText
            }}
          >
            <Navigation className="w-4 h-4 mr-2" />
            Notre Localisation
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Venez Nous Rendre Visite
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Notre équipe vous accueille dans un cadre moderne et professionnel pour tous vos besoins optiques
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-background rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Informations de Contact
              </h3>
              
              <div className="space-y-6">
                {contactSettings.address && (
                  <div className="flex items-start space-x-4">
                    <div 
                      className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: `${iconColors.address}20`
                      }}
                    >
                      <MapPin 
                        className="w-6 h-6" 
                        style={{ color: iconColors.address }}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Adresse</h4>
                      <p className="text-muted-foreground">{contactSettings.address}</p>
                    </div>
                  </div>
                )}

                {contactSettings.phone && (
                  <div className="flex items-start space-x-4">
                    <div 
                      className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: `${iconColors.phone}20`
                      }}
                    >
                      <Phone 
                        className="w-6 h-6" 
                        style={{ color: iconColors.phone }}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Téléphone</h4>
                      <p className="text-muted-foreground">{contactSettings.phone}</p>
                    </div>
                  </div>
                )}

                {contactSettings.contactEmail && (
                  <div className="flex items-start space-x-4">
                    <div 
                      className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: `${iconColors.email}20`
                      }}
                    >
                      <Mail 
                        className="w-6 h-6" 
                        style={{ color: iconColors.email }}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Email</h4>
                      <p className="text-muted-foreground">{contactSettings.contactEmail}</p>
                    </div>
                  </div>
                )}

                {contactSettings.openingHours && (
                  <div className="flex items-start space-x-4">
                    <div 
                      className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: `${iconColors.clock}20`
                      }}
                    >
                      <Clock 
                        className="w-6 h-6" 
                        style={{ color: iconColors.clock }}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Horaires d'Ouverture</h4>
                      <p className="text-muted-foreground">{contactSettings.openingHours}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Link href="/appointment">
                <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-primary-foreground py-3 transition-all duration-300 hover:scale-105">
                  <Phone className="w-5 h-5 mr-2" />
                  Prendre Rendez-vous
                </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-background rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Notre Localisation
            </h3>
            
            {contactSettings.googleMapEmbed ? (
              <div className="aspect-video rounded-xl overflow-hidden">
                <iframe
                  src={contactSettings.googleMapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localisation Optique"
                />
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-16 h-16 mx-auto mb-4" />
                  <p>Carte non disponible</p>
                  <p className="text-sm">Configurez l'intégration Google Maps dans les paramètres</p>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Utilisez Google Maps pour obtenir des directions précises vers notre établissement
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
