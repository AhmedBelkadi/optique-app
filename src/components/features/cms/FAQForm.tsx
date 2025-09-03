'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { faqFormSchema, type FAQFormData } from '@/features/faqs/schema/faqSchema';
import { createFAQAction } from '@/features/faqs/actions/createFAQ';
import { updateFAQAction } from '@/features/faqs/actions/updateFAQ';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { Loader2, Save, Plus, Edit } from 'lucide-react';

interface FAQFormProps {
  faq?: {
    id: string;
    question: string;
    answer: string;
    isActive: boolean;
  };
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
}

export default function FAQForm({ faq, onSuccess, onCancel }: FAQFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!faq;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<FAQFormData>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: faq?.question || '',
      answer: faq?.answer || '',
      isActive: faq?.isActive ?? true,
    },
  });

  const watchedIsActive = watch('isActive');

  const onSubmit = async (data: FAQFormData) => {
    setIsLoading(true);
    try {
      let result;
      
      if (isEditing && faq) {
        result = await updateFAQAction(faq.id, data);
      } else {
        result = await createFAQAction(data);
      }

      if (result.success) {
        toast.success(result.message);
        reset();
        onSuccess?.(result.data);
      } else {
        toast.error(result.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Error submitting FAQ form:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Edit className="h-5 w-5" />
              Edit FAQ
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Add New FAQ
            </>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Question Field */}
          <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <Input
              id="question"
              placeholder="Enter the frequently asked question..."
              {...register('question')}
              className={errors.question ? 'border-destructive' : ''}
            />
            {errors.question && (
              <p className="text-sm text-destructive">{errors.question.message}</p>
            )}
          </div>

          {/* Answer Field */}
          <div className="space-y-2">
            <Label htmlFor="answer">Answer *</Label>
            <Textarea
              id="answer"
              placeholder="Provide a clear and helpful answer..."
              rows={4}
              {...register('answer')}
              className={errors.answer ? 'border-destructive' : ''}
            />
            {errors.answer && (
              <p className="text-sm text-destructive">{errors.answer.message}</p>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={watchedIsActive}
              onCheckedChange={(checked) => {
                // Update the form value
                const event = { target: { name: 'isActive', value: checked } } as any;
                register('isActive').onChange(event);
              }}
            />
            <Label htmlFor="isActive">Active</Label>
            <span className="text-sm text-muted-foreground ml-2">
              {watchedIsActive ? 'This FAQ will be visible to users' : 'This FAQ will be hidden'}
            </span>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={!isValid || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isEditing ? 'Update FAQ' : 'Create FAQ'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
