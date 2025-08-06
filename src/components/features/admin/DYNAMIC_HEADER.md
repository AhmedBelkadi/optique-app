# Dynamic Admin Header System

The admin header is now fully dynamic and can be configured per page to show relevant information, breadcrumbs, and actions.

## 🎯 Features

### Dynamic Content
- **Page Title & Subtitle**: Customizable per page
- **Breadcrumbs**: Automatic navigation trail
- **Page Actions**: Context-specific buttons and controls
- **Search**: Configurable search with custom placeholders
- **Notifications**: Show/hide based on page needs

### Smart Defaults
- Automatic breadcrumb generation
- Responsive design
- Consistent styling
- Accessibility support

## 🚀 Quick Start

### Basic Usage

```tsx
'use client';

import { useAdminPageConfig } from '@/components/features/admin';

export default function MyAdminPage() {
  useAdminPageConfig({
    title: 'My Page',
    subtitle: 'Page description',
  });

  return <div>Your page content</div>;
}
```

### Advanced Usage

```tsx
'use client';

import { Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminPageConfig } from '@/components/features/admin';

export default function ProductsPage() {
  useAdminPageConfig({
    title: 'Products',
    subtitle: 'Manage your inventory',
    breadcrumbs: [
      { label: 'Products', href: '/admin/products' }
    ],
    actions: (
      <>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View Trash
        </Button>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </>
    ),
    searchPlaceholder: 'Search products...',
    showSearch: true,
    showNotifications: true,
  });

  return <div>Products content</div>;
}
```

## 📋 Configuration Options

### `useAdminPageConfig(config)`

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `title` | `string` | Page title | Required |
| `subtitle` | `string` | Page subtitle | Optional |
| `breadcrumbs` | `Array<{label, href?}>` | Navigation breadcrumbs | Optional |
| `actions` | `ReactNode` | Page-specific action buttons | Optional |
| `searchPlaceholder` | `string` | Custom search placeholder | "Search..." |
| `showSearch` | `boolean` | Show/hide search bar | `true` |
| `showNotifications` | `boolean` | Show/hide notifications | `true` |

## 🎨 Examples

### Products List Page
```tsx
useAdminPageConfig({
  title: 'Products',
  subtitle: 'Manage your optical products and inventory',
  breadcrumbs: [{ label: 'Products', href: '/admin/products' }],
  actions: (
    <>
      <Button variant="outline">View Trash</Button>
      <Button>Add Product</Button>
    </>
  ),
  searchPlaceholder: 'Search products by name, brand, or reference...',
});
```

### Product Detail Page
```tsx
useAdminPageConfig({
  title: 'Product Details',
  subtitle: 'View and manage product information',
  breadcrumbs: [
    { label: 'Products', href: '/admin/products' },
    { label: 'Product Details' }
  ],
  actions: (
    <>
      <Button variant="outline">Back</Button>
      <Button variant="outline">Edit</Button>
      <Button variant="destructive">Delete</Button>
    </>
  ),
  showSearch: false, // Hide search for detail pages
});
```

### Categories Page
```tsx
useAdminPageConfig({
  title: 'Categories',
  subtitle: 'Organize your products with custom categories',
  breadcrumbs: [{ label: 'Categories', href: '/admin/categories' }],
  actions: <Button>Add Category</Button>,
  searchPlaceholder: 'Search categories by name...',
  showNotifications: false, // Hide notifications for this page
});
```

### Dashboard Page
```tsx
useAdminPageConfig({
  title: 'Dashboard',
  subtitle: 'Overview of your optical business',
  // No breadcrumbs for dashboard
  // No actions needed
  showSearch: false,
  showNotifications: true,
});
```

## 🔧 Breadcrumbs

Breadcrumbs are automatically generated based on the current page structure:

```tsx
// Simple breadcrumb
breadcrumbs: [{ label: 'Products', href: '/admin/products' }]

// Nested breadcrumb
breadcrumbs: [
  { label: 'Products', href: '/admin/products' },
  { label: 'Product Details' } // No href for current page
]

// Deep nested breadcrumb
breadcrumbs: [
  { label: 'Products', href: '/admin/products' },
  { label: 'Categories', href: '/admin/products/categories' },
  { label: 'Sunglasses' }
]
```

## 🎯 Page Actions

Actions are rendered in the header's right section and can include any React components:

```tsx
actions: (
  <>
    <Button variant="outline" size="sm">
      <Eye className="w-4 h-4 mr-2" />
      View
    </Button>
    <Button size="sm">
      <Plus className="w-4 h-4 mr-2" />
      Add New
    </Button>
    <Button variant="destructive" size="sm">
      <Trash2 className="w-4 h-4 mr-2" />
      Delete
    </Button>
  </>
)
```

## 🎨 Styling

The header automatically adapts to:
- **Responsive design**: Mobile-friendly layout
- **Consistent theming**: Matches admin design system
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Animations**: Smooth transitions and hover effects

## 🔄 State Management

The header state is managed through React Context and automatically updates when:
- Page configuration changes
- Route changes
- Component re-renders

## 🚀 Best Practices

1. **Use descriptive titles**: Make them clear and specific
2. **Keep actions relevant**: Only show actions needed for the current page
3. **Use breadcrumbs for navigation**: Help users understand their location
4. **Customize search placeholders**: Make them context-specific
5. **Hide unnecessary elements**: Use `showSearch` and `showNotifications` appropriately

## 🎉 Benefits

- **Consistent UX**: All admin pages have the same header structure
- **Flexible**: Easy to customize per page
- **Maintainable**: Centralized header logic
- **Accessible**: Built-in accessibility features
- **Responsive**: Works on all screen sizes 