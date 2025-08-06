# Testimonials Module

A comprehensive testimonial management system for Arinnas Optique admin panel.

## Features

- ✅ **Full CRUD Operations**: Create, read, update, and delete testimonials
- ✅ **Soft Delete**: Safely hide testimonials without permanent deletion
- ✅ **Restore Functionality**: Recover deleted testimonials
- ✅ **Publish/Unpublish**: Toggle testimonial visibility
- ✅ **Search & Filter**: Find testimonials by name, message, or status
- ✅ **Sorting**: Sort by name, creation date, or update date
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Premium UI**: Beautiful shadcn/ui components with gradients

## Database Schema

```prisma
model Testimonial {
  id        String    @id @default(cuid())
  name      String
  message   String
  title     String?   // Optional title/position
  image     String?   // Optional image path
  isActive  Boolean   @default(true) // Published/Hidden status
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime? // Soft delete timestamp
  isDeleted Boolean   @default(false) // Soft delete flag
}
```

## File Structure

```
src/features/testimonials/
├── actions/                    # Server actions
│   ├── createTestimonial.ts
│   ├── updateTestimonial.ts
│   ├── softDeleteTestimonial.ts
│   ├── restoreTestimonial.ts
│   └── toggleTestimonialStatus.ts
├── queries/                    # Database queries
│   ├── getAllTestimonials.ts
│   └── getTestimonialById.ts
├── schema/                     # Zod validation schemas
│   └── testimonialSchema.ts
├── services/                   # Business logic
│   ├── createTestimonial.ts
│   ├── updateTestimonial.ts
│   ├── softDeleteTestimonial.ts
│   ├── restoreTestimonial.ts
│   └── toggleTestimonialStatus.ts
└── README.md
```

## Components

```
src/components/features/testimonials/
├── TestimonialForm.tsx         # Create/edit form
├── TestimonialTable.tsx        # Admin table with actions
├── TestimonialsContainer.tsx   # Main container with filters
└── TestimonialsSkeleton.tsx    # Loading skeleton
```

## Pages

```
src/app/(admin)/admin/testimonials/
├── page.tsx                    # Main testimonials list
├── new/page.tsx               # Create new testimonial
└── [id]/
    ├── page.tsx               # View testimonial details
    └── edit/page.tsx          # Edit testimonial
```

## Usage

### Creating a Testimonial

```typescript
import { createTestimonialAction } from '@/features/testimonials/actions/createTestimonial';

const result = await createTestimonialAction({
  name: "John Doe",
  message: "Great service and quality products!",
  title: "CEO, Tech Corp",
  image: "https://example.com/photo.jpg",
  isActive: true
});
```

### Getting Testimonials

```typescript
import { getAllTestimonials } from '@/features/testimonials/queries/getAllTestimonials';

const result = await getAllTestimonials({
  search: "john",
  isActive: true,
  sortBy: "createdAt",
  sortOrder: "desc"
});
```

### Toggle Status

```typescript
import { toggleTestimonialStatusAction } from '@/features/testimonials/actions/toggleTestimonialStatus';

const result = await toggleTestimonialStatusAction(testimonialId);
```

## Validation

All testimonials are validated using Zod schemas:

- **Name**: 2-100 characters
- **Message**: 10-500 characters  
- **Title**: Optional, max 100 characters
- **Image**: Optional URL string
- **isActive**: Boolean for publish status

## UI Features

- **Search**: Real-time search across name, message, and title
- **Filters**: Filter by status (All, Published, Hidden, Deleted)
- **Sorting**: Sort by name, creation date, or update date
- **Actions**: Edit, delete, restore, and toggle visibility
- **Responsive**: Mobile-friendly design
- **Loading States**: Skeleton components for better UX
- **Toast Notifications**: Success/error feedback

## Security

- Server-side validation with Zod
- CSRF protection on all forms
- Soft delete prevents data loss
- Proper error handling and logging

## Future Enhancements

- [ ] Image upload functionality
- [ ] Bulk operations (delete multiple, publish multiple)
- [ ] Export testimonials to CSV/PDF
- [ ] Testimonial approval workflow
- [ ] Public testimonial submission form
- [ ] Rich text editor for messages
- [ ] Testimonial categories/tags 