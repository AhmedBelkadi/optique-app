import { prisma } from '../prisma';
import { hashPassword } from '../shared/utils/crypto';

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create permissions
  console.log('Creating permissions...');
  
  const permissions = [
    // Product permissions
    { name: 'products:read', description: 'View products', resource: 'products', action: 'read' },
    { name: 'products:create', description: 'Create products', resource: 'products', action: 'create' },
    { name: 'products:update', description: 'Update products', resource: 'products', action: 'update' },
    { name: 'products:delete', description: 'Delete products', resource: 'products', action: 'delete' },
    
    // Category permissions
    { name: 'categories:read', description: 'View categories', resource: 'categories', action: 'read' },
    { name: 'categories:create', description: 'Create categories', resource: 'categories', action: 'create' },
    { name: 'categories:update', description: 'Update categories', resource: 'categories', action: 'update' },
    { name: 'categories:delete', description: 'Delete categories', resource: 'categories', action: 'delete' },
    
    // Appointment permissions
    { name: 'appointments:read', description: 'View appointments', resource: 'appointments', action: 'read' },
    { name: 'appointments:create', description: 'Create appointments', resource: 'appointments', action: 'create' },
    { name: 'appointments:update', description: 'Update appointments', resource: 'appointments', action: 'update' },
    { name: 'appointments:delete', description: 'Delete appointments', resource: 'appointments', action: 'delete' },
    
    // Customer permissions
    { name: 'customers:read', description: 'View customers', resource: 'customers', action: 'read' },
    { name: 'customers:create', description: 'Create customers', resource: 'customers', action: 'create' },
    { name: 'customers:update', description: 'Update customers', resource: 'customers', action: 'update' },
    { name: 'customers:delete', description: 'Delete customers', resource: 'customers', action: 'delete' },
    
    // Testimonial permissions
    { name: 'testimonials:read', description: 'View testimonials', resource: 'testimonials', action: 'read' },
    { name: 'testimonials:create', description: 'Create testimonials', resource: 'testimonials', action: 'create' },
    { name: 'testimonials:update', description: 'Update testimonials', resource: 'testimonials', action: 'update' },
    { name: 'testimonials:delete', description: 'Delete testimonials', resource: 'testimonials', action: 'delete' },
    
    // User management permissions
    { name: 'users:read', description: 'View users', resource: 'users', action: 'read' },
    { name: 'users:create', description: 'Create users', resource: 'users', action: 'create' },
    { name: 'users:update', description: 'Update users', resource: 'users', action: 'update' },
    { name: 'users:delete', description: 'Delete users', resource: 'users', action: 'delete' },
    
    // Role management permissions
    { name: 'roles:read', description: 'View roles', resource: 'roles', action: 'read' },
    { name: 'roles:create', description: 'Create roles', resource: 'roles', action: 'create' },
    { name: 'roles:update', description: 'Update roles', resource: 'roles', action: 'update' },
    { name: 'roles:delete', description: 'Delete roles', resource: 'roles', action: 'delete' },
    
    // Settings permissions
    { name: 'settings:read', description: 'View settings', resource: 'settings', action: 'read' },
    { name: 'settings:update', description: 'Update settings', resource: 'settings', action: 'update' },
    
    // Content management permissions
    { name: 'content:read', description: 'View content', resource: 'content', action: 'read' },
    { name: 'content:create', description: 'Create content', resource: 'content', action: 'create' },
    { name: 'content:update', description: 'Update content', resource: 'content', action: 'update' },
    { name: 'content:delete', description: 'Delete content', resource: 'content', action: 'delete' },
  ];

  for (const permissionData of permissions) {
    await prisma.permission.upsert({
      where: { name: permissionData.name },
      update: {},
      create: permissionData,
    });
  }

  console.log('✅ Permissions created');

  // Create roles
  console.log('Creating roles...');
  
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Full system access - can manage everything',
    },
  });

  const staffRole = await prisma.role.upsert({
    where: { name: 'staff' },
    update: {},
    create: {
      name: 'staff',
      description: 'Operational access - can manage daily operations',
    },
  });

  console.log('✅ Roles created');

  // Assign permissions to admin role (all permissions)
  console.log('Assigning permissions to admin role...');
  
  const allPermissions = await prisma.permission.findMany();
  
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Assign permissions to staff role (operational permissions only)
  console.log('Assigning permissions to staff role...');
  
  const staffPermissions = [
    'products:read', 'products:create', 'products:update',
    'categories:read', 'categories:create', 'categories:update',
    'appointments:read', 'appointments:create', 'appointments:update',
    'customers:read', 'customers:create', 'customers:update',
    'testimonials:read', 'testimonials:create', 'testimonials:update',
    'content:read', 'content:create', 'content:update',
  ];

  for (const permissionName of staffPermissions) {
    const permission = await prisma.permission.findUnique({
      where: { name: permissionName },
    });
    
    if (permission) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: staffRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: staffRole.id,
          permissionId: permission.id,
        },
      });
    }
  }

  console.log('✅ Role permissions assigned');

  // Create first admin user
  console.log('Creating first admin user...');
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@optique.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
  
  const hashedPassword = await hashPassword(adminPassword);
  
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'System Administrator',
      email: adminEmail,
      password: hashedPassword,
      isActive: true,
    },
  });

  // Assign admin role to the user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log('✅ Admin user created');
  console.log(`📧 Email: ${adminEmail}`);
  console.log(`🔑 Password: ${adminPassword}`);
  console.log('⚠️  Please change this password after first login!');

  // Create sample categories
  console.log('Creating sample categories...');
  
  const categories = [
    { name: 'Eyeglasses', description: 'Stylish prescription and reading glasses' },
    { name: 'Sunglasses', description: 'UV protection with trendy designs' },
    { name: 'Contact Lenses', description: 'Daily, weekly, and monthly contact lenses' },
    { name: 'Accessories', description: 'Cases, cleaning supplies, and more' },
  ];

  for (const categoryData of categories) {
    await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: categoryData,
    });
  }

  console.log('✅ Sample categories created');

  // Create sample products
  console.log('Creating sample products...');
  
  const products = [
    {
      name: 'Classic Round Eyeglasses',
      description: 'Timeless round frames perfect for any face shape',
      price: 89.99,
      brand: 'Optique',
      reference: 'GLASS-001',
    },
    {
      name: 'Aviator Sunglasses',
      description: 'Classic aviator style with premium UV protection',
      price: 129.99,
      brand: 'Optique',
      reference: 'SUN-001',
    },
    {
      name: 'Daily Contact Lenses',
      description: 'Comfortable daily disposable contact lenses',
      price: 49.99,
      brand: 'Optique',
      reference: 'CONTACT-001',
    },
    {
      name: 'Premium Eyeglass Case',
      description: 'Leather case with microfiber cleaning cloth',
      price: 24.99,
      brand: 'Optique',
      reference: 'ACC-001',
    },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { reference: productData.reference },
      update: {},
      create: productData,
    });
  }

  console.log('✅ Sample products created');

  // Create sample testimonials
  console.log('Creating sample testimonials...');
  
  const testimonials = [
    {
      name: 'Sarah Johnson',
      title: 'Very satisfied customer',
      message: 'The staff at Optique was incredibly helpful in finding the perfect frames for my face shape. Great service and quality products!',
      isActive: true,
    },
    {
      name: 'Michael Chen',
      title: 'Excellent experience',
      message: 'I\'ve been coming here for years. The optometrist is thorough and the selection of frames is always up-to-date with the latest trends.',
      isActive: true,
    },
    {
      name: 'Emily Rodriguez',
      title: 'Highly recommend',
      message: 'Found the perfect sunglasses here. The staff took the time to understand my style preferences and budget. Will definitely return!',
      isActive: true,
    },
  ];

  for (const testimonialData of testimonials) {
    await prisma.testimonial.upsert({
      where: { 
        id: testimonialData.name + '-' + testimonialData.title, // Create unique ID
      },
      update: {},
      create: {
        id: testimonialData.name + '-' + testimonialData.title,
        ...testimonialData,
      },
    });
  }

  console.log('✅ Sample testimonials created');

  // Create sample CMS content for home page
  console.log('Creating sample CMS content...');
  
  // Home Hero - Arinass Optique
  await prisma.homeHero.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      title: 'Arinass Optique',
      subtitle: 'Votre vision, notre passion. Spécialiste des lunettes de vue et de soleil à Agadir.',
      cta1: 'Prendre RDV',
      cta1Link: '/appointment',
      cta2: 'Nos Produits',
      cta2Link: '/products',
      showBackgroundImage: true,
      textColor: 'white',
      cta1Variant: 'default',
      cta2Variant: 'outline',
      cta1Size: 'lg',
      cta2Size: 'lg',
    },
  });

  // Home Welcome - Arinass Optique
  await prisma.homeWelcome.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      title: 'Bienvenue chez Arinass Optique',
      message: 'Situé au cœur d\'Agadir, nous vous accueillons dans un espace dédié à la vision et à l\'élégance, où le confort visuel rencontre les dernières tendances en matière d\'optique.',
      showDivider: true,
      dividerColor: 'primary',
      textAlignment: 'center',
      backgroundColor: 'transparent',
      textColor: 'foreground',
      padding: 'lg',
    },
  });

  // Home Floating CTA - Arinass Optique
  await prisma.homeFloatingCTA.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      isActive: true,
      buttonText: 'Prendre RDV',
      buttonLink: '/appointment',
      buttonIcon: 'Calendar',
      buttonVariant: 'default',
      buttonSize: 'lg',
      position: 'bottom-right',
      showOnScroll: true,
      scrollThreshold: 300,
    },
  });

  // Site Settings - Arinass Optique
  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      siteName: 'Arinass Optique',
      slogan: 'Votre vision, notre passion',
      logoUrl: '/uploads/site-settings/arinass-logo.png',
    },
  });

  // Contact Settings - Arinass Optique
  await prisma.contactSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      contactEmail: 'optiquearinass@gmail.com',
      phone: '+212 606-970209',
      whatsapp: '+212 606-970209',
      address: 'n62, imm, 22 résidence difaf dcheira el jihadia inzegane, 86360, Morocco',
      openingHours: 'Lundi - Samedi: 9h00 - 19h00, Dimanche: Fermé',
      whatsappChatLink: 'https://wa.me/212606970209',
    },
  });

  // Theme Settings - Arinass Optique (Teal theme)
  await prisma.themeSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      primaryColor: 'hsl(180 100% 25%)', // Teal
      secondaryColor: 'hsl(200 100% 35%)', // Blue
      accentColor: 'hsl(45 100% 50%)', // Gold
      backgroundColor: 'hsl(0 0% 100%)', // White
      foregroundColor: 'hsl(180 100% 25%)', // Teal
      successColor: 'hsl(142 76% 36%)',
      warningColor: 'hsl(38 92% 50%)',
      errorColor: 'hsl(0 84% 60%)',
      infoColor: 'hsl(200 100% 35%)',
    },
  });

  // SEO Settings - Arinass Optique
  await prisma.sEOSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      metaTitle: 'Arinass Optique - Lunettes de Vue et de Soleil à Agadir',
      metaDescription: 'Spécialiste des lunettes de vue et de soleil à Agadir. Large sélection de marques premium, verres correcteurs et lentilles de contact. Service personnalisé et expertise optique.',
      productMetaTitle: 'Lunettes et Verres - Arinass Optique Agadir',
      productMetaDescription: 'Découvrez notre collection de lunettes de vue, lunettes de soleil et verres correcteurs. Marques premium et service expert à Agadir.',
      categoryMetaTitle: 'Catégories de Produits - Arinass Optique',
      categoryMetaDescription: 'Explorez nos catégories de produits optiques : lunettes de vue, lunettes de soleil, verres correcteurs et accessoires.',
    },
  });

  console.log('✅ Sample CMS content created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 What was created:');
  console.log('✅ Permissions and roles system');
  console.log('✅ Admin user account');
  console.log('✅ Sample categories (4)');
  console.log('✅ Sample products (4)');
  console.log('✅ Sample testimonials (3)');
  console.log('✅ Home page CMS content');
  console.log('✅ Site settings and contact information');
  console.log('✅ Theme settings (Teal theme)');
  console.log('✅ SEO settings');
  console.log('\n🌐 Arinass Optique shop information configured:');
  console.log('Name: Arinass Optique');
  console.log('Address: n62, imm, 22 résidence difaf dcheira el jihadia inzegane, 86360, Morocco');
  console.log('Phone: +212 606-970209');
  console.log('Email: optiquearinass@gmail.com');
  console.log('Hours: Lundi - Samedi: 9h00 - 19h00, Dimanche: Fermé');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
