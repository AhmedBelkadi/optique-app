'use client';

import { motion } from 'framer-motion';
import { FAQContactCTA as FAQContactCTAType } from '@/features/faqs/schema/faqContactCTASchema';

interface FAQContactCTAProps {
  cta: FAQContactCTAType;
}

export default function FAQContactCTA({ cta }: FAQContactCTAProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-muted/50 py-20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl font-bold text-foreground mb-4"
        >
          {cta.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl text-muted-foreground mb-8"
        >
          {cta.subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a 
            href={cta.contactButtonLink} 
            className="bg-primary text-primary-foreground px-6 py-3 rounded-md text-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {cta.contactButtonText}
          </a>
          <a 
            href={cta.appointmentButtonLink} 
            className="bg-background text-primary px-6 py-3 rounded-md text-lg font-medium border border-primary hover:bg-primary/10 transition-colors"
          >
            {cta.appointmentButtonText}
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
}
