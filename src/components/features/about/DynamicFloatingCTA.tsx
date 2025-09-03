'use client';

import { Button } from '@/components/ui/button';
import { AboutFloatingCTA } from '@/features/cms/schema/aboutFloatingCTASchema';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  MessageCircle, 
  Phone, 
  Mail, 
  ShoppingCart,
  Heart,
  Star,
  Zap
} from 'lucide-react';

interface DynamicAboutFloatingCTAProps {
  floatingCTA: AboutFloatingCTA | null;
}

export default function DynamicAboutFloatingCTA({ floatingCTA }: DynamicAboutFloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -20]);

  useEffect(() => {
    if (!floatingCTA?.showOnScroll) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > (floatingCTA?.scrollThreshold || 300)) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [floatingCTA?.showOnScroll, floatingCTA?.scrollThreshold]);

  if (!floatingCTA || !floatingCTA.isActive) {
    return null;
  }

  const getPositionClasses = () => {
    switch (floatingCTA.position) {
      case 'top-left': return 'top-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'center-left': return 'top-1/2 left-4 transform -translate-y-1/2';
      case 'center-right': return 'top-1/2 right-4 transform -translate-y-1/2';
      default: return 'bottom-4 right-4';
    }
  };

  const getButtonSizeClasses = () => {
    switch (floatingCTA.buttonSize) {
      case 'sm': return 'w-12 h-12';
      case 'md': return 'w-14 h-14';
      case 'lg': return 'w-16 h-16';
      case 'xl': return 'w-20 h-20';
      default: return 'w-16 h-16';
    }
  };

  const getIconComponent = () => {
    switch (floatingCTA.buttonIcon) {
      case 'message': return MessageCircle;
      case 'phone': return Phone;
      case 'mail': return Mail;
      case 'cart': return ShoppingCart;
      case 'heart': return Heart;
      case 'star': return Star;
      case 'zap': return Zap;
      case 'arrow': return ArrowRight;
      default: return MessageCircle;
    }
  };

  const getCustomStyles = () => {
    if (!floatingCTA.customColors) return {};
    
    try {
      const colors = typeof floatingCTA.customColors === 'string' 
        ? JSON.parse(floatingCTA.customColors) 
        : floatingCTA.customColors;
      
      return {
        backgroundColor: colors.backgroundColor || undefined,
        color: colors.textColor || undefined,
        '--hover-bg': colors.hoverBackgroundColor || undefined,
        '--hover-text': colors.hoverTextColor || undefined,
      };
    } catch {
      return {};
    }
  };

  const IconComponent = getIconComponent();

  return (
    <motion.div
      className={`fixed ${getPositionClasses()} z-50`}
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 50 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.5 
      }}
      style={{ y }}
    >
      {/* Main Button */}
      <motion.div
        className={`relative ${getButtonSizeClasses()} rounded-full shadow-2xl overflow-hidden group cursor-pointer`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        style={getCustomStyles()}
      >
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80 group-hover:from-primary/90 group-hover:via-primary group-hover:to-primary/90 transition-all duration-300" />
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-foreground/20 via-transparent to-primary-foreground/20 transform -skew-x-12 group-hover:animate-pulse" />
        </div>

        {/* Button content */}
        <Button
          variant={floatingCTA.buttonVariant as any || 'default'}
          size={floatingCTA.buttonSize as any || 'lg'}
          className="relative w-full h-full rounded-full border-0 bg-transparent hover:bg-transparent p-0 group"
          asChild
        >
          <a href={floatingCTA.buttonLink} className="flex items-center justify-center w-full h-full">
            <IconComponent className="w-6 h-6 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
          </a>
        </Button>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/40 to-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.div>

      {/* Tooltip */}
      <motion.div
        className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-border"
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        style={{
          transform: floatingCTA.position.includes('left') ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {floatingCTA.buttonText}
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover" />
      </motion.div>

      {/* Floating particles effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-2 left-2 w-1 h-1 bg-primary-foreground/60 rounded-full animate-ping" />
        <div className="absolute bottom-2 right-2 w-1 h-1 bg-primary-foreground/40 rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-primary-foreground/80 rounded-full animate-bounce" />
      </motion.div>
    </motion.div>
  );
}
