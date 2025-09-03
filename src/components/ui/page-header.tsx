import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className = '' }: PageHeaderProps) {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
        {title}
      </h1>
      {description && (
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
