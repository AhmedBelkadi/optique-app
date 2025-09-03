'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AboutBenefit } from '@/features/about/shema/aboutBenefitSchema';
import { AboutCTA as AboutCTAType } from '@/features/cms/schema/aboutCTASchema';
import Link from 'next/link';

// Icon mapping for dynamic icons
import { Eye, Shield, Clock, Users, Award, Heart } from 'lucide-react';

const iconMap: Record<string, any> = {
  Eye,
  Shield,
  Clock,
  Users,
  Award,
  Heart,
};

interface AboutCTAProps {
  benefits: AboutBenefit[];
  cta: AboutCTAType;
}

export default function AboutCTA({ benefits, cta }: AboutCTAProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
                     <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
             {cta.title}
           </h2>
           <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
             {cta.subtitle}
           </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                                   <div className={`w-12 h-12 ${benefit.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                   {(() => {
                     const IconComponent = iconMap[benefit.icon as keyof typeof iconMap];
                     return IconComponent ? <IconComponent className={`w-6 h-6 ${benefit.color}`} /> : null;
                   })()}
                 </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  <CardDescription className="text-base">
                    {benefit.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-muted">
                         <h3 className="text-2xl font-bold text-foreground mb-4">
               {cta.ctaTitle}
             </h3>
             <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
               {cta.ctaDescription}
             </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/appointment">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Prendre Rendez-vous
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Parcourir les Produits
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
