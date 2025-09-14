"use client"

import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Service {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

interface FooterProps {
  siteSettings?: {
    siteName?: string;
    slogan?: string;
    logoUrl?: string;
  } | null;
  contactSettings?: {
    address?: string;
    phone?: string;
    contactEmail?: string;
    openingHours?: string;
    instagramLink?: string;
    facebookLink?: string;
  } | null;
  services?: Service[];
}

export default function Footer({ siteSettings, contactSettings, services = [] }: FooterProps) {
  return (  
    <footer className="relative">
      {/* Decorative gradient line at top */}
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
      
      {/* Main Footer */}
      <div className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full translate-y-40 -translate-x-40"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Logo and Brand Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Logo Container */}
                <div className="flex-shrink-0">
                  {siteSettings?.logoUrl ? (
                    <div className="relative">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/20 shadow-lg">
                        <Image 
                          src={siteSettings.logoUrl} 
                          alt={siteSettings?.siteName || 'Notre Boutique'} 
                          width={64} 
                          height={64}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      {/* Decorative glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-2xl blur-sm -z-10"></div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
                        <span className="text-2xl md:text-3xl font-bold text-white">A</span>
                      </div>
                      {/* Decorative glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-2xl blur-sm -z-10"></div>
                    </div>
                  )}
                </div>

                {/* Brand Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                    {siteSettings?.siteName || 'Arinass Optique'}
                  </h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="h-0.5 w-8 bg-gradient-to-r from-white/60 to-transparent"></div>
                    <p className="text-white/90 text-sm md:text-base font-medium">
                      {siteSettings?.slogan || 'Votre vision, notre passion'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10">
                <p className="text-white/90 text-sm md:text-base leading-relaxed">
                  {siteSettings?.slogan || 'Votre vision, notre passion. Nous fournissons des soins oculaires exceptionnels et des solutions de lunettes premium avec une technologie de pointe et un service personnalisé.'}
                </p>
              </div>
              
              {/* Social Media */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Suivez-nous</h4>
                <div className="flex space-x-3">
                  {contactSettings?.instagramLink && (
                    <Link
                      href={contactSettings.instagramLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 hover:from-pink-500/30 hover:to-pink-600/20 border border-white/20 hover:border-pink-400/40 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm shadow-lg hover:shadow-pink-500/20">
                        <Instagram className="w-5 h-5 text-white group-hover:text-pink-200 transition-colors duration-300" />
                      </div>
                      {/* Hover glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-transparent rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </Link>
                  )}
                  {contactSettings?.facebookLink && (
                    <Link 
                      href={contactSettings.facebookLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 hover:from-blue-500/30 hover:to-blue-600/20 border border-white/20 hover:border-blue-400/40 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm shadow-lg hover:shadow-blue-500/20">
                        <Facebook className="w-5 h-5 text-white group-hover:text-blue-200 transition-colors duration-300" />
                      </div>
                      {/* Hover glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-transparent rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </Link>
                  )}
                  {(!contactSettings?.instagramLink && !contactSettings?.facebookLink) && (
                    <div className="flex space-x-3">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                        <Instagram className="w-5 h-5 text-white/50" />
                      </div>
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                        <Facebook className="w-5 h-5 text-white/50" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white border-b-2 border-white/30 pb-3">Nos Services</h4>
              <ul className="space-y-3">
                {services.length > 0 ? (
                  services.map((service) => (
                    <li key={service.id}>
                   
                        <span className="w-2 h-2 bg-white/60 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                        {service.name}
                  
                    </li>
                  ))
                ) : (
                  // Fallback services if none are configured
                  <>
                    <li>
                   
                        <span className="w-2 h-2 bg-white/60 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                        Prendre Rendez-vous
                    </li>
                    <li>

                        <span className="w-2 h-2 bg-white/60 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                        Examens de la Vue

                    </li>
                    <li>

                        <span className="w-2 h-2 bg-white/60 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                        Lunettes et Verres
                    </li>
                    <li>
                     
                        <span className="w-2 h-2 bg-white/60 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                        Contact et Conseils

                    </li>
                  </>
                )}
              </ul>
            </div>
            
            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white border-b-2 border-white/30 pb-3">Liens Rapides</h4>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/about" 
                    className="text-white/80 hover:text-white transition-all duration-300 text-sm flex items-center group py-2 -mx-2 px-2 rounded-md hover:bg-white/10"
                  >
                    <span className="w-2 h-2 bg-white/60 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                    À Propos de Nous
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/products" 
                    className="text-white/80 hover:text-white transition-all duration-300 text-sm flex items-center group py-2 -mx-2 px-2 rounded-md hover:bg-white/10"
                  >
                    <span className="w-2 h-2 bg-white/60 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                    Produits
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/faq" 
                    className="text-white/80 hover:text-white transition-all duration-300 text-sm flex items-center group py-2 -mx-2 px-2 rounded-md hover:bg-white/10"
                  >
                    <span className="w-2 h-2 bg-white/60 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/testimonials" 
                    className="text-white/80 hover:text-white transition-all duration-300 text-sm flex items-center group py-2 -mx-2 px-2 rounded-md hover:bg-white/10"
                  >
                    <span className="w-2 h-2 bg-white/60 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                    Témoignages
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="text-white/80 hover:text-white transition-all duration-300 text-sm flex items-center group py-2 -mx-2 px-2 rounded-md hover:bg-white/10"
                  >
                    <span className="w-2 h-2 bg-white/60 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                    Contact
                  </Link>
                
                </li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white border-b-2 border-white/30 pb-3">Informations de Contact</h4>
              <div className="space-y-4">
                {contactSettings?.address && (
                  <div className="flex items-start group">
                    <MapPin className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-white/80 group-hover:text-white transition-colors" />
                    <span className="text-sm text-white/80 group-hover:text-white transition-colors">{contactSettings.address}</span>
                  </div>
                )}
                {contactSettings?.phone && (
                  <div className="flex items-center group">
                    <Phone className="w-5 h-5 mr-3 flex-shrink-0 text-white/80 group-hover:text-white transition-colors" />
                    <span className="text-sm text-white/80 group-hover:text-white transition-colors">{contactSettings.phone}</span>
                  </div>
                )}
                {contactSettings?.contactEmail && (
                  <div className="flex items-center group">
                    <Mail className="w-5 h-5 mr-3 flex-shrink-0 text-white/80 group-hover:text-white transition-colors" />
                    <span className="text-sm text-white/80 group-hover:text-white transition-colors">{contactSettings.contactEmail}</span>
                  </div>
                )}
                
                {/* Business Hours */}
                {contactSettings?.openingHours && (
                  <div className="flex items-center pt-2 group">
                    <Clock className="w-5 h-5 mr-3 flex-shrink-0 text-white/80 group-hover:text-white transition-colors" />
                    <div className="text-sm text-white/80 group-hover:text-white transition-colors">
                      <div>
                        {contactSettings.openingHours}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          
  
          {/* Separator */}
          <div className="border-t-2 border-white/20 mt-8 md:mt-12 pt-6 md:pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="text-center md:text-left">
                <p className="text-white/80 text-sm">
                  &copy; 2025 {siteSettings?.siteName || 'Notre Boutique'}. Tous droits réservés.
                </p>
              </div>
              
              {/* Back to Top Button */}
              <div className="flex items-center">
                <Button
                  size="sm"
                  className="bg-yellow-500 hover:bg-yellow-600 border-white/30 text-black transition-all duration-300 h-10 px-4"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <ArrowUp className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Retour en haut</span>
                  <span className="sm:hidden">Haut</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}