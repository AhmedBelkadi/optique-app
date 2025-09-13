# Arinass Optique Database Seeders

This directory contains comprehensive database seeding scripts for the Arinass Optique application.

## Files Overview

### 1. `docker-seed.js`
**Main seeder** - Creates the core application data:
- Admin user and permissions system
- Home values and FAQ content
- About sections and testimonials
- Appointment statuses and services
- Site, contact, and theme settings

### 2. `additional-seed.js`
**Extended seeder** - Creates business-specific data:
- Product categories (Lunettes, Verres, Lentilles, etc.)
- Sample products with images and categories
- Customer records
- Appointments linked to customers
- Promotional banners
- About page benefits
- Operational and external API settings

### 3. `run-all-seeders.js`
**Master script** - Runs both seeders in sequence for complete database setup.

## Usage

### Option 1: Run All Seeders (Recommended)
```bash
node scripts/run-all-seeders.js
```

### Option 2: Run Individual Seeders
```bash
# Run main seeder only
node scripts/docker-seed.js

# Run additional seeder only (requires main seeder to be run first)
node scripts/additional-seed.js
```

## What Gets Created

### Core System Data
- **Admin User**: `optiquearinass@gmail.com` / `Admin123!@#`
- **Roles**: Admin (full access) and Staff (limited access)
- **Permissions**: Complete RBAC system for all resources

### Content Data
- **Home Values**: 3 values (Expertise, Choix Varié, Proximité)
- **FAQ**: 8 questions in French
- **About Sections**: 3 sections (Histoire, Mission, Équipe)
- **Testimonials**: 3 customer testimonials
- **Services**: 6 optometry services

### Business Data
- **Categories**: 6 product categories
- **Products**: 12 sample products with images
- **Customers**: 5 sample customers
- **Appointments**: 8 sample appointments
- **Banners**: 3 promotional banners

### Settings
- **Site Settings**: Arinass Optique branding
- **Contact Settings**: Address, phone, social media
- **Theme Settings**: Brand colors (#1A889D, #4A4A4A)
- **Operational Settings**: Maintenance mode configuration
- **External API Settings**: Google Places and Facebook integration

## Prerequisites

1. **Database**: PostgreSQL database must be running and accessible
2. **Environment**: `.env` file with `DATABASE_URL` configured
3. **Dependencies**: All npm packages installed (`npm install`)
4. **Prisma**: Database schema must be migrated (`npx prisma migrate deploy`)

## Safety Features

- **Idempotent**: Scripts can be run multiple times safely
- **Duplicate Prevention**: Checks for existing records before creating
- **Error Handling**: Comprehensive error handling and logging
- **Transaction Safety**: Each seeder runs in its own transaction

## Customization

### Adding New Products
Edit the `products` array in `additional-seed.js`:
```javascript
{
  name: 'Your Product Name',
  description: 'Product description',
  price: 99.99,
  brand: 'Brand Name',
  reference: 'UNIQUE-REF-001',
  categoryName: 'Lunettes de Vue', // Must match existing category
  images: [
    { filename: 'product-1.jpg', path: '/uploads/products/product-1.jpg', alt: 'Product view', order: 0 }
  ]
}
```

### Adding New Categories
Edit the `categories` array in `additional-seed.js`:
```javascript
{
  name: 'Category Name',
  description: 'Category description',
}
```

### Modifying Admin Credentials
Edit the credentials in `docker-seed.js`:
```javascript
const adminEmail = 'your-email@domain.com';
const adminPassword = 'YourSecurePassword123!';
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify `DATABASE_URL` in `.env` file
   - Ensure PostgreSQL is running
   - Check database permissions

2. **Permission Denied**
   - Ensure you have write permissions to the database
   - Check if the database user has CREATE/INSERT privileges

3. **Duplicate Key Errors**
   - This is normal - the script checks for existing records
   - If you see this error, it means the data already exists

4. **Foreign Key Constraint Errors**
   - Ensure you run `docker-seed.js` before `additional-seed.js`
   - Check that all referenced records exist

### Reset Database
If you need to start fresh:
```bash
# Reset the database (WARNING: This deletes all data)
npx prisma migrate reset

# Then run the seeders
node scripts/run-all-seeders.js
```

## Development Notes

- All text content is in French to match the Arinass Optique brand
- Product prices are in the local currency (MAD)
- Contact information matches the real business details
- Images are placeholder paths - replace with actual uploaded images
- API keys are placeholders - replace with real keys for production

## Support

For issues or questions about the seeders, please check:
1. The application logs for detailed error messages
2. The database connection and permissions
3. The Prisma schema for model definitions
4. The existing data to avoid conflicts
