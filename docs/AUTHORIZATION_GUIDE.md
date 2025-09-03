# Authorization System Guide

## Overview

This project uses a **simplified authorization system** that focuses on **server-side security** with **clean, simple UI**.

## 🎯 **Key Principles**

1. **Server-Side Security**: All permission checks happen on the server
2. **Clean UI**: No conditional rendering based on permissions in UI components
3. **Smart Navigation**: Sidebar shows only what users can access
4. **Action Protection**: All server actions are protected by permissions

## 🏗️ **Architecture**

### **Authentication Layer**
- **Middleware**: Simple session token check
- **Session Service**: User authentication and role management

### **Authorization Layer**
- **Server Actions**: Protected by `requirePermission()` calls
- **Page Components**: Protected by `requirePermission()` calls
- **Navigation**: Smart filtering based on user roles

### **UI Layer**
- **Clean Components**: No permission-based conditional rendering
- **Smart Sidebar**: Shows navigation based on user capabilities
- **Consistent Experience**: Same UI for all users (security handled server-side)

## 🔐 **Permission System**

### **Permission Format**
```typescript
await requirePermission('resource', 'action');
```

### **Common Permissions**
- `users:create`, `users:read`, `users:update`, `users:delete`
- `products:create`, `products:read`, `products:update`, `products:delete`
- `categories:create`, `categories:read`, `categories:update`, `categories:delete`
- `customers:create`, `customers:read`, `customers:update`, `customers:delete`
- `appointments:create`, `appointments:read`, `appointments:update`, `appointments:delete`
- `testimonials:create`, `testimonials:read`, `testimonials:update`, `testimonials:delete`
- `settings:read`, `settings:update`
- `cms:create`, `cms:read`, `cms:update`, `cms:delete`
- `system:maintenance`

## 🚀 **Usage Examples**

### **Protecting Server Actions**
```typescript
export async function createProductAction(prevState: any, formData: FormData) {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('products', 'create');

    // ... rest of the action logic
  } catch (error) {
    // Handle errors
  }
}
```

### **Protecting Pages**
```typescript
export default async function UsersPage() {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('users', 'read');

  // ... rest of the page logic
}
```

### **Sidebar Navigation**
```typescript
// Simple role-based filtering
const isAdmin = user?.isAdmin || false;
const isStaff = user?.isStaff || false;

const filteredNavGroups = navGroups.filter(group => {
  if (group.adminOnly && !isAdmin) return false;
  
  const filteredItems = group.items.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.staffAccessible) return true;
    return isAdmin;
  });

  return filteredItems.length > 0;
});
```

## 🎨 **UI Guidelines**

### **What NOT to Do**
- ❌ Don't use `PermissionGuard` components
- ❌ Don't use `useAuthorization` hooks
- ❌ Don't conditionally render buttons/forms based on permissions
- ❌ Don't show/hide content based on client-side permission checks

### **What TO Do**
- ✅ Use `requirePermission()` in server actions
- ✅ Use `requirePermission()` in page components
- ✅ Let the sidebar handle navigation filtering
- ✅ Keep UI clean and consistent for all users

## 🔒 **Security Features**

### **Server-Side Protection**
- **Authentication**: Session-based with secure tokens
- **Authorization**: Granular permission checking
- **Rate Limiting**: API rate limiting on all actions
- **CSRF Protection**: CSRF token validation
- **Input Validation**: Schema-based validation

### **Navigation Security**
- **Smart Filtering**: Sidebar shows only accessible routes
- **Role-Based Access**: Admin vs Staff navigation
- **Clean URLs**: No permission-based URL manipulation

## 🧪 **Testing**

### **Testing Permissions**
1. **Server Actions**: Test with different user roles
2. **Page Access**: Verify permission requirements
3. **Navigation**: Check sidebar filtering
4. **Error Handling**: Test unauthorized access

### **Common Test Scenarios**
- Admin user accessing all features
- Staff user accessing limited features
- Unauthorized access attempts
- Permission boundary testing

## 🚀 **Best Practices**

1. **Always use `requirePermission()`** in server actions
2. **Keep UI components clean** - no permission logic
3. **Let the sidebar handle navigation** filtering
4. **Test with different user roles** regularly
5. **Keep permissions granular** and specific
6. **Document permission requirements** clearly

## 🔄 **Migration Guide**

### **From Complex Permission System**
1. Remove `PermissionGuard` components
2. Remove `useAuthorization` hooks
3. Remove conditional rendering in UI
4. Keep server-side permission checks
5. Simplify sidebar navigation logic

### **To Simple System**
1. Use `requirePermission()` everywhere
2. Clean up UI components
3. Simplify sidebar filtering
4. Test thoroughly
5. Update documentation

## 📚 **Related Files**

- `src/lib/auth/authorization.ts` - Server-side authorization utilities
- `src/components/features/admin/AdminSidebar.tsx` - Smart navigation
- `src/middleware.ts` - Simple authentication middleware
- Server actions in `src/features/*/actions/` - Protected by permissions

## 🎯 **Summary**

This system provides:
- **Strong Security**: Server-side permission checking
- **Clean UI**: No conditional rendering complexity
- **Smart Navigation**: Intelligent sidebar filtering
- **Easy Maintenance**: Simple, consistent patterns
- **User Experience**: Same interface for all users

The key is: **Security on the server, simplicity in the UI, intelligence in the navigation.**
