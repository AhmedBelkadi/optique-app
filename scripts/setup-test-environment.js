const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

/**
 * Test Environment Setup Script for Optique App
 * 
 * This script creates a complete test environment with:
 * - Test user accounts (admin, staff, regular user)
 * - Test products and categories
 * - Test customers and appointments
 * - Test CMS content
 * - Test settings and configurations
 * 
 * Run this script to set up your testing environment
 */

async function main() {
  console.log('🧪 Setting up test environment for Optique App...');

  try {
    // 1. Clear existing test data (optional - comment out if you want to keep existing data)
    console.log('🗑️ Clearing existing test data...');
    
    await prisma.rolePermission.deleteMany({});
    await prisma.userRole.deleteMany({});
    await prisma.permission.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.user.deleteMany({});
    
    await prisma.productImage.deleteMany({});
    await prisma.productCategory.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    
    await prisma.appointment.deleteMany({});
    await prisma.appointmentStatus.deleteMany({});
    await prisma.customer.deleteMany({});
    await prisma.testimonial.deleteMany({});
    
    // Clear CMS content
    await prisma.homeValues.deleteMany({});
    await prisma.aboutSection.deleteMany({});
    await prisma.aboutBenefit.deleteMany({});
    await prisma.fAQ.deleteMany({});
    
    // Clear settings
    await prisma.siteSettings.deleteMany({});
    await prisma.contactSettings.deleteMany({});
    await prisma.sEOSettings.deleteMany({});
    await prisma.themeSettings.deleteMany({});
    await prisma.operationalSettings.deleteMany({});
    
    // Clear other models
    await prisma.banner.deleteMany({});
    await prisma.homeSection.deleteMany({});
    
    console.log('✅ All existing data cleared');

    // 2. Create permissions
    console.log('📋 Creating permissions...');
    
    const permissions = [
      // Products
      { name: 'Create Products', description: 'Allow users to create new products', resource: 'products', action: 'create' },
      { name: 'Read Products', description: 'Allow users to view products', resource: 'products', action: 'read' },
      { name: 'Update Products', description: 'Allow users to modify existing products', resource: 'products', action: 'update' },
      { name: 'Delete Products', description: 'Allow users to delete products', resource: 'products', action: 'delete' },
      { name: 'Manage Products', description: 'Full product management capabilities', resource: 'products', action: 'manage' },
      
      // Categories
      { name: 'Create Categories', description: 'Allow users to create new categories', resource: 'categories', action: 'create' },
      { name: 'Read Categories', description: 'Allow users to view categories', resource: 'categories', action: 'read' },
      { name: 'Update Categories', description: 'Allow users to modify existing categories', resource: 'categories', action: 'update' },
      { name: 'Delete Categories', description: 'Allow users to delete categories', resource: 'categories', action: 'delete' },
      { name: 'Manage Categories', description: 'Full category management capabilities', resource: 'categories', action: 'manage' },
      
      // Appointments
      { name: 'Create Appointments', description: 'Allow users to create new appointments', resource: 'appointments', action: 'create' },
      { name: 'Read Appointments', description: 'Allow users to view appointments', resource: 'appointments', action: 'read' },
      { name: 'Update Appointments', description: 'Allow users to modify existing appointments', resource: 'appointments', action: 'update' },
      { name: 'Delete Appointments', description: 'Allow users to delete appointments', resource: 'appointments', action: 'delete' },
      { name: 'Manage Appointments', description: 'Full appointment management capabilities', resource: 'appointments', action: 'manage' },
      
      // Customers
      { name: 'Create Customers', description: 'Allow users to create new customer records', resource: 'customers', action: 'create' },
      { name: 'Read Customers', description: 'Allow users to view customer information', resource: 'customers', action: 'read' },
      { name: 'Update Customers', description: 'Allow users to modify customer records', resource: 'customers', action: 'update' },
      { name: 'Delete Customers', description: 'Allow users to delete customer records', resource: 'customers', action: 'delete' },
      { name: 'Manage Customers', description: 'Full customer management capabilities', resource: 'customers', action: 'manage' },
      
      // Testimonials
      { name: 'Create Testimonials', description: 'Allow users to create new testimonials', resource: 'testimonials', action: 'create' },
      { name: 'Read Testimonials', description: 'Allow users to view testimonials', resource: 'testimonials', action: 'read' },
      { name: 'Update Testimonials', description: 'Allow users to modify existing testimonials', resource: 'testimonials', action: 'update' },
      { name: 'Delete Testimonials', description: 'Allow users to delete testimonials', resource: 'testimonials', action: 'delete' },
      { name: 'Manage Testimonials', description: 'Full testimonial management capabilities', resource: 'testimonials', action: 'manage' },
      
      // Users
      { name: 'Create Users', description: 'Allow users to create new user accounts', resource: 'users', action: 'create' },
      { name: 'Read Users', description: 'Allow users to view user information', resource: 'users', action: 'read' },
      { name: 'Update Users', description: 'Allow users to modify user accounts', resource: 'users', action: 'update' },
      { name: 'Delete Users', description: 'Allow users to delete user accounts', resource: 'users', action: 'delete' },
      { name: 'Manage Users', description: 'Full user management capabilities', resource: 'users', action: 'manage' },
      
      // Roles
      { name: 'Create Roles', description: 'Allow users to create new roles', resource: 'roles', action: 'create' },
      { name: 'Read Roles', description: 'Allow users to view role information', resource: 'roles', action: 'read' },
      { name: 'Update Roles', description: 'Allow users to modify existing roles', resource: 'roles', action: 'update' },
      { name: 'Delete Roles', description: 'Allow users to delete roles', resource: 'roles', action: 'delete' },
      { name: 'Manage Roles', description: 'Full role management capabilities', resource: 'roles', action: 'manage' },
      
      // Permissions
      { name: 'Create Permissions', description: 'Allow users to create new permissions', resource: 'permissions', action: 'create' },
      { name: 'Read Permissions', description: 'Allow users to view permission information', resource: 'permissions', action: 'read' },
      { name: 'Update Permissions', description: 'Allow users to modify existing permissions', resource: 'permissions', action: 'update' },
      { name: 'Delete Permissions', description: 'Allow users to delete permissions', resource: 'permissions', action: 'delete' },
      { name: 'Manage Permissions', description: 'Full permission management capabilities', resource: 'permissions', action: 'manage' },
      
      // Settings
      { name: 'Read Settings', description: 'Allow users to view system settings', resource: 'settings', action: 'read' },
      { name: 'Update Settings', description: 'Allow users to modify system settings', resource: 'settings', action: 'update' },
      { name: 'Manage Settings', description: 'Full settings management capabilities', resource: 'settings', action: 'manage' },
      
    
      // Specific Content Resources - For granular control
      { name: 'Create About Content', description: 'Allow users to create new about page content', resource: 'about', action: 'create' },
      { name: 'Read About Content', description: 'Allow users to view about page content', resource: 'about', action: 'read' },
      { name: 'Update About Content', description: 'Allow users to modify about page content', resource: 'about', action: 'update' },
      { name: 'Delete About Content', description: 'Allow users to delete about page content', resource: 'about', action: 'delete' },
      { name: 'Manage About Content', description: 'Full about page content management capabilities', resource: 'about', action: 'manage' },
      // FAQs
      { name: 'Create FAQs', description: 'Allow users to create new FAQs', resource: 'faqs', action: 'create' },
      { name: 'Read FAQs', description: 'Allow users to view FAQs', resource: 'faqs', action: 'read' },
      { name: 'Update FAQs', description: 'Allow users to modify existing FAQs', resource: 'faqs', action: 'update' },
      { name: 'Delete FAQs', description: 'Allow users to delete FAQs', resource: 'faqs', action: 'delete' },
      { name: 'Manage FAQs', description: 'Full FAQ management capabilities', resource: 'faqs', action: 'manage' },
      
      // Home Page
      { name: 'Create Home Content', description: 'Allow users to create new home page content', resource: 'home', action: 'create' },
      { name: 'Read Home Content', description: 'Allow users to view home page content', resource: 'home', action: 'read' },
      { name: 'Update Home Content', description: 'Allow users to modify home page content', resource: 'home', action: 'update' },
      { name: 'Delete Home Content', description: 'Allow users to delete home page content', resource: 'home', action: 'delete' },
      { name: 'Manage Home Content', description: 'Full home page content management capabilities', resource: 'home', action: 'manage' },
      
      // About Page
      { name: 'Create About Content', description: 'Allow users to create new about page content', resource: 'about', action: 'create' },
      { name: 'Read About Content', description: 'Allow users to view about page content', resource: 'about', action: 'read' },
      { name: 'Update About Content', description: 'Allow users to modify about page content', resource: 'about', action: 'update' },
      { name: 'Delete About Content', description: 'Allow users to delete about page content', resource: 'about', action: 'delete' },
      { name: 'Manage About Content', description: 'Full about page content management capabilities', resource: 'about', action: 'manage' },
      
      // SEO
      { name: 'Create SEO Settings', description: 'Allow users to create new SEO settings', resource: 'seo', action: 'create' },
      { name: 'Read SEO Settings', description: 'Allow users to view SEO settings', resource: 'seo', action: 'read' },
      { name: 'Update SEO Settings', description: 'Allow users to modify SEO settings', resource: 'seo', action: 'update' },
      { name: 'Delete SEO Settings', description: 'Allow users to delete SEO settings', resource: 'seo', action: 'delete' },
      { name: 'Manage SEO Settings', description: 'Full SEO settings management capabilities', resource: 'seo', action: 'manage' },
      
      // Operations
      { name: 'Create Operations Settings', description: 'Allow users to create new operations settings', resource: 'operations', action: 'create' },
      { name: 'Read Operations Settings', description: 'Allow users to view operations settings', resource: 'operations', action: 'read' },
      { name: 'Update Operations Settings', description: 'Allow users to modify operations settings', resource: 'operations', action: 'update' },
      { name: 'Delete Operations Settings', description: 'Allow users to delete operations settings', resource: 'operations', action: 'delete' },
      { name: 'Manage Operations Settings', description: 'Full operations settings management capabilities', resource: 'operations', action: 'manage' },
      
      // Banners
      { name: 'Create Banners', description: 'Allow users to create new banners', resource: 'banners', action: 'create' },
      { name: 'Read Banners', description: 'Allow users to view banners', resource: 'banners', action: 'read' },
      { name: 'Update Banners', description: 'Allow users to modify existing banners', resource: 'banners', action: 'update' },
      { name: 'Delete Banners', description: 'Allow users to delete banners', resource: 'banners', action: 'delete' },
      { name: 'Manage Banners', description: 'Full banner management capabilities', resource: 'banners', action: 'manage' },
      
      // Dashboard
      { name: 'Read Dashboard', description: 'Allow users to access the admin dashboard', resource: 'dashboard', action: 'read' },
      { name: 'Manage Dashboard', description: 'Full dashboard management capabilities', resource: 'dashboard', action: 'manage' },
    ];

    for (const perm of permissions) {
      try {
        await prisma.permission.create({ data: perm });
        console.log(`✅ Created permission: ${perm.name}`);
      } catch (error) {
        if (error.code === 'P2002') {
          // Permission already exists, skip
          console.log(`⏭️  Permission already exists: ${perm.name}`);
        } else {
          // Re-throw other errors
          throw error;
        }
      }
    }

    // 3. Create roles
    console.log('👥 Creating roles...');
    
    let adminRole;
    try {
      adminRole = await prisma.role.create({
        data: {
          name: 'admin',
          description: 'Administrator with full access to all features',
          isActive: true,
        },
      });
      console.log('✅ Admin role created');
    } catch (error) {
      if (error.code === 'P2002') {
        // Role already exists, find it
        adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
        console.log('⏭️  Admin role already exists');
      } else {
        throw error;
      }
    }

    let staffRole;
    try {
      staffRole = await prisma.role.create({
        data: {
          name: 'staff',
          description: 'Staff member with limited access to core features',
          isActive: true,
        },
      });
      console.log('✅ Staff role created');
    } catch (error) {
      if (error.code === 'P2002') {
        // Role already exists, find it
        staffRole = await prisma.role.findUnique({ where: { name: 'staff' } });
        console.log('⏭️  Staff role already exists');
      } else {
        throw error;
      }
    }



    // 4. Assign permissions to roles
    console.log('🔐 Assigning permissions to roles...');
    
    // Admin gets ALL permissions (full system access)
    const adminPermissions = await prisma.permission.findMany({ where: { isActive: true } });
    for (const permission of adminPermissions) {
      try {
        await prisma.rolePermission.create({
          data: {
            roleId: adminRole.id,
            permissionId: permission.id,
            grantedBy: null, // System granted
          },
        });
      } catch (error) {
        if (error.code === 'P2002') {
          // Role permission already exists, skip
          console.log(`⏭️  Admin already has permission: ${permission.name}`);
        } else {
          throw error;
        }
      }
    }
    console.log(`✅ Assigned ${adminPermissions.length} permissions to admin role (FULL ACCESS)`);

    // Staff gets only "Activité Principale" permissions (main activity)
    // This includes: Products, Categories, Appointments, Customers, Testimonials, Dashboard
    // Staff can create, read, and update but NOT delete or manage these resources
    const staffPermissions = await prisma.permission.findMany({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              { resource: 'products' },
              { resource: 'categories' },
              { resource: 'appointments' },
              { resource: 'customers' },
              { resource: 'testimonials' },
              { resource: 'dashboard' },
            ],
          },
          {
            OR: [
              { action: 'create' },
              { action: 'read' },
              { action: 'update' },
            ],
          },
        ],
      },
    });
    
    for (const perm of staffPermissions) {
      try {
        await prisma.rolePermission.create({
          data: {
            roleId: staffRole.id,
            permissionId: perm.id,
            grantedBy: null, // System granted
          },
        });
      } catch (error) {
        if (error.code === 'P2002') {
          // Role permission already exists, skip
          console.log(`⏭️  Staff already has permission: ${perm.name}`);
        } else {
          throw error;
        }
      }
    }
    console.log(`✅ Assigned ${staffPermissions.length} permissions to staff role (Activité Principale only)`);



    // 5. Create test users
    console.log('👤 Creating test users...');
    
    const hashedPassword = await bcrypt.hash('testpassword123', 12);
    
    let adminUser;
    try {
      adminUser = await prisma.user.create({
        data: {
          name: 'Test Admin',
          email: 'admin@test.com',
          password: hashedPassword,
          phone: '+33 1 23 45 67 89',
          isActive: true,
        },
      });
      console.log('✅ Admin user created');
    } catch (error) {
      if (error.code === 'P2002') {
        // User already exists, find it
        adminUser = await prisma.user.findUnique({ where: { email: 'admin@test.com' } });
        console.log('⏭️  Admin user already exists');
      } else {
        throw error;
      }
    }

    let staffUser;
    try {
      staffUser = await prisma.user.create({
        data: {
          name: 'Test Staff',
          email: 'staff@test.com',
          password: hashedPassword,
          phone: '+33 1 23 45 67 90',
          isActive: true,
        },
      });
      console.log('✅ Staff user created');
    } catch (error) {
      if (error.code === 'P2002') {
        // User already exists, find it
        staffUser = await prisma.user.findUnique({ where: { email: 'staff@test.com' } });
        console.log('⏭️  Staff user already exists');
      } else {
        throw error;
      }
    }



    // 6. Assign roles to users
    console.log('🎭 Assigning roles to users...');
    
    try {
      await prisma.userRole.create({
        data: { 
          userId: adminUser.id, 
          roleId: adminRole.id,
          assignedBy: null // System assigned
        }
      });
      console.log('✅ Admin role assigned to admin user');
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('⏭️  Admin user already has admin role');
      } else {
        throw error;
      }
    }

    try {
      await prisma.userRole.create({
        data: { 
          userId: staffUser.id, 
          roleId: staffRole.id,
          assignedBy: null // System assigned
        }
      });
      console.log('✅ Staff role assigned to staff user');
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('⏭️  Staff user already has staff role');
      } else {
        throw error;
      }
    }



    // 7. Create appointment statuses
    console.log('📅 Creating appointment statuses...');
    
    const appointmentStatuses = [
      { name: 'scheduled', displayName: 'Programmé', color: '#3b82f6', order: 1 },
      { name: 'confirmed', displayName: 'Confirmé', color: '#10b981', order: 2 },
      { name: 'in_progress', displayName: 'En cours', color: '#f59e0b', order: 3 },
      { name: 'completed', displayName: 'Terminé', color: '#059669', order: 4 },
      { name: 'cancelled', displayName: 'Annulé', color: '#ef4444', order: 5 },
      { name: 'no_show', displayName: 'Absent', color: '#6b7280', order: 6 },
    ];

    for (const status of appointmentStatuses) {
      await prisma.appointmentStatus.create({ data: status });
    }

    // 8. Create test categories
    console.log('🏷️ Creating test categories...');
    
    const categories = [
      { name: 'Lunettes de vue', description: 'Montures pour correction de la vue' },
      { name: 'Lunettes de soleil', description: 'Lunettes de protection solaire' },
      { name: 'Lentilles de contact', description: 'Lentilles de contact souples et rigides' },
      { name: 'Accessoires', description: 'Étuis, lingettes, solutions' },
      { name: 'Montures enfants', description: 'Lunettes adaptées aux enfants' },
      { name: 'Montures sport', description: 'Lunettes pour activités sportives' },
    ];

    for (const category of categories) {
      await prisma.category.create({ data: category });
    }

    // 9. Create test products
    console.log('🛍️ Creating test products...');
    
    const products = [
      {
        name: 'Ray-Ban Aviator Classic',
        description: 'Lunettes de soleil aviator classiques en métal doré avec verres verts',
        price: 189.99,
        brand: 'Ray-Ban',
        reference: 'RB3025-001',
        categories: ['Lunettes de soleil']
      },
      {
        name: 'Oakley Holbrook',
        description: 'Lunettes de sport avec monture en O Matter et verres Prizm',
        price: 149.99,
        brand: 'Oakley',
        reference: 'OO9202-0556',
        categories: ['Lunettes de soleil', 'Montures sport']
      },
      {
        name: 'Monture Optique Classique',
        description: 'Monture en acétate noire pour correction de la vue',
        price: 89.99,
        brand: 'Optique Maison',
        reference: 'OM-001',
        categories: ['Lunettes de vue']
      },
      {
        name: 'Lentilles de Contact Journalières',
        description: 'Lentilles souples jetables pour une vision claire toute la journée',
        price: 45.99,
        brand: 'Acuvue',
        reference: 'AC-001',
        categories: ['Lentilles de contact']
      },
      {
        name: 'Étui de Protection Premium',
        description: 'Étui en cuir véritable avec doublure en velours',
        price: 24.99,
        brand: 'Optique Maison',
        reference: 'OM-002',
        categories: ['Accessoires']
      },
      {
        name: 'Monture Enfant Colorée',
        description: 'Monture en plastique colorée et résistante pour enfants',
        price: 69.99,
        brand: 'Optique Maison',
        reference: 'OM-003',
        categories: ['Montures enfants', 'Lunettes de vue']
      }
    ];

    for (const productData of products) {
      const { categories: categoryNames, ...productInfo } = productData;
      
      const product = await prisma.product.create({
        data: productInfo
      });

      // Assign categories
      for (const categoryName of categoryNames) {
        const category = await prisma.category.findFirst({
          where: { name: categoryName }
        });
        
        if (category) {
          await prisma.productCategory.create({
            data: {
              productId: product.id,
              categoryId: category.id
            }
          });
        }
      }

      // Add sample images
      await prisma.productImage.create({
        data: {
          filename: `${product.reference}-main.jpg`,
          path: `/uploads/products/${product.reference}-main.jpg`,
          alt: product.name,
          order: 0,
          productId: product.id
        }
      });
    }

    // 10. Create test customers
    console.log('👥 Creating test customers...');
    
    const customers = [
      {
        name: 'Marie Dupont',
        email: 'marie.dupont@email.com',
        phone: '+33 6 12 34 56 78',
        address: '123 Rue de la Paix, 75001 Paris',
        notes: 'Préfère les montures en métal, allergique au nickel'
      },
      {
        name: 'Jean Martin',
        email: 'jean.martin@email.com',
        phone: '+33 6 23 45 67 89',
        address: '456 Avenue des Champs, 75008 Paris',
        notes: 'Aime les styles classiques, porte des lentilles de contact'
      },
      {
        name: 'Sophie Bernard',
        email: 'sophie.bernard@email.com',
        phone: '+33 6 34 56 78 90',
        address: '789 Boulevard Saint-Germain, 75006 Paris',
        notes: 'Recherche des montures tendance, budget moyen'
      },
      {
        name: 'Pierre Dubois',
        email: 'pierre.dubois@email.com',
        phone: '+33 6 45 67 89 01',
        address: '321 Rue de Rivoli, 75001 Paris',
        notes: 'Sportif, a besoin de montures résistantes'
      },
      {
        name: 'Emma Rousseau',
        email: 'emma.rousseau@email.com',
        phone: '+33 6 56 78 90 12',
        address: '654 Quai des Grands Augustins, 75006 Paris',
        notes: 'Étudiante, budget limité, style jeune'
      }
    ];

    for (const customer of customers) {
      await prisma.customer.create({ data: customer });
    }

    // 11. Create test appointments
    console.log('📅 Creating test appointments...');
    
    const allCustomers = await prisma.customer.findMany();
    const allStatuses = await prisma.appointmentStatus.findMany();
    
    const appointments = [
      {
        customerId: allCustomers[0].id,
        title: 'Examen de la vue',
        description: 'Contrôle annuel de la vue avec prescription',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // +30 minutes
        statusId: allStatuses[1].id, // Confirmed
        notes: 'Patient préfère les lentilles de contact'
      },
      {
        customerId: allCustomers[1].id,
        title: 'Essayage de montures',
        description: 'Sélection de nouvelles montures',
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000), // +45 minutes
        statusId: allStatuses[0].id, // Pending
        notes: 'Style classique, budget 200-300€'
      },
      {
        customerId: allCustomers[2].id,
        title: 'Consultation lentilles',
        description: 'Adaptation de nouvelles lentilles de contact',
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // +1 hour
        statusId: allStatuses[2].id, // In progress
        notes: 'Première fois avec des lentilles'
      },
      {
        customerId: allCustomers[3].id,
        title: 'Réparation montures',
        description: 'Réparation des charnières cassées',
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        endTime: new Date(Date.now() - 24 * 60 * 60 * 1000 + 20 * 60 * 1000), // +20 minutes
        statusId: allStatuses[3].id, // Completed
        notes: 'Montures réparées, patient satisfait'
      },
      {
        customerId: allCustomers[4].id,
        title: 'Contrôle enfant',
        description: 'Examen de la vue pour enfant de 8 ans',
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000), // +40 minutes
        statusId: allStatuses[0].id, // Pending
        notes: 'Premier examen, expliquer le processus'
      }
    ];

    for (const appointment of appointments) {
      await prisma.appointment.create({ data: appointment });
    }

    // 12. Create test testimonials
    console.log('💬 Creating test testimonials...');
    
    const testimonials = [
      {
        name: 'Marie Dupont',
        message: 'Excellent service ! L\'équipe est très professionnelle et m\'a aidée à trouver la monture parfaite. Je recommande vivement !',
        title: 'Service exceptionnel',
        image: '/uploads/testimonials/marie-dupont.jpg',
        isActive: true
      },
      {
        name: 'Jean Martin',
        message: 'Très satisfait de mes nouvelles lentilles de contact. L\'adaptation s\'est bien passée et le suivi est excellent.',
        title: 'Lentilles parfaites',
        image: '/uploads/testimonials/jean-martin.jpg',
        isActive: true
      },
      {
        name: 'Sophie Bernard',
        message: 'Un opticien moderne avec un grand choix de montures tendance. Les prix sont raisonnables et le personnel est sympa.',
        title: 'Grand choix de montures',
        image: '/uploads/testimonials/sophie-bernard.jpg',
        isActive: true
      },
      {
        name: 'Pierre Dubois',
        message: 'Parfait pour les sportifs ! J\'ai trouvé des montures solides et confortables pour mes activités.',
        title: 'Idéal pour le sport',
        image: '/uploads/testimonials/pierre-dubois.jpg',
        isActive: true
      }
    ];

    for (const testimonial of testimonials) {
      await prisma.testimonial.create({ data: testimonial });
    }

    // 13. Create CMS content
    console.log('📝 Creating CMS content...');
    
    // Home values
    const homeValues = [
      {
        title: 'Qualité',
        description: 'Nous sélectionnons uniquement les meilleures marques et matériaux',
        highlight: 'Excellence',
        icon: 'Award',
        isActive: true,
        order: 1
      },
      {
        title: 'Service',
        description: 'Notre équipe vous accompagne avec professionnalisme',
        highlight: 'Dévouement',
        icon: 'Heart',
        isActive: true,
        order: 2
      },
      {
        title: 'Innovation',
        description: 'Nous utilisons les dernières technologies pour votre confort',
        highlight: 'Avant-garde',
        icon: 'Zap',
        isActive: true,
        order: 3
      }
    ];

    for (const value of homeValues) {
      await prisma.homeValues.create({ data: value });
    }

    // About sections
    const aboutSections = [
      {
        title: 'Notre Histoire',
        content: 'Depuis plus de 20 ans, nous accompagnons nos clients dans leur parcours visuel avec passion et expertise.',
        image: '/uploads/about-sections/history.jpg',
        order: 1
      },
      {
        title: 'Notre Équipe',
        content: 'Une équipe de professionnels qualifiés et expérimentés, toujours à l\'écoute de vos besoins.',
        image: '/uploads/about-sections/team.jpg',
        order: 2
      },
      {
        title: 'Nos Valeurs',
        content: 'La qualité, le service client et l\'innovation sont au cœur de notre démarche quotidienne.',
        image: '/uploads/about-sections/values.jpg',
        order: 3
      }
    ];

    for (const section of aboutSections) {
      await prisma.aboutSection.create({ data: section });
    }

    // About benefits
    const aboutBenefits = [
      {
        title: 'Expertise',
        description: 'Plus de 20 ans d\'expérience dans l\'optique',
        highlight: '20+ ans',
        icon: 'Eye',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        order: 1
      },
      {
        title: 'Technologie',
        description: 'Équipements de dernière génération',
        highlight: 'High-Tech',
        icon: 'Monitor',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        order: 2
      },
      {
        title: 'Personnalisation',
        description: 'Solutions adaptées à chaque client',
        highlight: 'Sur-mesure',
        icon: 'User',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        order: 3
      }
    ];

    for (const benefit of aboutBenefits) {
      await prisma.aboutBenefit.create({ data: benefit });
    }

    // FAQ
    const faqs = [
      {
        question: 'Comment prendre rendez-vous ?',
        answer: 'Vous pouvez prendre rendez-vous en ligne via notre site web, par téléphone ou directement en magasin.',
        order: 1,
        isActive: true
      },
      {
        question: 'Quels sont vos horaires d\'ouverture ?',
        answer: 'Nous sommes ouverts du lundi au samedi de 9h à 19h. Le dimanche nous sommes fermés.',
        order: 2,
        isActive: true
      },
      {
        question: 'Acceptez-vous la carte vitale ?',
        answer: 'Oui, nous acceptons la carte vitale et nous gérons les démarches de remboursement pour vous.',
        order: 3,
        isActive: true
      },
      {
        question: 'Proposez-vous des montures pour enfants ?',
        answer: 'Oui, nous avons une large gamme de montures adaptées aux enfants, colorées et résistantes.',
        order: 4,
        isActive: true
      }
    ];

    for (const faq of faqs) {
      await prisma.fAQ.create({ data: faq });
    }

    // 14. Create settings
    console.log('⚙️ Creating system settings...');
    
    await prisma.siteSettings.create({
      data: {
        id: 'singleton',
        siteName: 'Arinass Optique - Test Environment',
        slogan: 'Votre vision, notre passion',
        logoUrl: '/uploads/site-settings/logo.png',
        heroBackgroundImg: '/uploads/site-settings/hero-bg.jpg'
      }
    });

    await prisma.contactSettings.create({
      data: {
        id: 'singleton',
        contactEmail: 'contact@arinass-optique.com',
        phone: '+33 1 23 45 67 89',
        whatsapp: '+33 6 12 34 56 78',
        address: '123 Rue de la Paix, 75001 Paris, France',
        openingHours: 'Lundi-Samedi: 9h-19h, Dimanche: Fermé',
        googleMapsApiKey: 'test-api-key',
        whatsappChatLink: 'https://wa.me/33123456789',
        googleMapEmbed: '<iframe src="test-map-embed"></iframe>',
        googleMapLink: 'https://maps.google.com/?q=123+Rue+de+la+Paix+75001+Paris'
      }
    });

    await prisma.sEOSettings.create({
      data: {
        id: 'singleton',
        metaTitle: 'Arinass Optique - Lunettes, Lentilles et Soins Oculaires',
        metaDescription: 'Découvrez notre sélection de lunettes, lentilles de contact et accessoires. Service personnalisé et expertise optique.',
        productMetaTitle: 'Nos Produits - Arinass Optique',
        productMetaDescription: 'Explorez notre gamme complète de lunettes, montures et lentilles de contact.',
        categoryMetaTitle: 'Catégories - Arinass Optique',
        categoryMetaDescription: 'Parcourez nos catégories de produits optiques.',
        ogImage: '/uploads/seo/og-image.jpg',
        googleAnalyticsId: 'GA-TEST-123',
        facebookPixelId: 'FB-TEST-123'
      }
    });

    await prisma.themeSettings.create({
      data: {
        id: 'singleton',
        primaryColor: '#3b82f6',
        secondaryColor: '#1e40af',
        accentColor: '#f59e0b',
        backgroundColor: '#ffffff',
        mutedBackgroundColor: '#f8fafc',
        cardBackgroundColor: '#ffffff',
        foregroundColor: '#0f172a',
        mutedForegroundColor: '#64748b',
        borderColor: '#e2e8f0',
        successColor: '#10b981',
        warningColor: '#f59e0b',
        errorColor: '#ef4444',
        infoColor: '#3b82f6'
      }
    });

    await prisma.operationalSettings.create({
      data: {
        id: 'singleton',
        maintenanceMode: false
      }
    });

    // 15. Create banners
    console.log('🎨 Creating banners...');
    
    const banners = [
      {
        text: '🎉 Offre spéciale : -20% sur toutes les montures de soleil !',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isActive: true
      },
      {
        text: '🔍 Examen de la vue gratuit pour les nouveaux clients',
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        isActive: true
      }
    ];

    for (const banner of banners) {
      await prisma.banner.create({ data: banner });
    }

    // 16. Create home sections
    console.log('🏠 Creating home sections...');
    
    const homeSections = [
      {
        title: 'Bienvenue chez Arinass Optique',
        subtitle: 'Votre partenaire vision depuis plus de 20 ans',
        cta1: 'Prendre rendez-vous',
        cta2: 'Nos produits',
        introMessage: 'Découvrez notre sélection de lunettes, lentilles et accessoires optiques de qualité.',
        backgroundImage: '/uploads/home-sections/welcome-bg.jpg'
      },
      {
        title: 'Nos Services',
        subtitle: 'Une gamme complète de services optiques',
        cta1: 'En savoir plus',
        cta2: 'Contactez-nous',
        introMessage: 'De l\'examen de la vue à la livraison de vos lunettes, nous vous accompagnons à chaque étape.',
        backgroundImage: '/uploads/home-sections/services-bg.jpg'
      }
    ];

    for (const section of homeSections) {
      await prisma.homeSection.create({ data: section });
    }

    console.log('✅ Test environment setup completed successfully!');
    console.log('\n📋 Test Environment Summary:');
    console.log('👤 Users: Admin, Staff');
    console.log('🔐 Roles: Admin (full access), Staff (Activité Principale only)');
    console.log('🏷️ Categories: 6 categories created');
    console.log('🛍️ Products: 6 products with images and categories');
    console.log('👥 Customers: 5 test customers');
    console.log('📅 Appointments: 5 test appointments with different statuses');
    console.log('💬 Testimonials: 4 test testimonials');
    console.log('📝 CMS Content: Home values, about sections, benefits, FAQ');
    console.log('⚙️ Settings: Complete system configuration');
    console.log('🎨 Banners: 2 active promotional banners');
    console.log('🏠 Home Sections: Welcome and services sections');
    
    console.log('\n🔑 Test Account Credentials:');
    console.log('Admin: admin@test.com / testpassword123');
    console.log('Staff: staff@test.com / testpassword123');
    
    console.log('\n🚀 Ready to start manual testing!');

  } catch (error) {
    console.error('❌ Error setting up test environment:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('🎉 Test environment setup completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test environment setup failed:', error);
    process.exit(1);
  });
