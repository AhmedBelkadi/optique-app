'use client';

import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle, Eye, Glasses, Clock, Shield, CreditCard, Calendar } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FAQ } from '@/features/faqs/schema/faqSchema';
import { FAQPageSettings } from '@/features/cms/schema/faqPageSettingsSchema';
import { FAQThemeCategory } from '@/features/cms/schema/faqPageSettingsSchema';

interface FAQContentProps {
  faqs: FAQ[];
  groupedFAQs: { [key: string]: FAQ[] };
  settings?: FAQPageSettings | null;
  customThemes?: FAQThemeCategory[];
}

// Default theme icons mapping (fallback)
const defaultThemeIcons: { [key: string]: any } = {
  'Eye Care & Exams': Eye,
  'Frames & Glasses': Glasses,
  'Contact Lenses': Glasses,
  'Appointments & Hours': Clock,
  'Insurance & Warranty': CreditCard,
  'General Questions': HelpCircle,
};

// Default theme colors mapping (fallback)
const defaultThemeColors: { [key: string]: string } = {
  'Eye Care & Exams': 'text-blue-600',
  'Frames & Glasses': 'text-emerald-600',
  'Contact Lenses': 'text-purple-600',
  'Appointments & Hours': 'text-orange-600',
  'Insurance & Warranty': 'text-red-600',
  'General Questions': 'text-primary',
};

// Function to get theme icon component
const getThemeIcon = (themeName: string, customThemes?: FAQThemeCategory[]) => {
  if (customThemes) {
    const customTheme = customThemes.find(t => t.name === themeName && t.isActive);
    if (customTheme) {
      // Map string icon names to actual icon components
      const iconMap: { [key: string]: any } = {
        'Eye': Eye,
        'Glasses': Glasses,
        'Clock': Clock,
        'Shield': Shield,
        'CreditCard': CreditCard,
        'HelpCircle': HelpCircle,
        'Calendar': Calendar,
      };
      return iconMap[customTheme.icon] || HelpCircle;
    }
  }
  return defaultThemeIcons[themeName] || HelpCircle;
};

// Function to get theme color
const getThemeColor = (themeName: string, customThemes?: FAQThemeCategory[]) => {
  if (customThemes) {
    const customTheme = customThemes.find(t => t.name === themeName && t.isActive);
    if (customTheme) {
      return customTheme.color;
    }
  }
  return defaultThemeColors[themeName] || 'text-primary';
};

export default function FAQContent({ faqs, groupedFAQs, settings, customThemes }: FAQContentProps) {
  // Use settings or defaults
  const pageSettings = settings || {
    pageTitle: 'Frequently Asked Questions',
    pageSubtitle: 'Find answers to common questions about our services',
    allQuestionsTitle: 'All Questions',
    allQuestionsDescription: 'Browse through all our frequently asked questions',
    showAllQuestionsSection: true,
    browseByTopicTitle: 'Browse by Topic',
    browseByTopicDescription: 'Find answers organized by category',
    showGroupedTopicsSection: true,
    showThemeIcons: true,
    showThemeColors: true,
    showQuestionCounts: true,
  };

  if (!faqs || faqs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <HelpCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No FAQs Available</h3>
        <p className="text-muted-foreground">
          We're working on adding frequently asked questions. Check back soon!
        </p>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {pageSettings.pageTitle}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {pageSettings.pageSubtitle}
        </p>
      </motion.div>

      {/* All FAQs Accordion Section */}
      {pageSettings.showAllQuestionsSection && (
        <motion.div variants={itemVariants}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {pageSettings.allQuestionsTitle}
            </h2>
            <p className="text-lg text-muted-foreground">
              {pageSettings.allQuestionsDescription}
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AccordionItem value={faq.id} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline group">
                    <div className="flex items-center space-x-3">
                      <HelpCircle className="w-5 h-5 text-primary group-data-[state=open]:rotate-12 transition-transform duration-200" />
                      <span className="font-semibold text-lg">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6">
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="text-muted-foreground leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      )}

      {/* Grouped FAQs by Theme Section */}
      {pageSettings.showGroupedTopicsSection && Object.keys(groupedFAQs).length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {pageSettings.browseByTopicTitle}
            </h2>
            <p className="text-lg text-muted-foreground">
              {pageSettings.browseByTopicDescription}
            </p>
          </div>

          <div className="space-y-8">
            {Object.entries(groupedFAQs).map(([theme, themeFAQs], themeIndex) => {
              const IconComponent = getThemeIcon(theme, customThemes);
              const themeColor = getThemeColor(theme, customThemes);

              return (
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: themeIndex * 0.2 }}
                  className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    {pageSettings.showThemeIcons && (
                      <div className="p-2 rounded-lg bg-muted">
                        <IconComponent className={`w-6 h-6 ${themeColor}`} />
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-foreground">{theme}</h3>
                    {pageSettings.showQuestionCounts && (
                      <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {themeFAQs.length} question{themeFAQs.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <Accordion type="single" collapsible className="space-y-3">
                    {themeFAQs.map((faq, index) => (
                      <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <AccordionItem value={faq.id} className="border rounded-lg px-4">
                          <AccordionTrigger className="text-left hover:no-underline group">
                            <span className="font-medium text-foreground group-data-[state=open]:text-primary transition-colors">
                              {faq.question}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="pt-3 pb-4">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              transition={{ duration: 0.3 }}
                              className="text-muted-foreground leading-relaxed"
                            >
                              {faq.answer}
                            </motion.div>
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    ))}
                  </Accordion>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
