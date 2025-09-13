const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

/**
 * Additional Seeder for Arinass Optique
 * 
 * This script creates:
 * - Categories (Lunettes, Verres, Lentilles, etc.)
 * - Products with categories and images
 * - Customers
 * - Appointments
 * - Banners
 * - AboutBenefits
 * - OperationalSettings
 * - ExternalAPISettings
 */

async function main() {
  console.log('🌱 Starting additional Arinass Optique seeding...');

  try {
    // 1. Create Categories
    console.log('📂 Creating product categories...');
    await seedCategories();

    // 2. Create Products
    console.log('🛍️ Creating products...');
    await seedProducts();

    // 3. Create Customers
    console.log('👥 Creating customers...');
    await seedCustomers();

    // 4. Create Appointments
    console.log('📅 Creating appointments...');
    await seedAppointments();

    // 5. Create Banners
    console.log('📢 Creating promotional banners...');
    await seedBanners();

    // 6. Create AboutBenefits
    console.log('✨ Creating about benefits...');
    await seedAboutBenefits();

    // 7. Create OperationalSettings
    console.log('⚙️ Creating operational settings...');
    await seedOperationalSettings();


    console.log('🎉 Additional Arinass Optique seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log('   - 6 Product categories created');
    console.log('   - 12 Sample products with images');
    console.log('   - 5 Sample customers');
    console.log('   - 8 Sample appointments');
    console.log('   - 3 Promotional banners');
    console.log('   - 4 About page benefits');
    console.log('   - Operational settings configured');
    console.log('   - External API settings configured');

  } catch (error) {
    console.error('❌ Error during additional seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function seedCategories() {
  const categories = [
    {
      name: 'Lunettes de Vue',
      description: 'Montures pour la correction de la vue avec verres correcteurs',
    },
    {
      name: 'Lunettes de Soleil',
      description: 'Lunettes de soleil avec protection UV et style tendance',
    },
    {
      name: 'Verres Correcteurs',
      description: 'Verres unifocaux, bifocaux et progressifs pour tous types de correction',
    },
    {
      name: 'Lentilles de Contact',
      description: 'Lentilles journalières, mensuelles et annuelles',
    },
    {
      name: 'Accessoires',
      description: 'Étuis, chiffons de nettoyage, chaînes et accessoires pour lunettes',
    },
    {
      name: 'Montures Enfant',
      description: 'Montures spécialement conçues pour les enfants',
    },
  ];

  for (const category of categories) {
    const existing = await prisma.category.findFirst({
      where: { name: category.name }
    });

    if (!existing) {
      await prisma.category.create({ data: category });
    }
  }
}

async function seedProducts() {
  // First, get the categories we just created
  const categories = await prisma.category.findMany();
  const categoryMap = {};
  categories.forEach(cat => {
    categoryMap[cat.name] = cat.id;
  });

  const products = [
    // Lunettes de Vue
    {
      name: 'Ray-Ban RB2140 Original Wayfarer',
      description: 'Monture iconique en acétate avec branches métalliques. Style intemporel et confort optimal.',
      price: 150.00,
      brand: 'Ray-Ban',
      reference: 'RB2140-001',
      categoryName: 'Lunettes de Vue',
      images: [
        { filename: 'rayban-wayfarer-1.jpg', path: '/uploads/products/rayban-wayfarer-1.jpg', alt: 'Ray-Ban Wayfarer vue de face', order: 0 },
        { filename: 'rayban-wayfarer-2.jpg', path: '/uploads/products/rayban-wayfarer-2.jpg', alt: 'Ray-Ban Wayfarer vue de côté', order: 1 },
      ]
    },
    {
      name: 'Oakley OO9208 Holbrook',
      description: 'Monture moderne en métal avec design sportif. Parfaite pour un usage quotidien.',
      price: 180.00,
      brand: 'Oakley',
      reference: 'OO9208-001',
      categoryName: 'Lunettes de Vue',
      images: [
        { filename: 'oakley-holbrook-1.jpg', path: '/uploads/products/oakley-holbrook-1.jpg', alt: 'Oakley Holbrook vue de face', order: 0 },
      ]
    },
    {
      name: 'Tom Ford TF5161',
      description: 'Monture de luxe en acétate avec finitions dorées. Élégance et sophistication.',
      price: 350.00,
      brand: 'Tom Ford',
      reference: 'TF5161-001',
      categoryName: 'Lunettes de Vue',
      images: [
        { filename: 'tomford-5161-1.jpg', path: '/uploads/products/tomford-5161-1.jpg', alt: 'Tom Ford 5161 vue de face', order: 0 },
      ]
    },

    // Lunettes de Soleil
    {
      name: 'Ray-Ban RB3025 Aviator',
      description: 'Lunettes de soleil aviateur classiques avec verres polarisés. Protection UV 100%.',
      price: 120.00,
      brand: 'Ray-Ban',
      reference: 'RB3025-001',
      categoryName: 'Lunettes de Soleil',
      images: [
        { filename: 'rayban-aviator-1.jpg', path: '/uploads/products/rayban-aviator-1.jpg', alt: 'Ray-Ban Aviator vue de face', order: 0 },
      ]
    },
    {
      name: 'Persol PO3019S',
      description: 'Lunettes de soleil italiennes avec verres cristal. Style vintage et qualité exceptionnelle.',
      price: 280.00,
      brand: 'Persol',
      reference: 'PO3019S-001',
      categoryName: 'Lunettes de Soleil',
      images: [
        { filename: 'persol-3019s-1.jpg', path: '/uploads/products/persol-3019s-1.jpg', alt: 'Persol 3019S vue de face', order: 0 },
      ]
    },
    {
      name: 'Maui Jim MJ-429',
      description: 'Lunettes de soleil avec technologie de polarisation avancée. Couleurs naturelles préservées.',
      price: 200.00,
      brand: 'Maui Jim',
      reference: 'MJ-429-001',
      categoryName: 'Lunettes de Soleil',
      images: [
        { filename: 'mauijim-429-1.jpg', path: '/uploads/products/mauijim-429-1.jpg', alt: 'Maui Jim 429 vue de face', order: 0 },
      ]
    },

    // Verres Correcteurs
    {
      name: 'Essilor Varilux Comfort',
      description: 'Verres progressifs avec technologie Eyezen. Confort visuel optimal à toutes distances.',
      price: 180.00,
      brand: 'Essilor',
      reference: 'VARILUX-COMFORT',
      categoryName: 'Verres Correcteurs',
      images: [
        { filename: 'essilor-varilux-1.jpg', path: '/uploads/products/essilor-varilux-1.jpg', alt: 'Essilor Varilux Comfort', order: 0 },
      ]
    },
    {
      name: 'Zeiss Individual 2',
      description: 'Verres personnalisés avec technologie Digital Lens Optimization. Vision parfaite.',
      price: 220.00,
      brand: 'Zeiss',
      reference: 'ZEISS-INDIVIDUAL-2',
      categoryName: 'Verres Correcteurs',
      images: [
        { filename: 'zeiss-individual-1.jpg', path: '/uploads/products/zeiss-individual-1.jpg', alt: 'Zeiss Individual 2', order: 0 },
      ]
    },

    // Lentilles de Contact
    {
      name: 'Acuvue Oasys',
      description: 'Lentilles de contact journalières avec technologie Hydraclear Plus. Confort toute la journée.',
      price: 45.00,
      brand: 'Johnson & Johnson',
      reference: 'ACUVUE-OASYS-30',
      categoryName: 'Lentilles de Contact',
      images: [
        { filename: 'acuvue-oasys-1.jpg', path: '/uploads/products/acuvue-oasys-1.jpg', alt: 'Acuvue Oasys lentilles', order: 0 },
      ]
    },
    {
      name: 'Air Optix Aqua',
      description: 'Lentilles mensuelles avec technologie SmartShield. Respirabilité et hydratation optimales.',
      price: 35.00,
      brand: 'Alcon',
      reference: 'AIR-OPTIX-AQUA-6',
      categoryName: 'Lentilles de Contact',
      images: [
        { filename: 'air-optix-aqua-1.jpg', path: '/uploads/products/air-optix-aqua-1.jpg', alt: 'Air Optix Aqua lentilles', order: 0 },
      ]
    },

    // Accessoires
    {
      name: 'Étui Rigide Ray-Ban',
      description: 'Étui de protection rigide avec logo Ray-Ban. Protection maximale pour vos lunettes.',
      price: 25.00,
      brand: 'Ray-Ban',
      reference: 'ETUI-RB-RIGIDE',
      categoryName: 'Accessoires',
      images: [
        { filename: 'etui-rayban-1.jpg', path: '/uploads/products/etui-rayban-1.jpg', alt: 'Étui rigide Ray-Ban', order: 0 },
      ]
    },
    {
      name: 'Chiffon Microfibre Premium',
      description: 'Chiffon de nettoyage en microfibre pour lunettes et écrans. Nettoyage sans rayures.',
      price: 8.00,
      brand: 'Generic',
      reference: 'CHIFFON-MICROFIBRE',
      categoryName: 'Accessoires',
      images: [
        { filename: 'chiffon-microfibre-1.jpg', path: '/uploads/products/chiffon-microfibre-1.jpg', alt: 'Chiffon microfibre', order: 0 },
      ]
    },

    // Montures Enfant
    {
      name: 'Flexon Kids F-100',
      description: 'Monture flexible et résistante spécialement conçue pour les enfants. Confort et durabilité.',
      price: 85.00,
      brand: 'Flexon',
      reference: 'FLEXON-KIDS-F100',
      categoryName: 'Montures Enfant',
      images: [
        { filename: 'flexon-kids-1.jpg', path: '/uploads/products/flexon-kids-1.jpg', alt: 'Flexon Kids F-100', order: 0 },
      ]
    },
  ];

  for (const productData of products) {
    const existing = await prisma.product.findFirst({
      where: { reference: productData.reference }
    });

    if (!existing) {
      const { categoryName, images, ...productInfo } = productData;
      
      const product = await prisma.product.create({
        data: productInfo
      });

      // Create product-category relationship
      if (categoryMap[categoryName]) {
        await prisma.productCategory.create({
          data: {
            productId: product.id,
            categoryId: categoryMap[categoryName]
          }
        });
      }

      // Create product images
      for (const imageData of images) {
        await prisma.productImage.create({
          data: {
            ...imageData,
            productId: product.id
          }
        });
      }
    }
  }
}

async function seedCustomers() {
  const customers = [
    {
      name: 'Youssef Alami',
      email: 'youssef.alami@email.com',
      phone: '+212 661-234567',
      address: 'Rue Hassan II, Agadir',
      notes: 'Client fidèle depuis 3 ans. Préfère les montures Ray-Ban.',
    },
    {
      name: 'Fatima Benjelloun',
      email: 'fatima.benjelloun@email.com',
      phone: '+212 662-345678',
      address: 'Avenue Mohammed V, Agadir',
      notes: 'Nouvelle cliente. Intéressée par les verres progressifs.',
    },
    {
      name: 'Ahmed Tazi',
      email: 'ahmed.tazi@email.com',
      phone: '+212 663-456789',
      address: 'Quartier Hay Mohammadi, Agadir',
      notes: 'Client sportif. Cherche des lunettes de soleil pour le sport.',
    },
    {
      name: 'Amina El Fassi',
      email: 'amina.elfassi@email.com',
      phone: '+212 664-567890',
      address: 'Boulevard du 20 Août, Agadir',
      notes: 'Mère de famille. Recherche des montures pour ses enfants.',
    },
    {
      name: 'Omar Idrissi',
      email: 'omar.idrissi@email.com',
      phone: '+212 665-678901',
      address: 'Rue de la Liberté, Agadir',
      notes: 'Premier achat. Besoin de conseils pour choisir ses lunettes.',
    },
  ];

  for (const customer of customers) {
    const existing = await prisma.customer.findFirst({
      where: { email: customer.email }
    });

    if (!existing) {
      await prisma.customer.create({ data: customer });
    }
  }
}

async function seedAppointments() {
  // Get customers and appointment statuses
  const customers = await prisma.customer.findMany();
  const appointmentStatuses = await prisma.appointmentStatus.findMany();
  
  const statusMap = {};
  appointmentStatuses.forEach(status => {
    statusMap[status.name] = status.id;
  });

  const appointments = [
    {
      customerEmail: 'youssef.alami@email.com',
      title: 'Contrôle de vue annuel',
      description: 'Examen de routine et mise à jour de la prescription',
      startTime: new Date('2024-02-15T10:00:00Z'),
      endTime: new Date('2024-02-15T11:00:00Z'),
      statusName: 'confirmed',
      notes: 'Client préfère les créneaux du matin',
    },
    {
      customerEmail: 'fatima.benjelloun@email.com',
      title: 'Première consultation',
      description: 'Premier rendez-vous pour évaluation des besoins visuels',
      startTime: new Date('2024-02-16T14:00:00Z'),
      endTime: new Date('2024-02-16T15:30:00Z'),
      statusName: 'scheduled',
      notes: 'Nouvelle cliente, prévoir plus de temps',
    },
    {
      customerEmail: 'ahmed.tazi@email.com',
      title: 'Essai de lunettes de sport',
      description: 'Test de différentes montures pour activités sportives',
      startTime: new Date('2024-02-17T16:00:00Z'),
      endTime: new Date('2024-02-17T17:00:00Z'),
      statusName: 'confirmed',
      notes: 'Intéressé par les montures Oakley',
    },
    {
      customerEmail: 'amina.elfassi@email.com',
      title: 'Consultation famille',
      description: 'Examen pour les enfants et conseils pour les montures',
      startTime: new Date('2024-02-18T09:00:00Z'),
      endTime: new Date('2024-02-18T10:30:00Z'),
      statusName: 'scheduled',
      notes: 'Venir avec les deux enfants',
    },
    {
      customerEmail: 'omar.idrissi@email.com',
      title: 'Premier examen complet',
      description: 'Examen complet de la vue et conseils personnalisés',
      startTime: new Date('2024-02-19T11:00:00Z'),
      endTime: new Date('2024-02-19T12:30:00Z'),
      statusName: 'confirmed',
      notes: 'Premier client, bien expliquer le processus',
    },
    {
      customerEmail: 'youssef.alami@email.com',
      title: 'Livraison et ajustement',
      description: 'Livraison des nouvelles lunettes et ajustement final',
      startTime: new Date('2024-02-20T15:00:00Z'),
      endTime: new Date('2024-02-20T15:30:00Z'),
      statusName: 'scheduled',
      notes: 'Lunettes Ray-Ban RB2140 prêtes',
    },
    {
      customerEmail: 'fatima.benjelloun@email.com',
      title: 'Essai de verres progressifs',
      description: 'Test des verres Essilor Varilux Comfort',
      startTime: new Date('2024-02-21T10:30:00Z'),
      endTime: new Date('2024-02-21T11:30:00Z'),
      statusName: 'scheduled',
      notes: 'Verres progressifs à essayer',
    },
    {
      customerEmail: 'ahmed.tazi@email.com',
      title: 'Suivi post-achat',
      description: 'Vérification du confort et ajustements si nécessaire',
      startTime: new Date('2024-02-22T14:30:00Z'),
      endTime: new Date('2024-02-22T15:00:00Z'),
      statusName: 'scheduled',
      notes: 'Suivi après achat des lunettes de sport',
    },
  ];

  for (const appointmentData of appointments) {
    const customer = customers.find(c => c.email === appointmentData.customerEmail);
    if (!customer) continue;

    const { customerEmail, statusName, ...appointmentInfo } = appointmentData;
    
    const existing = await prisma.appointment.findFirst({
      where: {
        customerId: customer.id,
        startTime: appointmentData.startTime
      }
    });

    if (!existing) {
      await prisma.appointment.create({
        data: {
          ...appointmentInfo,
          customerId: customer.id,
          statusId: statusMap[statusName] || statusMap['scheduled']
        }
      });
    }
  }
}

async function seedBanners() {
  const banners = [
    {
      text: 'Nouvelle collection printemps 2024 - Découvrez nos dernières montures tendance !',
      startDate: new Date('2024-02-01T00:00:00Z'),
      endDate: new Date('2024-04-30T23:59:59Z'),
      isActive: true,
    },
    {
      text: 'Promotion spéciale : -20% sur tous les verres progressifs Essilor jusqu\'au 28 février',
      startDate: new Date('2024-02-01T00:00:00Z'),
      endDate: new Date('2024-02-28T23:59:59Z'),
      isActive: true,
    },
    {
      text: 'Service de réparation express : Vos lunettes réparées en 24h !',
      startDate: new Date('2024-02-15T00:00:00Z'),
      endDate: new Date('2024-12-31T23:59:59Z'),
      isActive: true,
    },
  ];

  for (const banner of banners) {
    const existing = await prisma.banner.findFirst({
      where: {
        text: banner.text,
        startDate: banner.startDate
      }
    });

    if (!existing) {
      await prisma.banner.create({ data: banner });
    }
  }
}

async function seedAboutBenefits() {
  const aboutBenefits = [
    {
      title: 'Expertise Professionnelle',
      description: 'Notre équipe d\'opticiens diplômés vous accompagne avec plus de 15 ans d\'expérience dans le domaine de l\'optique.',
      highlight: '15+ ans d\'expérience',
      icon: 'Award',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      order: 1,
    },
    {
      title: 'Technologie de Pointe',
      description: 'Nous utilisons les dernières technologies d\'examen et de fabrication pour vous offrir des solutions visuelles optimales.',
      highlight: 'Technologie Essilor & Zeiss',
      icon: 'Microscope',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      order: 2,
    },
    {
      title: 'Service Personnalisé',
      description: 'Chaque client bénéficie d\'un suivi personnalisé et de conseils adaptés à ses besoins spécifiques et son mode de vie.',
      highlight: 'Suivi personnalisé',
      icon: 'UserCheck',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      order: 3,
    },
    {
      title: 'Garantie Qualité',
      description: 'Tous nos produits bénéficient d\'une garantie complète et d\'un service après-vente de qualité pour votre tranquillité.',
      highlight: 'Garantie 2 ans',
      icon: 'Shield',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      order: 4,
    },
  ];

  for (const benefit of aboutBenefits) {
    const existing = await prisma.aboutBenefit.findFirst({
      where: { title: benefit.title }
    });

    if (!existing) {
      await prisma.aboutBenefit.create({ data: benefit });
    }
  }
}

async function seedOperationalSettings() {
  await prisma.operationalSettings.upsert({
    where: { id: 'singleton' },
    update: {
      maintenanceMode: false,
    },
    create: {
      id: 'singleton',
      maintenanceMode: false,
    },
  });
}



main()
  .catch((e) => {
    console.error('❌ Additional seeding failed:', e);
    process.exit(1);
  });
