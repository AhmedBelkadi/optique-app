const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

/**
 * Database Seeding Script for Permissions and Roles
 * 
 * This script creates:
 * - All system permissions including banners
 * - Admin role with FULL ACCESS to everything
 * - Staff role with "Activité Principale" access only (create/read/update)
 * - Admin user account
 * 
 * Activité Principale includes: Products, Categories, Appointments, Customers, Testimonials, Services
 * Staff CANNOT: delete, manage permissions, manage users, access system settings
 */

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create default permissions
    console.log('📝 Creating default permissions...');
    
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
//aboutpage
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
      
      // Services
      { name: 'Create Services', description: 'Allow users to create new services', resource: 'services', action: 'create' },
      { name: 'Read Services', description: 'Allow users to view services', resource: 'services', action: 'read' },
      { name: 'Update Services', description: 'Allow users to modify existing services', resource: 'services', action: 'update' },
      { name: 'Delete Services', description: 'Allow users to delete services', resource: 'services', action: 'delete' },
      { name: 'Manage Services', description: 'Full service management capabilities', resource: 'services', action: 'manage' },
      
      // Dashboard
      { name: 'Read Dashboard', description: 'Allow users to access the admin dashboard', resource: 'dashboard', action: 'read' },
      { name: 'Manage Dashboard', description: 'Full dashboard management capabilities', resource: 'dashboard', action: 'manage' },
    ];

    const createdPermissions = [];
    for (const permission of permissions) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          AND: [
            { resource: permission.resource },
            { action: permission.action }
          ]
        }
      });

      if (!existingPermission) {
        const created = await prisma.permission.create({
          data: permission
        });
        createdPermissions.push(created);
        console.log(`✅ Created permission: ${permission.name}`);
      } else {
        console.log(`⏭️  Permission already exists: ${permission.name}`);
      }
    }

    // Create default roles
    console.log('👑 Creating default roles...');
    
    // Admin role
    const adminRole = await prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: {
        name: 'admin',
        description: 'Full system administrator with all permissions',
        isActive: true,
      },
    });
    console.log('✅ Admin role created/updated');

    // Staff role
    const staffRole = await prisma.role.upsert({
      where: { name: 'staff' },
      update: {},
      create: {
        name: 'staff',
        description: 'Staff member with operational permissions',
        isActive: true,
      },
    });
    console.log('✅ Staff role created/updated');



    // Assign permissions to roles
    console.log('🔗 Assigning permissions to roles...');
    
    // Admin gets ALL permissions (full system access)
    const adminPermissions = await prisma.permission.findMany({ where: { isActive: true } });
    for (const permission of adminPermissions) {
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
          grantedBy: null, // System granted
        },
      });
    }
    console.log(`✅ Assigned ${adminPermissions.length} permissions to admin role`);

    // Staff gets only "Activité Principale" permissions (main activity)
    // This includes: Products, Categories, Appointments, Customers, Testimonials, Services, Dashboard
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
              { resource: 'services' },
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
    
    for (const permission of staffPermissions) {
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
          grantedBy: null, // System granted
        },
      });
    }
    console.log(`✅ Assigned ${staffPermissions.length} permissions to staff role (Activité Principale only)`);

    // Create admin user if it doesn't exist
    console.log('👤 Creating admin user...');
    const adminEmail = 'admin@optique.com';
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const adminUser = await prisma.user.create({
        data: {
          name: 'System Administrator',
          email: adminEmail,
          password: hashedPassword,
          isActive: true,
        },
      });

      // Assign admin role to admin user
      await prisma.userRole.create({
        data: {
          userId: adminUser.id,
          roleId: adminRole.id,
          assignedBy: null, // System assigned
        },
      });

      console.log('✅ Admin user created with credentials:');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: admin123`);
      console.log('⚠️  Please change this password immediately!');
    } else {
      console.log('⏭️  Admin user already exists');
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   - ${createdPermissions.length} permissions created (including banners)`);
    console.log(`   - 2 roles created:`);
    console.log(`     • Admin: FULL ACCESS to everything`);
    console.log(`     • Staff: Activité Principale only (create/read/update)`);
    console.log(`   - Admin user: ${adminEmail} / admin123`);
    console.log('');
    console.log('🔐 You can now log in with the admin account to manage the system.');
    console.log('👥 Staff users will have limited access to main business operations only.');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  });
