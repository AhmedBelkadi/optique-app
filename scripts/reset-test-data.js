require('dotenv').config();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Quick Test Data Reset Script
 * 
 * This script quickly clears all test data without recreating it.
 * Useful when you want to start fresh during testing.
 * 
 * Run this when you want to reset to a clean state.
 */

async function main() {
  console.log('🧹 Resetting test data...');

  try {
    // Clear all data in reverse dependency order
    console.log('🗑️ Clearing existing data...');
    
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
    
    console.log('✅ All test data cleared successfully!');
    console.log('💡 Run "npm run setup-test-env" to recreate test data');

  } catch (error) {
    console.error('❌ Error resetting test data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('🎉 Test data reset completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test data reset failed:', error);
    process.exit(1);
  });
