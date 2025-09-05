'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  description?: string | null;
}

interface CategoryMultiSelectProps {
  categories: Category[];
  selectedCategoryIds: string[];
  onSelectionChange: (categoryIds: string[]) => void;
  placeholder?: string;
}

export default function CategoryMultiSelect({
  categories,
  selectedCategoryIds,
  onSelectionChange,
  placeholder = "Sélectionner des catégories..."
}: CategoryMultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (categoryId: string) => {
    const newSelection = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter(id => id !== categoryId)
      : [...selectedCategoryIds, categoryId];
    onSelectionChange(newSelection);
  };

  const handleRemove = (categoryId: string) => {
    onSelectionChange(selectedCategoryIds.filter(id => id !== categoryId));
  };

  const selectedCategories = Array.isArray(categories)
    ? categories.filter(cat => selectedCategoryIds.includes(cat.id))
    : [];

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-10 px-3 py-2 text-sm border-border hover:border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
          >
            <span className="truncate text-left">
              {selectedCategories.length === 0
                ? placeholder
                : `${selectedCategories.length} sélectionné${selectedCategories.length !== 1 ? 's' : ''}`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0" 
          align="start"
          sideOffset={4}
        >
          <Command className="w-full">
            <CommandInput 
              placeholder="Rechercher des catégories..." 
              className="h-9 border-0 focus:ring-0"
            />
            <CommandList className="max-h-[200px] overflow-y-auto">
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                Aucune catégorie trouvée.
              </CommandEmpty>
              <CommandGroup>
                {Array.isArray(categories) && categories.map(category => (
                  <CommandItem
                    key={category.id}
                    onSelect={() => handleSelect(category.id)}
                    className="flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-muted/50 data-[selected=true]:bg-muted"
                  >
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        selectedCategoryIds.includes(category.id)
                          ? "opacity-100 text-primary"
                          : "opacity-0"
                      )}
                    />
                    <span className="flex-1 text-sm">{category.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Categories Display */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <Badge
              key={category.id}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              <span className="truncate max-w-[120px]">{category.name}</span>
              <button
                type="button"
                onClick={() => handleRemove(category.id)}
                className="ml-1 rounded-full p-0.5 hover:bg-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
              >
                <X className="h-3 w-3 text-primary hover:text-primary" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
} 