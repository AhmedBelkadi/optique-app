'use client';

import { motion } from 'framer-motion';
import { AboutHero as AboutHeroType } from '@/features/cms/schema/aboutHeroSchema';

interface AboutHeroProps {
  hero: AboutHeroType;
}

export default function AboutHero({ hero }: AboutHeroProps) {
  return (
    <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {hero.title}
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {hero.subtitle}
        </motion.p>
      </div>
    </section>
  );
}
