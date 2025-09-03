const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function insertDefaultSettings() {
  try {
    const settings = await prisma.settings.upsert({
      where: { id: 'singleton' },
      update: {},
      create: {
        id: 'singleton',
        siteName: 'Optique App',
        slogan: 'Your Vision, Our Expertise',
        primaryColor: '#3b82f6', // Blue
        secondaryColor: '#f1f5f9', // Light gray
        contactEmail: 'contact@optique.com',
        phone: '+1 (555) 123-4567',
        whatsapp: '+1 (555) 123-4567',
        address: '123 Main Street, City, State 12345',
        openingHours: 'Mon-Fri 9:00 AM - 6:00 PM',
        googleMapsApiKey: '',
        whatsappChatLink: '',
        metaTitle: 'Optique App - Your Vision, Our Expertise',
        metaDescription: 'Discover premium eyewear and optical services at Optique App. Professional eye care and stylish frames for every vision need.',
        productMetaTitle: 'Products - {product_name} | Optique App',
        productMetaDescription: 'Explore {product_name} and other premium eyewear products. Quality frames and lenses for your perfect vision.',
        categoryMetaTitle: 'Category - {category_name} | Optique App',
        categoryMetaDescription: 'Browse {category_name} collection. Find the perfect eyewear for your style and vision needs.',
        ogImage: '',
        googleAnalyticsId: '',
        facebookPixelId: '',
        maintenanceMode: false,
      },
    });

    console.log('Default settings inserted:', settings);
  } catch (error) {
    console.error('Error inserting settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

insertDefaultSettings();
