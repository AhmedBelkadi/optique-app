'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, Palette, Eye, EyeOff, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FAQThemeCategory } from '@/features/cms/schema/faqPageSettingsSchema';
import { createFAQThemeCategory, updateFAQThemeCategory, deleteFAQThemeCategory } from '@/features/faqs/services/upsertFAQThemeCategory';

interface FAQThemeManagerProps {
  themes: FAQThemeCategory[];
  onThemesChange: (themes: FAQThemeCategory[]) => void;
}

interface ThemeFormData {
  name: string;
  icon: string;
  color: string;
  description: string;
  isActive: boolean;
}

const availableIcons = [
  { value: 'Eye', label: 'Eye', icon: '👁️' },
  { value: 'Glasses', label: 'Glasses', icon: '👓' },
  { value: 'Clock', label: 'Clock', icon: '⏰' },
  { value: 'Shield', label: 'Shield', icon: '🛡️' },
  { value: 'CreditCard', label: 'Credit Card', icon: '💳' },
  { value: 'HelpCircle', label: 'Help Circle', icon: '❓' },
  { value: 'Calendar', label: 'Calendar', icon: '📅' },
  { value: 'Heart', label: 'Heart', icon: '❤️' },
  { value: 'Star', label: 'Star', icon: '⭐' },
  { value: 'CheckCircle', label: 'Check Circle', icon: '✅' },
];

const availableColors = [
  { value: 'text-blue-600', label: 'Blue', preview: '🔵' },
  { value: 'text-emerald-600', label: 'Emerald', preview: '🟢' },
  { value: 'text-purple-600', label: 'Purple', preview: '🟣' },
  { value: 'text-orange-600', label: 'Orange', preview: '🟠' },
  { value: 'text-red-600', label: 'Red', preview: '🔴' },
  { value: 'text-yellow-600', label: 'Yellow', preview: '🟡' },
  { value: 'text-pink-600', label: 'Pink', preview: '🩷' },
  { value: 'text-indigo-600', label: 'Indigo', preview: '🔷' },
];

export default function FAQThemeManager({ themes, onThemesChange }: FAQThemeManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<FAQThemeCategory | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [themeToDelete, setThemeToDelete] = useState<FAQThemeCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ThemeFormData>({
    name: '',
    icon: 'HelpCircle',
    color: 'text-primary',
    description: '',
    isActive: true,
  });

  const handleAddTheme = () => {
    setEditingTheme(null);
    setFormData({
      name: '',
      icon: 'HelpCircle',
      color: 'text-primary',
      description: '',
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleEditTheme = (theme: FAQThemeCategory) => {
    setEditingTheme(theme);
    setFormData({
      name: theme.name,
      icon: theme.icon,
      color: theme.color,
      description: theme.description || '',
      isActive: theme.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (theme: FAQThemeCategory) => {
    setThemeToDelete(theme);
    setDeleteModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Theme name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      let result;
      
      if (editingTheme) {
        result = await updateFAQThemeCategory(editingTheme.id, formData);
      } else {
        result = await createFAQThemeCategory(formData);
      }

      if (result.success) {
        toast.success(result.message || 'Theme saved successfully!');
        if (result.data) {
          if (editingTheme) {
            // Update existing theme
            const updatedThemes = themes.map(t => t.id === editingTheme.id ? result.data : t);
            onThemesChange(updatedThemes);
          } else {
            // Add new theme
            onThemesChange([...themes, result.data]);
          }
        }
        setIsDialogOpen(false);
        setEditingTheme(null);
      } else {
        toast.error(result.error || 'Failed to save theme');
      }
    } catch (error) {
      console.error('Error saving theme:', error);
      toast.error('Failed to save theme');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!themeToDelete) return;

    setIsSubmitting(true);
    try {
      const result = await deleteFAQThemeCategory(themeToDelete.id);
      
      if (result.success) {
        toast.success(result.message || 'Theme deleted successfully!');
        const updatedThemes = themes.filter(t => t.id !== themeToDelete.id);
        onThemesChange(updatedThemes);
        setDeleteModalOpen(false);
        setThemeToDelete(null);
      } else {
        toast.error(result.error || 'Failed to delete theme');
      }
    } catch (error) {
      console.error('Error deleting theme:', error);
      toast.error('Failed to delete theme');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleThemeActive = async (theme: FAQThemeCategory) => {
    try {
      const result = await updateFAQThemeCategory(theme.id, {
        ...theme,
        isActive: !theme.isActive,
      });

      if (result.success) {
        const updatedThemes = themes.map(t => t.id === theme.id ? result.data : t);
        onThemesChange(updatedThemes);
        toast.success(`Theme ${!theme.isActive ? 'activated' : 'deactivated'} successfully!`);
      } else {
        toast.error(result.error || 'Failed to update theme');
      }
    } catch (error) {
      console.error('Error updating theme:', error);
      toast.error('Failed to update theme');
    }
  };

  const activeThemes = themes.filter(t => t.isActive);
  const inactiveThemes = themes.filter(t => !t.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Theme Categories</h3>
          <p className="text-sm text-muted-foreground">
            Manage custom theme categories for organizing FAQs
          </p>
        </div>
        <Button onClick={handleAddTheme} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Theme
        </Button>
      </div>

      {/* Active Themes */}
      {activeThemes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-green-600" />
              <span>Active Themes ({activeThemes.length})</span>
            </CardTitle>
            <CardDescription>
              These themes are currently visible on your FAQ page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeThemes.map((theme, index) => (
                <div key={theme.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center text-muted-foreground">
                      <GripVertical className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">#{index + 1}</span>
                    </div>
                    <div className={`w-8 h-8 bg-muted rounded-lg flex items-center justify-center`}>
                      <span className={`text-sm ${theme.color}`}>
                        {availableIcons.find(i => i.value === theme.icon)?.icon || '❓'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">{theme.name}</h4>
                      {theme.description && (
                        <p className="text-sm text-muted-foreground">{theme.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTheme(theme)}
                      className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleThemeActive(theme)}
                      className="h-8 w-8 p-0 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                    >
                      <EyeOff className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(theme)}
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inactive Themes */}
      {inactiveThemes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <EyeOff className="w-5 h-5 text-orange-600" />
              <span>Inactive Themes ({inactiveThemes.length})</span>
            </CardTitle>
            <CardDescription>
              These themes are hidden from your FAQ page but can be reactivated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inactiveThemes.map((theme) => (
                <div key={theme.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 bg-muted rounded-lg flex items-center justify-center opacity-75`}>
                      <span className={`text-sm ${theme.color}`}>
                        {availableIcons.find(i => i.value === theme.icon)?.icon || '❓'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium opacity-75">{theme.name}</h4>
                      {theme.description && (
                        <p className="text-sm text-muted-foreground opacity-75">{theme.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleThemeActive(theme)}
                      className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTheme(theme)}
                      className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(theme)}
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {themes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Palette className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Theme Categories</h3>
            <p className="text-muted-foreground mb-4">
              Create custom theme categories to organize your FAQs by topic
            </p>
            <Button onClick={handleAddTheme}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Theme
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Theme Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-primary" />
              <span>{editingTheme ? 'Edit Theme' : 'Add New Theme'}</span>
            </DialogTitle>
            <DialogDescription>
              {editingTheme 
                ? 'Update the theme category settings'
                : 'Create a new theme category for organizing FAQs'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="themeName">Theme Name</Label>
              <Input
                id="themeName"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Eye Care & Exams"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="themeIcon">Icon</Label>
              <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {availableIcons.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      <div className="flex items-center space-x-2">
                        <span>{icon.icon}</span>
                        <span>{icon.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="themeColor">Color</Label>
              <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {availableColors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center space-x-2">
                        <span>{color.preview}</span>
                        <span>{color.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="themeDescription">Description (Optional)</Label>
              <Input
                id="themeDescription"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this theme"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="themeActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="themeActive">Active (visible on FAQ page)</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (editingTheme ? 'Update Theme' : 'Create Theme')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Theme</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{themeToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Theme'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
