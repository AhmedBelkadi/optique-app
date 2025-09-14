'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Star, 
  Quote, 
  Users, 
  Search,
  Filter,
  Share2,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  message: string;
  rating: number;
  image?: string | null;
  title?: string | null;
  isVerified?: boolean;
  source: string;
  createdAt: string;
}

interface MobileTestimonialsGridProps {
  testimonials: Testimonial[];
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
  };
  searchParams?: {
    search?: string;
    page?: string;
  };
}

export function MobileTestimonialsGrid({ 
  testimonials, 
  pagination,
  searchParams 
}: MobileTestimonialsGridProps) {
  const [searchQuery, setSearchQuery] = useState(searchParams?.search || '');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedTestimonials, setExpandedTestimonials] = useState<Set<string>>(new Set());

  // Filter testimonials based on search and rating
  const filteredTestimonials = useMemo(() => {
    let filtered = testimonials;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(testimonial => 
        testimonial.name.toLowerCase().includes(query) ||
        testimonial.message.toLowerCase().includes(query) ||
        (testimonial.title && testimonial.title.toLowerCase().includes(query))
      );
    }

    // Filter by rating
    if (ratingFilter !== 'all') {
      const minRating = parseInt(ratingFilter);
      filtered = filtered.filter(testimonial => testimonial.rating >= minRating);
    }

    return filtered;
  }, [testimonials, searchQuery, ratingFilter]);

  const toggleExpanded = (testimonialId: string) => {
    setExpandedTestimonials(prev => {
      const newSet = new Set(prev);
      if (newSet.has(testimonialId)) {
        newSet.delete(testimonialId);
      } else {
        newSet.add(testimonialId);
      }
      return newSet;
    });
  };

  const shareTestimonial = async (testimonial: Testimonial) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Témoignage de ${testimonial.name}`,
          text: testimonial.message,
          url: window.location.href
        });
      } catch (error) {
      }
    } else {
      // Fallback: copy to clipboard
      const text = `"${testimonial.message}" - ${testimonial.name}`;
      navigator.clipboard.writeText(text);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRatingFilter('all');
    setShowFilters(false);
  };

  const hasActiveFilters = searchQuery.trim() || ratingFilter !== 'all';

  // Calculate average rating
  const averageRating = filteredTestimonials.length > 0 
    ? filteredTestimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / filteredTestimonials.length 
    : 5;

  return (
    <div className="space-y-6">
      {/* Mobile Search and Filter Header */}
      <div className="md:hidden space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher dans les témoignages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-11 text-base"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant="default"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 h-10"
          >
            <Filter className="h-4 w-4" />
            Filtres
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                {[searchQuery, ratingFilter !== 'all' ? ratingFilter : null].filter(Boolean).length}
              </Badge>
            )}
            {showFilters ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            {filteredTestimonials.length} témoignage{filteredTestimonials.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Note minimale
              </label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les notes</SelectItem>
                  <SelectItem value="5">5 étoiles</SelectItem>
                  <SelectItem value="4">4 étoiles et plus</SelectItem>
                  <SelectItem value="3">3 étoiles et plus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="default"
                onClick={clearFilters}
                className="w-full h-10"
              >
                Effacer les filtres
              </Button>
            )}
          </div>
        )}

        {/* Rating Summary */}
        {filteredTestimonials.length > 0 && (
          <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(averageRating) ? "text-warning fill-current" : "text-muted"}`}
                />
              ))}
            </div>
            <span className="text-xl font-bold text-foreground">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground text-sm">({filteredTestimonials.length} avis)</span>
          </div>
        )}
      </div>

      {/* Desktop Search and Filters */}
      <div className="hidden md:block space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher dans les témoignages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par note" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les notes</SelectItem>
                <SelectItem value="5">5 étoiles</SelectItem>
                <SelectItem value="4">4 étoiles et plus</SelectItem>
                <SelectItem value="3">3 étoiles et plus</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {hasActiveFilters && (
            <Button variant="default" onClick={clearFilters}>
              Effacer les filtres
            </Button>
          )}
        </div>
      </div>

      {/* Testimonials Grid */}
      {filteredTestimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {filteredTestimonials.map((testimonial) => {
            const isExpanded = expandedTestimonials.has(testimonial.id);
            const isLongMessage = testimonial.message.length > 150;
            
            return (
              <Card key={testimonial.id} className="hover:shadow-md transition-all duration-200 group">
                <CardContent className="p-4 md:p-6">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <Quote className="h-6 w-6 md:h-8 md:w-8 text-warning" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < (testimonial.rating || 5) ? "text-warning fill-current" : "text-muted"}`}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <blockquote className="text-muted-foreground leading-relaxed mb-6 text-sm md:text-base">
                    {isLongMessage && !isExpanded ? (
                      <>
                        "{testimonial.message.substring(0, 150)}..."
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => toggleExpanded(testimonial.id)}
                          className="p-0 h-auto text-primary ml-1"
                        >
                          Lire plus
                        </Button>
                      </>
                    ) : (
                      <>
                        "{testimonial.message}"
                        {isLongMessage && isExpanded && (
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => toggleExpanded(testimonial.id)}
                            className="p-0 h-auto text-primary ml-1"
                          >
                            Voir moins
                          </Button>
                        )}
                      </>
                    )}
                  </blockquote>

                  {/* Customer Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      {testimonial.image ? (
                        <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden mr-3 bg-muted flex-shrink-0">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                           
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-warning to-warning/80 flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-warning-foreground font-semibold text-sm md:text-lg">
                            {testimonial.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground text-sm md:text-base truncate">
                          {testimonial.name}
                        </p>
                        {testimonial.title && (
                          <p className="text-xs md:text-sm text-muted-foreground truncate">
                            {testimonial.title}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 ml-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => shareTestimonial(testimonial)}
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {new Date(testimonial.createdAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <div className="flex flex-col gap-1 items-end">
                          {testimonial.isVerified && (
                            <Badge variant="secondary" className="text-black text-xs">
                              ✓ Vérifié
                            </Badge>
                          )}
                          <Badge 
                            variant="default" 
                            className="text-xs capitalize"
                          >
                            {testimonial.source === 'internal' ? 'Interne' : 
                             testimonial.source === 'facebook' ? 'Facebook' :
                             testimonial.source === 'google' ? 'Google' :
                             testimonial.source === 'trustpilot' ? 'Trustpilot' : 'Interne'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Users className="w-24 h-24 text-muted-foreground/60 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-foreground mb-2">Aucun Témoignage Trouvé</h3>
          <p className="text-muted-foreground mb-6">
            {hasActiveFilters 
              ? 'Essayez d\'ajuster vos critères de recherche ou vos filtres.'
              : 'Nous travaillons à ajouter plus de témoignages de patients.'
            }
          </p>
          {hasActiveFilters && (
            <Button onClick={clearFilters}>
              Effacer les filtres
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-8">
          {pagination.page > 1 && (
            <Button variant="default" asChild>
              <a href={`/testimonials?${new URLSearchParams({
                ...(searchQuery && { search: searchQuery }),
                ...(ratingFilter !== 'all' && { rating: ratingFilter }),
                page: (pagination.page - 1).toString()
              })}`}>
                Précédent
              </a>
            </Button>
          )}
          
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === pagination.page;
            
            return (
              <Button
                key={pageNum}
                variant={isActive ? "default" : "outline"}
                asChild
              >
                <a href={`/testimonials?${new URLSearchParams({
                  ...(searchQuery && { search: searchQuery }),
                  ...(ratingFilter !== 'all' && { rating: ratingFilter }),
                  page: pageNum.toString()
                })}`}>
                  {pageNum}
                </a>
              </Button>
            );
          })}
          
          {pagination.page < pagination.totalPages && (
            <Button variant="default" asChild>
              <a href={`/testimonials?${new URLSearchParams({
                ...(searchQuery && { search: searchQuery }),
                ...(ratingFilter !== 'all' && { rating: ratingFilter }),
                page: (pagination.page + 1).toString()
              })}`}>
                Suivant
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
