'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface QuickFilterChipsProps {
  categories: Array<{ id: string; name: string }>;
  currentCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function QuickFilterChips({
  categories,
  currentCategory,
  onCategoryChange,
  onClearFilters,
  hasActiveFilters
}: QuickFilterChipsProps) {
  return (
    <div className="md:hidden space-y-3">
      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        <Button
          variant={currentCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange('all')}
          className="flex-shrink-0 h-8 px-3 text-sm"
        >
          Tous
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={currentCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className="flex-shrink-0 h-8 px-3 text-sm"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtres actifs:</span>
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {currentCategory && currentCategory !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                {categories.find(c => c.id === currentCategory)?.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => onCategoryChange('all')}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Effacer tout
          </Button>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
