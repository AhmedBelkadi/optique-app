const { execSync } = require('child_process');
const path = require('path');

/**
 * Run All Seeders for Arinass Optique
 * 
 * This script runs both the docker-seed.js and additional-seed.js files
 * to completely populate the database with all necessary data.
 */

console.log('🌱 Starting complete Arinass Optique database seeding...');
console.log('');

try {
  // Run the main docker seeder first
  console.log('📦 Running main docker seeder...');
  execSync('node scripts/docker-seed.js', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('');
  console.log('✅ Main docker seeder completed successfully!');
  console.log('');

  // Run the additional seeder
  console.log('📦 Running additional seeder...');
  execSync('node scripts/additional-seed.js', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('');
  console.log('✅ Additional seeder completed successfully!');
  console.log('');

  console.log('🎉 Complete database seeding finished!');
  console.log('');
  console.log('📊 Your Arinass Optique database now contains:');
  console.log('   ✅ Admin user and permissions system');
  console.log('   ✅ Home values and FAQ content');
  console.log('   ✅ About sections and testimonials');
  console.log('   ✅ Appointment statuses and services');
  console.log('   ✅ Site, contact, and theme settings');
  console.log('   ✅ Product categories and products');
  console.log('   ✅ Customer records and appointments');
  console.log('   ✅ Promotional banners');
  console.log('   ✅ About page benefits');
  console.log('   ✅ Operational and API settings');
  console.log('');
  console.log('🔐 Admin login: optiquearinass@gmail.com / Admin123!@#');
  console.log('🚀 Your application is ready to use!');

} catch (error) {
  console.error('❌ Seeding failed:', error.message);
  process.exit(1);
}
