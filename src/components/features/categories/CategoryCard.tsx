'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Edit, Trash2, MoreVertical, Calendar } from 'lucide-react';
import { Category } from '@/features/categories/schema/categorySchema';
import EditCategoryModal from '@/components/features/categories/EditCategoryModal';
import DeleteCategoryModal from '@/components/features/categories/DeleteCategoryModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDateShort } from '@/lib/shared/utils/dateUtils';

interface CategoryCardProps {
  category: Category;
  viewMode?: 'grid' | 'list';
  onCategoryUpdated: (category: Category) => void;
  onCategoryDeleted: (id: string) => void;
}

export default function CategoryCard({ 
  category, 
  viewMode = 'grid',
  onCategoryUpdated,
  onCategoryDeleted,
}: CategoryCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (viewMode === 'list') {
    return (
      <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm hover:shadow-md transition-all duration-200 group">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            {/* Image */}
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 flex-shrink-0">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', category.image);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-muted-foreground">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground truncate">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{category.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditOpen(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <Calendar className="w-3 h-3 mr-1" />
                Created {formatDateShort(category.createdAt)}
              </div>
            </div>
          </div>
        </CardContent>

        <EditCategoryModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          categoryId={category.id}
          categoryName={category.name}
          categoryDescription={category.description}
          categoryImage={category.image}
          onSuccess={onCategoryUpdated}
        />

        <DeleteCategoryModal
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          categoryId={category.id}
          categoryName={category.name}
          onSuccess={() => onCategoryDeleted(category.id)}
        />
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm overflow-hidden hover:shadow-lg transition-all duration-200 group">
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.error('Image failed to load:', category.image);
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setEditOpen(true)}
              className="bg-background/90 hover:bg-background text-foreground"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
              className="bg-destructive/90 hover:bg-destructive text-destructive-foreground"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground truncate">{category.name}</h3>
        </div>

        {category.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{category.description}</p>
        )}

        <div className="flex items-center text-xs text-muted-foreground mb-4">
          <Calendar className="w-4 h-4 mr-1" />
          Created {formatDateShort(category.createdAt)}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditOpen(true)}
              className="text-muted-foreground hover:text-foreground h-8 px-3"
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteOpen(true)}
              className="text-destructive hover:text-destructive h-8 px-3"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Modals */}
      <EditCategoryModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        categoryId={category.id}
        categoryName={category.name}
        categoryDescription={category.description}
        categoryImage={category.image}
        onSuccess={onCategoryUpdated}
      />

      <DeleteCategoryModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        categoryId={category.id}
        categoryName={category.name}
        onSuccess={() => onCategoryDeleted(category.id)}
      />
    </Card>
  );
}
