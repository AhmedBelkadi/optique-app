'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronUp,
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Eye, 
  Shield, 
  Users, 
  Heart, 
  Star, 
  CheckCircle, 
  Zap, 
  Target,
  Award,
  TrendingUp,
  Calendar,
  Building,
  MessageCircle
} from 'lucide-react';
import Image from 'next/image';

interface AboutSection {
  id: string;
  content: string;
}

interface AboutBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlight: string;
}

interface ContactSettings {
  address?: string;
  phone?: string;
  contactEmail?: string;
  openingHours?: string;
  googleMapEmbed?: string;
}

interface MobileAboutContentProps {
  aboutSections: AboutSection[];
  benefits: AboutBenefit[];
  contactSettings: ContactSettings | null;
  themeSettings?: { primaryColor?: string } | null;
}

export function MobileAboutContent({ 
  aboutSections, 
  benefits, 
  contactSettings, 
  themeSettings 
}: MobileAboutContentProps) {
  const [expandedSections, setExpandedSections] = useState({
    story: false,
    values: false,
    contact: false
  });

  const [expandedValues, setExpandedValues] = useState<Set<number>>(new Set());

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleValue = (index: number) => {
    setExpandedValues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Dynamic icon mapping for CMS benefits
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'Eye': Eye,
      'Shield': Shield,
      'Clock': Clock,
      'Users': Users,
      'Award': Award,
      'Heart': Heart,
      'Star': Star,
      'CheckCircle': CheckCircle,
      'Zap': Zap,
      'Target': Target,
      'MapPin': MapPin,
      'TrendingUp': TrendingUp
    };
    return iconMap[iconName] || Award;
  };

  // Use CMS benefits or fallback to defaults
  const features = benefits.length > 0 ? benefits.map(benefit => ({
    icon: getIconComponent(benefit.icon),
    title: benefit.title || 'Valeur',
    description: benefit.description || '',
    highlight: benefit.highlight || 'Valeur ajoutée'
  })) : [
    {
      icon: getIconComponent('Award'),
      title: "Qualité Premium",
      description: "Nous sélectionnons rigoureusement nos produits parmi les meilleures marques internationales. Chaque monture et chaque verre répond aux plus hauts standards de qualité pour garantir votre satisfaction et votre confort visuel.",
      highlight: "Plus de 500 références de qualité",
    },
    {
      icon: getIconComponent('MapPin'),
      title: "Expertise Locale",
      description: "Implantés au cœur de notre ville depuis plus de 15 ans, nous connaissons parfaitement les besoins de notre clientèle. Notre équipe d'opticiens diplômés vous accompagne avec passion et professionnalisme dans tous vos projets optiques.",
      highlight: "15 ans d'expérience dans notre région",
    },
    {
      icon: getIconComponent('TrendingUp'),
      title: "Tendances & Innovation",
      description: "Nous restons à l'affût des dernières tendances et innovations technologiques. Des montures design aux verres progressifs dernière génération, nous vous proposons toujours ce qui se fait de mieux en optique.",
      highlight: "Toujours à la pointe de l'innovation",
    },
  ];

  // Define varied colors for different features
  const featureColors = [
    '#3B82F6', // Blue for quality
    '#10B981', // Green for expertise  
    '#8B5CF6', // Purple for innovation
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Story Section */}
      <Card className="overflow-hidden">
        <button
          onClick={() => toggleSection('story')}
          className="w-full p-4 md:p-6 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Building className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-foreground">Notre Histoire</h2>
              <p className="text-sm text-muted-foreground">Découvrez notre parcours</p>
            </div>
          </div>
          {expandedSections.story ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
        
        {expandedSections.story && (
          <CardContent className="pt-0 pb-4 md:pb-6">
            <div className="space-y-4">
              <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
                <div className="space-y-4">
                  <div className="space-y-3 text-muted-foreground leading-relaxed text-sm md:text-base">
                    {aboutSections.length > 0 ? (
                      aboutSections.map((section, index) => (
                        <p key={section.id}>
                          {section.content}
                        </p>
                      ))
                    ) : (
                      <>
                        <p>
                          Fondée avec passion, notre boutique d'optique est née d'une vision commune : offrir à
                          chaque client une vision parfaite et un style unique. Ce qui a commencé comme un petit magasin familial
                          dans le centre de notre ville s'est transformé en une référence incontournable de l'optique dans la région.
                        </p>
                        <p>
                          Aujourd'hui, nous sommes fiers de servir de nombreux clients satisfaits, des familles locales aux
                          visiteurs internationaux. Notre secret ? Un service personnalisé, des produits de qualité et une équipe
                          passionnée qui considère chaque client comme un membre de la famille.
                        </p>
                        <p className="font-medium text-warning">
                          "Chez nous, chaque regard compte" - c'est plus qu'un slogan, c'est notre engagement
                          quotidien.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Façade de notre magasin"
                      width={400}
                      height={300}
                      className="w-full h-48 md:h-64 object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1">
                      <p className="text-xs md:text-sm font-medium text-foreground">Notre magasin dans notre ville</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Values Section */}
      <Card className="overflow-hidden">
        <button
          onClick={() => toggleSection('values')}
          className="w-full p-4 md:p-6 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-foreground">Nos Valeurs</h2>
              <p className="text-sm text-muted-foreground">Ce qui nous distingue</p>
            </div>
          </div>
          {expandedSections.values ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
        
        {expandedSections.values && (
          <CardContent className="pt-0 pb-4 md:pb-6">
            <div className="space-y-4">
              {features.map((feature, index) => {
                const iconColor = featureColors[index] || '#6B7280';
                const isExpanded = expandedValues.has(index);
                
                return (
                  <Card key={index} className="hover:shadow-md transition-all duration-200">
                    <button
                      onClick={() => toggleValue(index)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div 
                          className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${iconColor}20, ${iconColor}40)`
                          }}
                        >
                          <feature.icon 
                            className="h-5 w-5 md:h-6 md:w-6" 
                            style={{ color: iconColor }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base md:text-lg font-bold text-foreground mb-1">{feature.title}</h3>
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                            style={{
                              backgroundColor: `${iconColor}20`,
                              color: iconColor
                            }}
                          >
                            {feature.highlight}
                          </Badge>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <CardContent className="pt-0 pb-4">
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                          {feature.description}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Contact Section */}
      <Card className="overflow-hidden">
        <button
          onClick={() => toggleSection('contact')}
          className="w-full p-4 md:p-6 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-foreground">Nous Rencontrer</h2>
              <p className="text-sm text-muted-foreground">Venez nous rendre visite</p>
            </div>
          </div>
          {expandedSections.contact ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
        
        {expandedSections.contact && (
          <CardContent className="pt-0 pb-4 md:pb-6">
            <div className="space-y-6">
              {/* Map */}
              <div className="h-48 md:h-64 bg-muted/30 rounded-lg overflow-hidden">
                {contactSettings?.googleMapEmbed ? (
                  <iframe
                    src={contactSettings.googleMapEmbed}
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Notre localisation"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                      <MapPin className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h4 className="text-sm md:text-base font-semibold text-foreground mb-2">Localisation</h4>
                    <p className="text-xs md:text-sm text-muted-foreground mb-3 max-w-xs">
                      Notre boutique est située au cœur de notre ville, facilement accessible
                    </p>
                    <div className="space-y-1 text-xs md:text-sm text-muted-foreground">
                      <p>📍 Centre-ville de notre ville</p>
                      <p>🚗 Parking disponible</p>
                      <p>🚌 Accessible en transport</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                {contactSettings?.address && (
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#3B82F620' }}
                    >
                      <MapPin className="h-4 w-4 md:h-5 md:w-5" style={{ color: '#3B82F6' }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-foreground text-sm md:text-base mb-1">Adresse</h4>
                      <p className="text-muted-foreground text-xs md:text-sm whitespace-pre-line">
                        {contactSettings.address}
                      </p>
                    </div>
                  </div>
                )}

                {contactSettings?.phone && (
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#10B98120' }}
                    >
                      <Phone className="h-4 w-4 md:h-5 md:w-5" style={{ color: '#10B981' }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-foreground text-sm md:text-base mb-1">Téléphone</h4>
                      <p className="text-muted-foreground text-xs md:text-sm">{contactSettings.phone}</p>
                    </div>
                  </div>
                )}

                {contactSettings?.contactEmail && (
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#8B5CF620' }}
                    >
                      <Mail className="h-4 w-4 md:h-5 md:w-5" style={{ color: '#8B5CF6' }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-foreground text-sm md:text-base mb-1">Email</h4>
                      <p className="text-muted-foreground text-xs md:text-sm break-all">{contactSettings.contactEmail}</p>
                    </div>
                  </div>
                )}

                {contactSettings?.openingHours && (
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#F59E0B20' }}
                    >
                      <Clock className="h-4 w-4 md:h-5 md:w-5" style={{ color: '#F59E0B' }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-foreground text-sm md:text-base mb-1">Horaires</h4>
                      <div className="text-muted-foreground text-xs md:text-sm whitespace-pre-line">
                        {contactSettings.openingHours}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {contactSettings?.phone && (
                  <Button 
                    className="w-full bg-green-500 hover:bg-green-600 font-semibold py-3 h-12 text-sm md:text-base"
                    asChild
                  >
                    <a href={`tel:${contactSettings.phone}`}>
                      <Phone className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      Nous Appeler
                    </a>
                  </Button>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline"
                    className="h-10 text-xs md:text-sm"
                    asChild
                  >
                    <a href="/appointment">
                      <Calendar className="mr-2 h-4 w-4" />
                      RDV
                    </a>
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-10 text-xs md:text-sm"
                    asChild
                  >
                    <a href="/contact">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
