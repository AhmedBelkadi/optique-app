'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AdminFormWrapperProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  children: ReactNode;
  onSubmit?: () => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  isPending?: boolean;
  showBackButton?: boolean;
  className?: string;
}

export default function AdminFormWrapper({
  title,
  subtitle,
  icon,
  children,
  onSubmit,
  onCancel,
  submitText = "Save",
  cancelText = "Cancel",
  isPending = false,
  showBackButton = true,
  className = "",
}: AdminFormWrapperProps) {
  const router = useRouter();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <Button 
              variant="ghost" 
              onClick={handleCancel}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div>
                    <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        )}
          </div>
        </div>
      </div>

      {/* Form Card */}
             <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
                         <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              {icon}
            </div>
            <span>Form Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {children}
          
          {/* Action Buttons */}
          {(onSubmit || onCancel) && (
                         <div className="flex justify-end space-x-3 pt-6 border-t border-border">
               <Button 
                 type="button" 
                 variant="outline" 
                 onClick={handleCancel}
                 disabled={isPending}
                 className="bg-background/50 backdrop-blur-sm border-border hover:bg-muted"
               >
                 {cancelText}
               </Button>
              {onSubmit && (
                                 <Button 
                   type="submit" 
                   onClick={onSubmit}
                   disabled={isPending}
                   className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                 >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    submitText
                  )}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 