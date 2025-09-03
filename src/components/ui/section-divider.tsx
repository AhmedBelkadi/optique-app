import { cn } from "@/lib/utils";

interface SectionDividerProps {
  variant?: 'gradient' | 'dots' | 'line' | 'wave';
  className?: string;
  color?: 'primary' | 'secondary' | 'both';
}

export function SectionDivider({ 
  variant = 'gradient', 
  className = '',
  color = 'both'
}: SectionDividerProps) {
  const baseClasses = "w-full h-px relative";
  
  const variants = {
    gradient: {
      primary: "bg-gradient-to-r from-transparent via-primary to-transparent",
      secondary: "bg-gradient-to-r from-transparent via-secondary to-transparent", 
      both: "bg-gradient-to-r from-transparent via-primary via-secondary to-transparent"
    },
    dots: {
      primary: "bg-primary/20",
      secondary: "bg-secondary/20",
      both: "bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20"
    },
    line: {
      primary: "bg-primary/30",
      secondary: "bg-secondary/30", 
      both: "bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30"
    },
    wave: {
      primary: "bg-primary/20",
      secondary: "bg-secondary/20",
      both: "bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20"
    }
  };

  if (variant === 'dots') {
    return (
      <div className={cn("flex justify-center items-center py-8", className)}>
        <div className="flex space-x-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full",
                variants.dots[color],
                "animate-pulse"
              )}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'wave') {
    return (
      <div className={cn("relative py-8", className)}>
        <svg
          className="w-full h-8"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className={cn(
              "fill-current",
              color === 'primary' ? 'text-primary/20' : 
              color === 'secondary' ? 'text-secondary/20' : 
              'text-primary/10'
            )}
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className={cn(
              "fill-current",
              color === 'primary' ? 'text-primary/30' : 
              color === 'secondary' ? 'text-secondary/30' : 
              'text-secondary/15'
            )}
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className={cn(
              "fill-current",
              color === 'primary' ? 'text-primary/40' : 
              color === 'secondary' ? 'text-secondary/40' : 
              'text-primary/20'
            )}
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn("flex justify-center items-center py-8", className)}>
      <div className={cn(baseClasses, variants[variant][color])} />
    </div>
  );
}
