'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronDown, 
  ChevronUp,
  Search,
  X,
  Glasses,
  Filter,
  HelpCircle
} from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  isActive?: boolean;
}

interface MobileFAQAccordionProps {
  faqs: FAQ[];
  categories?: Array<{ name: string; icon: string; count: number }>;
}

export function MobileFAQAccordion({ faqs, categories = [] }: MobileFAQAccordionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showSearch, setShowSearch] = useState(false);

  // Icon mapping function
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      glasses: Glasses,
      help: HelpCircle,
    };
    return iconMap[iconName] || HelpCircle;
  };

  // Filter FAQs based on search and category
  const filteredFAQs = useMemo(() => {
    let filtered = faqs;

    // Filter by category
    if (selectedCategory !== 'Tous') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [faqs, selectedCategory, searchQuery]);

  const toggleExpanded = (faqId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(faqId)) {
        newSet.delete(faqId);
      } else {
        newSet.add(faqId);
      }
      return newSet;
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearch(false);
  };

  const hasActiveFilters = searchQuery.trim() || selectedCategory !== 'Tous';

  return (
    <div className="space-y-6">
      {/* Mobile Search and Filter Header */}
      <div className="md:hidden space-y-4">
        {/* Search Toggle */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Questions Fréquentes</h2>
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="h-10 w-10 p-0"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher dans les FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-11 text-base"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}

        {/* Category Filter Chips */}
        {categories.length > 1 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Catégories</span>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
                  className="flex-shrink-0 h-9 px-4 text-sm"
                >
                  {React.createElement(getIconComponent(category.icon), { className: "h-3 w-3 mr-2" })}
                  {category.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Filtres actifs:</span>
            <div className="flex gap-1 flex-wrap">
              {searchQuery && (
                <Badge variant="secondary" className="text-xs">
                  Recherche: {searchQuery}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="h-auto p-0 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}
              {selectedCategory !== 'Tous' && (
                <Badge variant="secondary" className="text-xs">
                  {selectedCategory}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory('Tous')}
                    className="h-auto p-0 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Tous');
                setShowSearch(false);
              }}
              className="ml-auto text-xs"
            >
              Effacer tout
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''} trouvée{filteredFAQs.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3 md:space-y-4">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq) => {
            const isExpanded = expandedItems.has(faq.id);
            
            return (
              <Card key={faq.id} className="overflow-hidden group hover:shadow-md transition-all duration-200">
                <button
                  onClick={() => toggleExpanded(faq.id)}
                  className="w-full px-4 py-4 md:px-6 md:py-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-inset"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground text-sm md:text-base leading-relaxed">
                      {faq.question}
                    </span>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                    )}
                  </div>
                </button>
                
                {isExpanded && (
                  <CardContent className="px-4 pb-4 pt-0 md:px-6 md:pb-4 md:pt-0">
                    <div className="pl-11 md:pl-13">
                      <div className="text-muted-foreground leading-relaxed text-sm md:text-base">
                        {faq.answer}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-muted-foreground/60 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Aucune question trouvée</h3>
            <p className="text-muted-foreground mb-4">
              {hasActiveFilters 
                ? 'Essayez de modifier vos critères de recherche.'
                : 'Aucune question fréquente disponible pour le moment.'
              }
            </p>
            {hasActiveFilters && (
              <Button
                variant="default"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Tous');
                  setShowSearch(false);
                }}
              >
                Effacer les filtres
              </Button>
            )}
          </div>
        )}
      </div>

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
