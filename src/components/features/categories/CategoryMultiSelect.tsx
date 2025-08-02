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
  placeholder = "Select categories..."
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

  const selectedCategories = categories.filter(cat => selectedCategoryIds.includes(cat.id));

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedCategories.length === 0
                ? placeholder
                : `${selectedCategories.length} selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    onSelect={() => handleSelect(category.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCategoryIds.includes(category.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Categories Display */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedCategories.map((category) => (
            <Badge
              key={category.id}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {category.name}
              <button
                type="button"
                onClick={() => handleRemove(category.id)}
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
} 