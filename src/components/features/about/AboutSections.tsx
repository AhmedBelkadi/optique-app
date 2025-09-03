'use client';

import { motion, useInView } from 'framer-motion';
import { AboutSection } from '@/features/about/shema/aboutSectionSchema';
import { useRef } from 'react';

interface AboutSectionsProps {
  sections: AboutSection[];
}

export default function AboutSections({ sections }: AboutSectionsProps) {
  if (sections.length === 0) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-muted/50 rounded-lg p-12">
            <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
              Content Coming Soon
            </h2>
            <p className="text-muted-foreground">
              Our about page content is being prepared. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {sections.map((section, index) => (
        <AboutSectionItem 
          key={section.id} 
          section={section} 
          index={index} 
        />
      ))}
    </>
  );
}

interface AboutSectionItemProps {
  section: AboutSection;
  index: number;
}

function AboutSectionItem({ section, index }: AboutSectionItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const isEven = index % 2 === 0;
  const bgColor = index % 2 === 0 ? 'bg-white' : 'bg-muted/30';

  return (
    <section className={`py-20 ${bgColor} transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          ref={ref}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
            isEven ? '' : 'lg:grid-flow-col-dense'
          }`}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Content */}
          <motion.div 
            className={isEven ? 'lg:pr-8' : 'lg:pl-8 lg:col-start-2'}
            initial={{ opacity: 0, x: isEven ? -30 : 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -30 : 30 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {section.title}
            </h2>
            <div 
              className="text-lg text-muted-foreground leading-relaxed prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </motion.div>

          {/* Image */}
          <motion.div 
            className={isEven ? 'lg:pl-8' : 'lg:pr-8 lg:col-start-1'}
            initial={{ opacity: 0, x: isEven ? 30 : -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? 30 : -30 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            {section.image ? (
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            ) : (
              <div className="bg-muted/50 h-80 lg:h-96 rounded-2xl flex items-center justify-center">
                <span className="text-muted-foreground text-lg">Image Placeholder</span>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
