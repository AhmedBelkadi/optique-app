const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

/**
 * Docker Seeder for Arinass Optique
 * 
 * This script creates:
 * - Admin user and roles/permissions (from existing seed-permissions.js)
 * - HomeValues (3 values in French)
 * - FAQ (5-10 questions in French)
 * - AboutSection (3 sections in French)
 * - Testimonial (3 testimonials in French)
 * - AppointmentStatus (6 statuses in French)
 * - SiteSettings (Arinass Optique info)
 * - ContactSettings (address/phone/email)
 * - ThemeSettings (brand colors)
 */

async function main() {
  console.log('🌱 Starting Arinass Optique Docker seeding...');

  try {
    // 1. Create permissions, roles, and admin user
    console.log('👤 Creating permissions, roles, and admin user...');
    await seedPermissionsAndRoles();

    // 2. Create HomeValues
    console.log('🏠 Creating home values...');
    await seedHomeValues();

    // 3. Create FAQ
    console.log('❓ Creating FAQ content...');
    await seedFAQ();

    // 4. Create AboutSection
    console.log('ℹ️ Creating about sections...');
    await seedAboutSections();

    // 5. Create Testimonials
    console.log('💬 Creating testimonials...');
    await seedTestimonials();

    // 6. Create AppointmentStatus
    console.log('📅 Creating appointment statuses...');
    await seedAppointmentStatuses();

    // 7. Create SiteSettings
    console.log('⚙️ Creating site settings...');
    await seedSiteSettings();

    // 8. Create ContactSettings
    console.log('📞 Creating contact settings...');
    await seedContactSettings();

    // 9. Create ThemeSettings
    console.log('🎨 Creating theme settings...');
    await seedThemeSettings();

    // 10. Create Services
    console.log('🔧 Creating services...');
    await seedServices();

    console.log('🎉 Arinass Optique Docker seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log('   - Admin user: admin@optique.com / admin123');
    console.log('   - 2 roles created:');
    console.log('     • Admin: FULL ACCESS to everything');
    console.log('     • Staff: Activité Principale only (create/read/update)');
    console.log('   - 3 Home values (Expertise, Choix Varié, Proximité)');
    console.log('   - 8 FAQ questions in French');
    console.log('   - 3 About sections in French');
    console.log('   - 3 Testimonials in French');
    console.log('   - 6 Appointment statuses in French');
    console.log('   - Site settings for Arinass Optique');
    console.log('   - Contact settings with your address/phone');
    console.log('   - Theme settings with brand colors');
    console.log('');
    console.log('🔐 You can now log in with admin@optique.com / admin123');
    console.log('👥 Staff users will have limited access to main business operations only.');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function seedPermissionsAndRoles() {
  // Create default permissions
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
    
    // About
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
    
    // Home
    { name: 'Create Home Content', description: 'Allow users to create new home page content', resource: 'home', action: 'create' },
    { name: 'Read Home Content', description: 'Allow users to view home page content', resource: 'home', action: 'read' },
    { name: 'Update Home Content', description: 'Allow users to modify home page content', resource: 'home', action: 'update' },
    { name: 'Delete Home Content', description: 'Allow users to delete home page content', resource: 'home', action: 'delete' },
    { name: 'Manage Home Content', description: 'Full home page content management capabilities', resource: 'home', action: 'manage' },
    
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

  // Create permissions (skip if already exist)
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
      await prisma.permission.create({ data: permission });
    }
  }

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Full system administrator with all permissions',
      isActive: true,
    },
  });

  const staffRole = await prisma.role.upsert({
    where: { name: 'staff' },
    update: {},
    create: {
      name: 'staff',
      description: 'Staff member with operational permissions',
      isActive: true,
    },
  });

  // Assign all permissions to admin role
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
        grantedBy: null,
      },
    });
  }

  // Assign "Activité Principale" permissions to staff role
  // Staff gets create, read, update permissions for: Products, Categories, Appointments, Customers, Testimonials, Services, Dashboard
  // Staff CANNOT: delete, manage permissions, manage users, access system settings
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
        grantedBy: null,
      },
    });
  }

  // Create admin user
  const adminEmail = 'admin@optique.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await prisma.user.create({
      data: {
        name: 'Administrateur Arinass',
        email: adminEmail,
        password: hashedPassword,
        isActive: true,
      },
    });

    await prisma.userRole.create({
      data: {
        userId: adminUser.id,
        roleId: adminRole.id,
        assignedBy: null,
      },
    });
  }
}

async function seedHomeValues() {
  const homeValues = [
    {
      title: 'Expertise',
      description: 'Notre équipe d\'opticiens expérimentés vous accompagne avec précision et professionnalisme',
      highlight: 'Plus de 15 ans d\'expérience',
      icon: 'Award',
      order: 1,
    },
    {
      title: 'Choix Varié',
      description: 'Un large éventail de montures haut de gamme et d\'options techniques pour répondre à chaque besoin',
      highlight: 'Plus de 500 références',
      icon: 'Star',
      order: 2,
    },
    {
      title: 'Proximité',
      description: 'Une boutique accessible et un service attentif pour un suivi de qualité au quotidien',
      highlight: 'Service personnalisé',
      icon: 'Heart',
      order: 3,
    },
  ];

  for (const value of homeValues) {
    // Check if a record with this title already exists
    const existing = await prisma.homeValues.findFirst({
      where: { title: value.title }
    });

    if (!existing) {
      await prisma.homeValues.create({ data: value });
    }
  }
}

async function seedFAQ() {
  const faqs = [
    {
      question: 'Quels sont vos horaires d\'ouverture ?',
      answer: 'Nous sommes ouverts du lundi au samedi de 9h00 à 13h00 et de 15h00 à 20h00. Le dimanche, nous sommes fermés.',
      order: 1,
    },
    {
      question: 'Proposez-vous des verres progressifs ?',
      answer: 'Oui, nous proposons une large gamme de verres progressifs, y compris les dernières innovations comme les verres Essilor Varilux X.',
      order: 2,
    },
    {
      question: 'Faites-vous des examens de la vue ?',
      answer: 'Nous collaborons avec des ophtalmologistes locaux pour les examens de la vue. Nous pouvons vous orienter vers des professionnels de confiance.',
      order: 3,
    },
    {
      question: 'Acceptez-vous les mutuelles ?',
      answer: 'Oui, nous acceptons la plupart des mutuelles. N\'hésitez pas à nous contacter pour vérifier la prise en charge de votre mutuelle.',
      order: 4,
    },
    {
      question: 'Quelle est la durée de garantie sur vos produits ?',
      answer: 'Nos lunettes bénéficient d\'une garantie de 2 ans sur les défauts de fabrication. Les verres ont une garantie adaptée selon le type.',
      order: 5,
    },
    {
      question: 'Proposez-vous des lentilles de contact ?',
      answer: 'Oui, nous proposons une gamme complète de lentilles de contact journalières, mensuelles et annuelles des plus grandes marques.',
      order: 6,
    },
    {
      question: 'Comment prendre rendez-vous ?',
      answer: 'Vous pouvez prendre rendez-vous en nous appelant au +212 606-970209, via WhatsApp, ou en vous rendant directement dans notre boutique.',
      order: 7,
    },
    {
      question: 'Où êtes-vous situés ?',
      answer: 'Nous sommes situés au n62, imm, 22 résidence difaf dcheira el jihadia inzegane, 86360, Morocco, au cœur d\'Agadir.',
      order: 8,
    },
  ];

  for (const faq of faqs) {
    // Check if a record with this question already exists
    const existing = await prisma.fAQ.findFirst({
      where: { question: faq.question }
    });

    if (!existing) {
      await prisma.fAQ.create({ data: faq });
    }
  }
}

async function seedAboutSections() {
  const aboutSections = [
    {
      title: 'Notre Histoire',
      content: 'Arinass Optique est né de la passion d\'une famille d\'opticiens pour offrir le meilleur service optique à Agadir. Depuis notre création, nous nous engageons à fournir des produits de qualité et un service personnalisé, en nous adaptant aux besoins de chaque client.',
      order: 1,
    },
    {
      title: 'Notre Mission',
      content: 'Notre mission est de vous accompagner dans votre parcours visuel avec professionnalisme et expertise. Nous croyons que chaque regard mérite une attention particulière et des solutions sur mesure, alliant esthétique, ergonomie et performance visuelle.',
      order: 2,
    },
    {
      title: 'Notre Équipe',
      content: 'Notre équipe d\'opticiens expérimentés combine expertise technique et sens du service client. Nous nous formons continuellement aux dernières innovations pour vous offrir les meilleures solutions et un accompagnement personnalisé dans le choix de vos équipements.',
      order: 3,
    },
  ];

  for (const section of aboutSections) {
    // Check if a record with this title already exists
    const existing = await prisma.aboutSection.findFirst({
      where: { title: section.title }
    });

    if (!existing) {
      await prisma.aboutSection.create({ data: section });
    }
  }
}

async function seedTestimonials() {
  const testimonials = [
    {
      name: 'Fatima Alami',
      message: 'Excellent service et conseils personnalisés. Mon opticien a pris le temps de comprendre mes besoins et m\'a proposé des montures parfaites. Je recommande vivement !',
      title: 'Cliente satisfaite',
      isActive: true,
    },
    {
      name: 'Ahmed Benjelloun',
      message: 'Arinass Optique est ma référence depuis 5 ans. Qualité des produits, professionnalisme de l\'équipe et prix compétitifs. Un service client exceptionnel !',
      title: 'Client fidèle',
      isActive: true,
    },
    {
      name: 'Amina Tazi',
      message: 'J\'ai trouvé mes lunettes de soleil parfaites ici. L\'équipe est très compétente et m\'a aidée à choisir selon ma morphologie. Très satisfaite !',
      title: 'Cliente ravie',
      isActive: true,
    },
  ];

  for (const testimonial of testimonials) {
    // Check if a record with this name and message already exists
    const existing = await prisma.testimonial.findFirst({
      where: { 
        AND: [
          { name: testimonial.name },
          { message: testimonial.message }
        ]
      }
    });

    if (!existing) {
      await prisma.testimonial.create({ data: testimonial });
    }
  }
}

async function seedAppointmentStatuses() {
  const appointmentStatuses = [
    {
      name: 'scheduled',
      displayName: 'Programmé',
      color: '#3b82f6', // Blue
      description: 'Rendez-vous programmé en attente de confirmation',
      order: 1,
      isActive: true,
    },
    {
      name: 'confirmed',
      displayName: 'Confirmé',
      color: '#10b981', // Green
      description: 'Rendez-vous confirmé par le client',
      order: 2,
      isActive: true,
    },
    {
      name: 'in-progress',
      displayName: 'En Cours',
      color: '#f59e0b', // Amber
      description: 'Rendez-vous en cours de réalisation',
      order: 3,
      isActive: true,
    },
    {
      name: 'completed',
      displayName: 'Terminé',
      color: '#059669', // Emerald
      description: 'Rendez-vous terminé avec succès',
      order: 4,
      isActive: true,
    },
    {
      name: 'cancelled',
      displayName: 'Annulé',
      color: '#ef4444', // Red
      description: 'Rendez-vous annulé par le client ou l\'établissement',
      order: 5,
      isActive: true,
    },
    {
      name: 'no-show',
      displayName: 'Absent',
      color: '#6b7280', // Gray
      description: 'Client absent au rendez-vous',
      order: 6,
      isActive: true,
    },
  ];

  for (const status of appointmentStatuses) {
    await prisma.appointmentStatus.upsert({
      where: { name: status.name },
      update: {},
      create: status,
    });
  }
}

async function seedSiteSettings() {
  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {
      siteName: 'Arinass Optique',
      slogan: 'Votre vision, notre passion',
    },
    create: {
      id: 'singleton',
      siteName: 'Arinass Optique',
      slogan: 'Votre vision, notre passion',
    },
  });
}

async function seedContactSettings() {
  await prisma.contactSettings.upsert({
    where: { id: 'singleton' },
    update: {
      contactEmail: 'optiquearinass@gmail.com',
      phone: '+212 606-970209',
      whatsapp: '+212 606-970209',
      address: 'n62, imm, 22 résidence difaf dcheira el jihadia inzegane, 86360, Morocco',
      city: 'Agadir',
      openingHours: 'Lundi - Samedi: 9h00 - 13h00, 15h00 - 20h00, Dimanche: Fermé',
      whatsappChatLink: 'https://wa.me/212606970209',
      googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // You'll need to add your actual API key
      googleMapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3444.123456789!2d-9.598107!3d30.427755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDI1JzM5LjkiTiA5wrAzNSc1My4yIlc!5e0!3m2!1sen!2sma!4v1234567890123!5m2!1sen!2sma',
      googleMapLink: 'https://maps.google.com/?q=n62,imm,22+résidence+difaf+dcheira+el+jihadia+inzegane,86360,Morocco',
      instagramLink: 'https://instagram.com/arinass_optique',
      facebookLink: 'https://facebook.com/arinass.optique',
    },
    create: {
      id: 'singleton',
      contactEmail: 'optiquearinass@gmail.com',
      phone: '+212 606-970209',
      whatsapp: '+212 606-970209',
      address: 'n62, imm, 22 résidence difaf dcheira el jihadia inzegane, 86360, Morocco',
      city: 'Agadir',
      openingHours: 'Lundi - Samedi: 9h00 - 13h00, 15h00 - 20h00, Dimanche: Fermé',
      whatsappChatLink: 'https://wa.me/212606970209',
      googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // You'll need to add your actual API key
      googleMapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3444.123456789!2d-9.598107!3d30.427755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDI1JzM5LjkiTiA5wrAzNSc1My4yIlc!5e0!3m2!1sen!2sma!4v1234567890123!5m2!1sen!2sma',
      googleMapLink: 'https://maps.google.com/?q=n62,imm,22+résidence+difaf+dcheira+el+jihadia+inzegane,86360,Morocco',
      instagramLink: 'https://instagram.com/arinass_optique',
      facebookLink: 'https://facebook.com/arinass.optique',
    },
  });
}

async function seedThemeSettings() {
  await prisma.themeSettings.upsert({
    where: { id: 'singleton' },
    update: {
      primaryColor: '#1A889D', // Your specified primary color
      secondaryColor: '#4A4A4A', // Your specified secondary color
    },
    create: {
      id: 'singleton',
      primaryColor: '#1A889D', // Your specified primary color
      secondaryColor: '#4A4A4A', // Your specified secondary color
    },
  });
}

async function seedServices() {
  const services = [
    {
      name: 'Examens Complets de la Vue',
      description: 'Consultations optométriques complètes avec tests de vision et prescription de verres correcteurs.',
      icon: 'Eye',
      order: 1,
    },
    {
      name: 'Adaptation de Lentilles de Contact',
      description: 'Fitting et adaptation personnalisée de lentilles de contact pour un confort optimal.',
      icon: 'Circle',
      order: 2,
    },
    {
      name: 'Sélection de Montures',
      description: 'Conseil personnalisé pour choisir la monture qui correspond à votre style et vos besoins.',
      icon: 'Glasses',
      order: 3,
    },
    {
      name: 'Réparation et Ajustement',
      description: 'Service de réparation et ajustement de vos lunettes pour un confort parfait.',
      icon: 'Wrench',
      order: 4,
    },
    {
      name: 'Lunettes de Soleil',
      description: 'Large gamme de lunettes de soleil avec protection UV et style tendance.',
      icon: 'Sun',
      order: 5,
    },
    {
      name: 'Suivi et Contrôles',
      description: 'Suivi régulier de votre vision et contrôles périodiques pour maintenir une vision optimale.',
      icon: 'Calendar',
      order: 6,
    },
  ];

  for (const service of services) {
    // Check if a record with this name already exists
    const existing = await prisma.service.findFirst({
      where: { name: service.name }
    });

    if (!existing) {
      await prisma.service.create({ data: service });
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  });
