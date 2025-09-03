'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Eye } from 'lucide-react';
import { FAQPageSettings } from '@/features/cms/schema/faqPageSettingsSchema';

interface DynamicFloatingCTAProps {
  settings: FAQPageSettings;
}

export default function DynamicFloatingCTA({ settings }: DynamicFloatingCTAProps) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [0, 1]);
  const y = useTransform(scrollY, [0, 300], [20, 0]);

  // Don't render if sticky CTA is disabled
  if (!settings.showStickyCTA) {
    return null;
  }

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      style={{ opacity, y }}
    >
      <Link href={settings.stickyCTALink}>
        <Button 
          size="lg" 
          className="bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 rounded-full px-6 py-3"
        >
          <Eye className="w-4 h-4 mr-2" />
          {settings.stickyCTAText}
        </Button>
      </Link>
    </motion.div>
  );
}
