const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

/**
 * Debug script to check image upload issues in production
 * 
 * This script helps diagnose:
 * - File system permissions
 * - Directory structure
 * - Database connectivity
 * - Upload directory status
 */

async function debugImageUpload() {
  console.log('🔍 Starting image upload debug...');
  console.log('');

  try {
    // 1. Check current working directory
    console.log('📁 Current working directory:', process.cwd());
    
    // 2. Check uploads directory structure
    const uploadsBase = path.join(process.cwd(), 'uploads');
    console.log('📂 Uploads base directory:', uploadsBase);
    console.log('   - Exists:', fs.existsSync(uploadsBase));
    
    if (fs.existsSync(uploadsBase)) {
      const uploadsContents = fs.readdirSync(uploadsBase);
      console.log('   - Contents:', uploadsContents);
      
      // Check each subdirectory
      for (const subdir of uploadsContents) {
        const subdirPath = path.join(uploadsBase, subdir);
        const stat = fs.statSync(subdirPath);
        if (stat.isDirectory()) {
          const subdirContents = fs.readdirSync(subdirPath);
          console.log(`   - ${subdir}/: ${subdirContents.length} files`);
        }
      }
    }
    
    // 3. Check site-settings directory specifically
    const siteSettingsDir = path.join(uploadsBase, 'site-settings');
    console.log('🎯 Site settings directory:', siteSettingsDir);
    console.log('   - Exists:', fs.existsSync(siteSettingsDir));
    
    if (fs.existsSync(siteSettingsDir)) {
      const siteSettingsContents = fs.readdirSync(siteSettingsDir);
      console.log('   - Files:', siteSettingsContents);
    }
    
    // 4. Test directory creation permissions
    console.log('🔧 Testing directory creation...');
    const testDir = path.join(uploadsBase, 'test-debug');
    try {
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
        console.log('   ✅ Successfully created test directory');
        
        // Test file creation
        const testFile = path.join(testDir, 'test.txt');
        fs.writeFileSync(testFile, 'test content');
        console.log('   ✅ Successfully created test file');
        
        // Cleanup
        fs.unlinkSync(testFile);
        fs.rmdirSync(testDir);
        console.log('   ✅ Successfully cleaned up test files');
      }
    } catch (error) {
      console.log('   ❌ Failed to create test directory:', error.message);
    }
    
    // 5. Check database connectivity
    console.log('🗄️ Testing database connectivity...');
    try {
      const siteSettings = await prisma.siteSettings.findUnique({
        where: { id: 'singleton' }
      });
      console.log('   ✅ Database connection successful');
      console.log('   - Site settings exist:', !!siteSettings);
      if (siteSettings) {
        console.log('   - Current logo URL:', siteSettings.logoUrl);
        console.log('   - Current hero background:', siteSettings.heroBackgroundImg);
        console.log('   - Current about image:', siteSettings.imageAboutSection);
      }
    } catch (error) {
      console.log('   ❌ Database connection failed:', error.message);
    }
    
    // 6. Check environment variables
    console.log('🌍 Environment check:');
    console.log('   - NODE_ENV:', process.env.NODE_ENV);
    console.log('   - DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('   - UPLOAD_DIR:', process.env.UPLOAD_DIR || 'not set (using default)');
    
    // 7. Check file system permissions
    console.log('🔐 File system permissions:');
    try {
      const permissions = fs.constants;
      console.log('   - Read permission:', permissions.R_OK);
      console.log('   - Write permission:', permissions.W_OK);
      console.log('   - Execute permission:', permissions.X_OK);
    } catch (error) {
      console.log('   ❌ Failed to check permissions:', error.message);
    }
    
    console.log('');
    console.log('✅ Debug completed successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log('   - Check if uploads directory exists and is writable');
    console.log('   - Verify database connectivity');
    console.log('   - Ensure proper file permissions');
    console.log('   - Check server logs for detailed error messages');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugImageUpload()
  .catch((e) => {
    console.error('❌ Debug script failed:', e);
    process.exit(1);
  });
