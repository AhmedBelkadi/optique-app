'use client';

import { motion } from 'framer-motion';
import { FAQHero } from '@/features/faqs/schema/faqHeroSchema';

interface FAQHeroProps {
  hero: FAQHero;
}

export default function FAQHero({ hero }: FAQHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl font-bold mb-6"
        >
          {hero.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl max-w-3xl mx-auto"
        >
          {hero.subtitle}
        </motion.p>
      </div>
    </motion.section>
  );
}
