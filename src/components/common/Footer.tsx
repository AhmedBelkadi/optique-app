"use client"

import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, ArrowUp } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

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
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-xl md:text-2xl font-bold text-white">O</span>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">{siteSettings?.siteName || 'Notre Boutique'}</h3>
                  <p className="text-white/80 text-sm">{siteSettings?.slogan || 'Votre vision, notre passion'}</p>
                  {siteSettings?.logoUrl ? (
                    <Image src={siteSettings?.logoUrl || '/logo.png'} alt={siteSettings?.siteName || 'Notre Boutique'} width={100} height={100} />
                  ) : (
                    <span className="text-xl md:text-2xl font-bold text-white">O</span>
                  )}  
                </div>
              </div>
              <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-md">
                {siteSettings?.slogan || 'Votre vision, notre passion. Nous fournissons des soins oculaires exceptionnels et des solutions de lunettes premium avec une technologie de pointe et un service personnalisé.'}
              </p>
              
              {/* Social Media */}
              <div className="flex space-x-3 md:space-x-4 pt-3 md:pt-4">
                {contactSettings?.instagramLink && (
                  <Link
                    href={contactSettings.instagramLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 md:w-10 md:h-10 bg-white/20 hover:bg-secondary/20 hover:border-secondary/30 border border-transparent rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm group"
                  >
                    <Instagram className="w-5 h-5 text-white group-hover:text-secondary transition-colors duration-300" />
                  </Link>
                )}
                {contactSettings?.facebookLink && (
                  <Link 
                    href={contactSettings.facebookLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 md:w-10 md:h-10 bg-white/20 hover:bg-secondary/20 hover:border-secondary/30 border border-transparent rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm group"
                  >
                    <Facebook className="w-5 h-5 text-white group-hover:text-secondary transition-colors duration-300" />
                  </Link>
                )}
                {(!contactSettings?.instagramLink && !contactSettings?.facebookLink) && (
                  <div className="flex space-x-3 md:space-x-4">
                    <div className="w-12 h-12 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-white/50" />
                    </div>
                    <div className="w-12 h-12 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <Facebook className="w-5 h-5 text-white/50" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white border-b-2 border-white/30 pb-3">Nos Services</h4>
              <ul className="space-y-3">
                {services.length > 0 ? (
                  services.map((service) => (
                    <li key={service.id}>
                      <Link 
                        href="/appointment" 
                        className="text-white/80 hover:text-white transition-all duration-300 text-sm flex items-center group py-2 -mx-2 px-2 rounded-md hover:bg-white/10"
                      >
                        <span className="w-2 h-2 bg-white/60 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                        {service.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  // Fallback services if none are configured
                  <>
                    <li>
                      <Link 
                        href="/appointment" 
                        className="text-white/80 hover:text-white transition-all duration-300 text-sm flex items-center group py-2 -mx-2 px-2 rounded-md hover:bg-white/10"
                      >
                        <span className="w-2 h-2 bg-white/60 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                        Prendre Rendez-vous
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/appointment" 
                        className="text-white/80 hover:text-white transition-all duration-300 text-sm flex items-center group py-2 -mx-2 px-2 rounded-md hover:bg-white/10"
                      >
                        <span className="w-2 h-2 bg-white/60 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                        Examens de la Vue
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/products" 
                        className="text-white/80 hover:text-white transition-all duration-300 text-sm flex items-center group py-2 -mx-2 px-2 rounded-md hover:bg-white/10"
                      >
                        <span className="w-2 h-2 bg-white/60 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                        Lunettes et Verres
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/contact" 
                        className="text-white/80 hover:text-white transition-all duration-300 text-sm flex items-center group py-2 -mx-2 px-2 rounded-md hover:bg-white/10"
                      >
                        <span className="w-2 h-2 bg-white/60 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                        Contact et Conseils
                      </Link>
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