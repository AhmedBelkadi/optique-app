import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface CTAButton {
  label: string;
  href: string;
  icon?: ReactNode;
  variant?: 'default' | 'outline' | 'secondary';
}

interface CTASectionProps {
  variant?: 'primary' | 'secondary' | 'accent';
  title: string;
  description: string;
  primaryAction: CTAButton;
  secondaryAction?: CTAButton;
  className?: string;

}

export function CTASection({ 
  variant = 'primary', 
  title, 
  description, 
  primaryAction, 
  secondaryAction, 
  className = ''
}: CTASectionProps) {
  const variants = {
    primary: {
      card: 'text-white border-0 relative overflow-hidden',
      primaryButton: 'shadow-lg hover:shadow-xl transition-all duration-300',
      secondaryButton: 'shadow-lg hover:shadow-xl transition-all duration-300 bg-secondary/10 hover:bg-secondary/20 text-secondary border-secondary/20 hover:border-secondary/30'
    },
    secondary: {
      card: 'bg-gradient-to-br from-background via-secondary/5 to-background border-secondary/20 relative overflow-hidden',
      primaryButton: 'shadow-lg hover:shadow-xl transition-all duration-300',
      secondaryButton: 'shadow-lg hover:shadow-xl transition-all duration-300 bg-secondary/10 hover:bg-secondary/20 text-secondary border-secondary/20 hover:border-secondary/30'
    },
    accent: {
      card: 'text-white border-0 relative overflow-hidden',
      primaryButton: 'shadow-lg hover:shadow-xl transition-all duration-300',
      secondaryButton: 'shadow-lg hover:shadow-xl transition-all duration-300 bg-secondary/10 hover:bg-secondary/20 text-secondary border-secondary/20 hover:border-secondary/30'
    }
  };

  const currentVariant = variants[variant];



  return (
    <section className={`py-16 lg:py-20 ${className} relative overflow-hidden`}>
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/5 rounded-full translate-x-40 translate-y-40"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <Card 
          className={`${currentVariant.card} p-12`}
          style={{
            background: variant === 'secondary' 
              ? undefined 
              : 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary) / 0.9))'
          }}
        >
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50"></div>
          
          <CardContent className="p-0 relative">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {title}
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                className={`font-semibold px-8 py-3 ${currentVariant.primaryButton}`}
                style={{
                  backgroundColor: variant === 'secondary' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                  color: variant === 'secondary' ? '#FFFFFF' : '#FFFFFF'
                }}
              >
                <Link href={primaryAction.href}>
                  {primaryAction.icon && <span className="mr-2">{primaryAction.icon}</span>}
                  {primaryAction.label}
                </Link>
              </Button>
              
              {secondaryAction && (
                <Button 
                  asChild
                  size="lg" 
                  variant={secondaryAction.variant || 'outline'}
                  className={`font-semibold px-8 py-3 ${currentVariant.secondaryButton}`}
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: 'hsl(var(--primary))',
                    borderColor: 'hsl(var(--primary))'
                  }}
                >
                  <Link href={secondaryAction.href}>
                    {secondaryAction.icon && <span className="mr-2">{secondaryAction.icon}</span>}
                    {secondaryAction.label}
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
