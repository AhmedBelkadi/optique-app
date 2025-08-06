# Admin Components

This directory contains reusable admin components for the Optique application.

## Components Overview

### 🏗️ Core Layout Components

#### `AdminLayout`
The main layout wrapper that combines sidebar, header, and content area.

**Features:**
- Responsive design with mobile sidebar
- Automatic user authentication handling
- Customizable title and subtitle
- Mobile menu toggle functionality

**Usage:**
```tsx
import { AdminLayout } from '@/components/features/admin';

<AdminLayout 
  title="Products" 
  subtitle="Manage your inventory"
  user={user}
>
  {children}
</AdminLayout>
```

#### `AdminSidebar`
Desktop sidebar with navigation items and branding.

**Features:**
- Active state detection
- Badge support for notifications
- Hover animations and transitions
- Responsive design

#### `AdminMobileSidebar`
Mobile-specific sidebar with overlay and close functionality.

**Features:**
- Slide-in animation
- Overlay background
- Touch-friendly interactions
- Auto-close on overlay click

### 🎨 UI Components

#### `AdminHeader`
Header component with search, notifications, and user controls.

**Features:**
- Search functionality
- Notification badge
- User authentication display
- Mobile menu toggle

**Props:**
- `title`: Page title
- `subtitle`: Page subtitle
- `user`: User object for authentication
- `onMenuToggle`: Mobile menu toggle handler

#### `AdminLogo`
Reusable logo component with branding.

**Features:**
- Gradient styling
- Customizable href
- Optional subtitle
- Consistent branding

#### `AdminNavItem`
Individual navigation item with icon and badge support.

**Features:**
- Icon support
- Badge notifications
- Active state styling
- Hover animations
- Different styles for different item types (trash, settings, etc.)

## 🎯 Usage Examples

### Basic Admin Page
```tsx
import { AdminLayout } from '@/components/features/admin';

export default function ProductsPage() {
  return (
    <AdminLayout title="Products" subtitle="Manage inventory">
      <div>Your page content here</div>
    </AdminLayout>
  );
}
```

### Custom Navigation
```tsx
import { AdminNavItem } from '@/components/features/admin';
import { Package } from 'lucide-react';

<AdminNavItem
  href="/admin/products"
  label="Products"
  icon={Package}
  badge={{ count: 12, variant: 'secondary' }}
  isActive={pathname === '/admin/products'}
/>
```

### Custom Header
```tsx
import { AdminHeader } from '@/components/features/admin';

<AdminHeader
  title="Custom Page"
  subtitle="Custom description"
  user={user}
  onMenuToggle={handleMenuToggle}
/>
```

## 🎨 Styling

All components use consistent styling with:
- **Colors**: Indigo/purple gradient theme
- **Shadows**: Soft shadows with backdrop blur
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🔧 Customization

### Adding New Navigation Items
Edit the `navItems` array in `AdminSidebar.tsx`:

```tsx
const navItems: NavItem[] = [
  // ... existing items
  {
    href: '/admin/new-page',
    label: 'New Page',
    icon: NewIcon,
    badge: { count: 5, variant: 'secondary' },
  },
];
```

### Customizing Colors
Update the gradient classes in the components:
- Primary: `from-indigo-500 to-purple-600`
- Hover: `hover:from-indigo-600 hover:to-purple-700`
- Background: `from-slate-50 to-blue-50`

## 📱 Responsive Behavior

- **Desktop**: Full sidebar always visible
- **Tablet**: Collapsible sidebar with overlay
- **Mobile**: Slide-out sidebar with backdrop

## ♿ Accessibility

- Keyboard navigation support
- Screen reader friendly
- Proper focus management
- ARIA labels and roles
- High contrast support

## 🚀 Performance

- Lazy loading of components
- Optimized animations
- Minimal re-renders
- Efficient state management 