# 🧪 **OPTIQUE APP - COMPREHENSIVE TESTING CHECKLIST**
## **Manual Testing Guide for All Features**

---

## 🚀 **QUICK START - SETUP TEST ENVIRONMENT**

### **Step 1: Database Setup**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Set up complete test environment
npm run setup-test-env
```

### **Step 2: Test Account Credentials**
- **Admin**: `admin@test.com` / `testpassword123` (Full access)
- **Staff**: `staff@test.com` / `testpassword123` (Business features only)
- **User**: `user@test.com` / `testpassword123` (Read-only access)

### **Step 3: Reset When Needed**
```bash
# Quick reset of test data
npm run reset-test-data

# Recreate test environment
npm run setup-test-env
```

---

## 🔐 **MODULE 1: AUTHENTICATION & ACCESS CONTROL**

### **1.1 Login System Testing**

#### **Valid Login Scenarios**
- [ ] **Admin Login**
  - [ ] Login with `admin@test.com` / `testpassword123`
  - [ ] Verify redirect to `/admin/`
  - [ ] Check admin dashboard access

- [ ] **Staff Login**
  - [ ] Login with `staff@test.com` / `testpassword123`
  - [ ] Verify redirect to `/admin/`
  - [ ] Check limited admin access

- [ ] **Session Management**
  - [ ] Test session persistence after browser refresh
  - [ ] Test session timeout (if configured)
  - [ ] Test logout functionality

#### **Invalid Login Scenarios**
- [ ] **Wrong Email Format**
  - [ ] `test@` (missing domain)
  - [ ] `test@invalid` (invalid domain)
  - [ ] `test@.com` (missing subdomain)
  - [ ] Very long email (>255 characters)

- [ ] **Wrong Password**
  - [ ] Empty password
  - [ ] Too short password (<6 characters)
  - [ ] Too long password (>100 characters)
  - [ ] Wrong password for existing account

- [ ] **Non-existent Account**
  - [ ] `fake@email.com` with any password
  - [ ] Verify appropriate error message

#### **Security Testing**
- [ ] **CSRF Protection**
  - [ ] Try submitting login form without CSRF token
  - [ ] Verify security error message
  - [ ] Test with expired/invalid token

- [ ] **Rate Limiting**
  - [ ] Submit login form rapidly (10+ times in 1 minute)
  - [ ] Verify rate limit error message
  - [ ] Wait for cooldown period

- [ ] **SQL Injection Attempts**
  - [ ] `' OR '1'='1` in email field
  - [ ] `admin'--` in email field
  - [ ] Verify no SQL errors are exposed

### **1.2 Access Control Testing**

#### **Admin Role Testing**
- [ ] **Full Access Verification**
  - [ ] Access `/admin/users` (User management)
  - [ ] Access `/admin/roles` (Role management)
  - [ ] Access `/admin/permissions` (Permission management)
  - [ ] Access `/admin/settings` (System settings)

- [ ] **User Management**
  - [ ] Create new user account
  - [ ] Edit existing user details
  - [ ] Assign/remove roles from users
  - [ ] Delete user accounts

#### **Staff Role Testing**
- [ ] **Limited Access Verification**
  - [ ] Access `/admin/appointments` ✅
  - [ ] Access `/admin/customers` ✅
  - [ ] Access `/admin/products` ✅
  - [ ] Access `/admin/users` ❌ (Should be denied)
  - [ ] Access `/admin/settings` ❌ (Should be denied)

#### **Public Access Testing**
- [ ] **Unauthenticated Access**
  - [ ] Try accessing `/admin/*` without login
  - [ ] Verify redirect to login page
  - [ ] Check no sensitive data is exposed

---

## 📅 **MODULE 2: APPOINTMENT MANAGEMENT**

### **2.1 Public Appointment Booking**

#### **Form Validation Testing**
- [ ] **Required Fields**
  - [ ] Submit empty form
  - [ ] Test each field individually (name, email, phone, date, time)
  - [ ] Verify appropriate error messages

- [ ] **Email Validation**
  - [ ] `test@` (invalid format)
  - [ ] `test@invalid` (invalid domain)
  - [ ] Very long email addresses
  - [ ] Special characters in email

- [ ] **Phone Validation**
  - [ ] `123` (too short)
  - [ ] `1234567890` (valid format)
  - [ ] `+33 1 23 45 67 89` (international format)
  - [ ] Special characters in phone

- [ ] **Name Validation**
  - [ ] Single character names
  - [ ] Very long names (>100 characters)
  - [ ] Names with special characters
  - [ ] Names with numbers

- [ ] **Date Validation**
  - [ ] Past dates
  - [ ] Future dates (>3 months)
  - [ ] Invalid date formats
  - [ ] Weekend dates (Saturday/Sunday)

#### **Business Rules Testing**
- [ ] **Business Hours**
  - [ ] Try booking at 8:00 AM (before opening)
  - [ ] Try booking at 7:30 PM (before closing)
  - [ ] Try booking at 8:00 PM (after closing)
  - [ ] Verify appropriate error messages

- [ ] **Time Slot Validation**
  - [ ] Test all available time slots (9:00, 9:30, 10:00, etc.)
  - [ ] Try invalid time formats
  - [ ] Test 30-minute intervals

- [ ] **Duration Limits**
  - [ ] Try 10 minutes (too short)
  - [ ] Try 9 hours (too long)
  - [ ] Test valid durations (15 minutes to 8 hours)

#### **Appointment Reasons Testing**
- [ ] **Valid Reasons**
  - [ ] Eye test
  - [ ] Frame fitting
  - [ ] Contact lens consultation
  - [ ] Repair
  - [ ] General consultation
  - [ ] Other

- [ ] **Form Submission**
  - [ ] Complete valid appointment booking
  - [ ] Verify success message
  - [ ] Check appointment confirmation details
  - [ ] Test error handling (network errors, server errors)

### **2.2 Admin Appointment Management**

#### **Appointment CRUD Operations**
- [ ] **Create Appointment**
  - [ ] Add new appointment manually
  - [ ] Select customer from existing list
  - [ ] Set date, time, duration, reason
  - [ ] Add notes and special instructions

- [ ] **Read Appointment**
  - [ ] View appointment list
  - [ ] Search appointments by customer name
  - [ ] Filter by date range
  - [ ] Filter by status
  - [ ] View appointment details

- [ ] **Update Appointment**
  - [ ] Change appointment date/time
  - [ ] Update status (pending → confirmed → completed)
  - [ ] Modify customer information
  - [ ] Update notes and instructions

- [ ] **Delete Appointment**
  - [ ] Soft delete appointment
  - [ ] Verify appointment is hidden but not permanently deleted
  - [ ] Test restore functionality

#### **Appointment Status Management**
- [ ] **Status Transitions**
  - [ ] Pending → Confirmed
  - [ ] Confirmed → In Progress
  - [ ] In Progress → Completed
  - [ ] Any status → Cancelled
  - [ ] Test invalid status transitions

- [ ] **Bulk Operations**
  - [ ] Select multiple appointments
  - [ ] Update status for multiple appointments
  - [ ] Send notifications to multiple customers

#### **Customer Management**
- [ ] **Customer Search**
  - [ ] Search by name (partial match)
  - [ ] Search by email
  - [ ] Search by phone number
  - [ ] Search by address

- [ ] **Customer History**
  - [ ] View all appointments for a customer
  - [ ] Check appointment history timeline
  - [ ] View customer notes and preferences

---

## 🛍️ **MODULE 3: PRODUCT & CATEGORY MANAGEMENT**

### **3.1 Product Management**

#### **Product CRUD Operations**
- [ ] **Create Product**
  - [ ] Add new product with all required fields
  - [ ] Test name validation (length limits)
  - [ ] Test price validation (positive numbers, maximum limits)
  - [ ] Test brand and reference validation
  - [ ] Assign product to categories

- [ ] **Product Validation**
  - [ ] Empty product name
  - [ ] Very long product names (>100 characters)
  - [ ] Negative prices
  - [ ] Very high prices (>999,999)
  - [ ] Duplicate reference numbers

- [ ] **Image Management**
  - [ ] Upload single product image
  - [ ] Upload multiple product images
  - [ ] Test different image formats (JPG, PNG, GIF)
  - [ ] Test large image files
  - [ ] Test image ordering and alt text

#### **Product Display**
- [ ] **Public Product Page**
  - [ ] View product listing page
  - [ ] Test product filtering by category
  - [ ] Test product search functionality
  - [ ] Test product sorting (price, name, date)
  - [ ] Test pagination for large product lists

- [ ] **Product Details**
  - [ ] View individual product page
  - [ ] Check product images display
  - [ ] Verify product information accuracy
  - [ ] Test responsive design on mobile

### **3.2 Category Management**

#### **Category Operations**
- [ ] **Category Creation**
  - [ ] Create new category
  - [ ] Test name validation (length limits)
  - [ ] Add category description
  - [ ] Upload category image

- [ ] **Category Assignment**
  - [ ] Assign products to categories
  - [ ] Test multiple category assignments
  - [ ] Verify category-product relationships

- [ ] **Category Display**
  - [ ] View category listing page
  - [ ] Test category filtering
  - [ ] Verify products display correctly in categories

---

## 📝 **MODULE 4: CMS & CONTENT MANAGEMENT**

### **4.1 Page Content Management**

#### **Home Page Management**
- [ ] **Hero Section**
  - [ ] Edit hero title and subtitle
  - [ ] Change hero background image
  - [ ] Update CTA button text and links
  - [ ] Test responsive design

- [ ] **Content Sections**
  - [ ] Add new content section
  - [ ] Edit existing section content
  - [ ] Reorder sections using drag & drop
  - [ ] Delete content sections

#### **About Page Management**
- [ ] **Company Information**
  - [ ] Edit company history and story
  - [ ] Update team information
  - [ ] Change company photos
  - [ ] Update contact information

- [ ] **Benefits Section**
  - [ ] Add new benefit feature
  - [ ] Edit benefit descriptions
  - [ ] Change benefit icons and colors
  - [ ] Reorder benefits

### **4.2 SEO & Meta Management**

#### **SEO Optimization**
- [ ] **Meta Titles**
  - [ ] Edit page meta titles
  - [ ] Test length limits (50-60 characters)
  - [ ] Verify title display in search results

- [ ] **Meta Descriptions**
  - [ ] Edit page meta descriptions
  - [ ] Test length limits (150-160 characters)
  - [ ] Check character count display

- [ ] **Keywords**
  - [ ] Add relevant keywords for each page
  - [ ] Test keyword density
  - [ ] Verify keyword optimization

#### **Content Publishing**
- [ ] **Draft vs Published**
  - [ ] Test content preview functionality
  - [ ] Switch between draft and published states
  - [ ] Verify content changes are saved

- [ ] **Content Versioning**
  - [ ] View content edit history
  - [ ] Revert to previous versions
  - [ ] Compare different versions

---

## 👥 **MODULE 5: CUSTOMER & TESTIMONIAL MANAGEMENT**

### **5.1 Customer Management**

#### **Customer Database**
- [ ] **Customer Creation**
  - [ ] Add new customer manually
  - [ ] Test required field validation
  - [ ] Add customer notes and preferences
  - [ ] Upload customer photos

- [ ] **Customer Search**
  - [ ] Search by name (partial match)
  - [ ] Search by email address
  - [ ] Search by phone number
  - [ ] Search by address

- [ ] **Customer Profiles**
  - [ ] View complete customer information
  - [ ] Edit customer details
  - [ ] Add customer notes
  - [ ] View customer history

#### **Customer Communication**
- [ ] **Communication Preferences**
  - [ ] Set preferred contact method
  - [ ] Set communication frequency
  - [ ] Add special instructions
  - [ ] Test notification preferences

### **5.2 Testimonial Management**

#### **Testimonial Operations**
- [ ] **Testimonial Creation**
  - [ ] Add customer testimonial
  - [ ] Test content validation
  - [ ] Upload customer photo
  - [ ] Set testimonial status

- [ ] **Content Moderation**
  - [ ] Approve pending testimonials
  - [ ] Reject inappropriate content
  - [ ] Edit testimonial content
  - [ ] Set testimonial display order

#### **Testimonial Display**
- [ ] **Public Display**
  - [ ] View testimonials on public page
  - [ ] Test testimonial filtering
  - [ ] Verify responsive design
  - [ ] Check testimonial pagination

---

## ⚙️ **MODULE 6: SETTINGS & CONFIGURATION**

### **6.1 System Settings**

#### **General Settings**
- [ ] **Company Information**
  - [ ] Update business name and slogan
  - [ ] Change company logo
  - [ ] Update business address
  - [ ] Modify contact information

- [ ] **Business Hours**
  - [ ] Set operating hours
  - [ ] Configure holiday schedules
  - [ ] Set appointment availability
  - [ ] Test business hour validation

#### **Appointment Settings**
- [ ] **Default Configuration**
  - [ ] Set default appointment duration
  - [ ] Configure buffer time between appointments
  - [ ] Set cancellation policy
  - [ ] Configure notification preferences

### **6.2 Theme & Design Settings**

#### **Visual Configuration**
- [ ] **Color Scheme**
  - [ ] Change primary colors
  - [ ] Update secondary colors
  - [ ] Modify accent colors
  - [ ] Test color contrast accessibility

- [ ] **Typography**
  - [ ] Change font families
  - [ ] Adjust font sizes
  - [ ] Modify font weights
  - [ ] Test text readability

#### **Layout Options**
- [ ] **Page Layouts**
  - [ ] Test different page structures
  - [ ] Modify section layouts
  - [ ] Adjust spacing and margins
  - [ ] Test responsive breakpoints

---

## 📊 **MODULE 7: PERFORMANCE & STRESS TESTING**

### **7.1 Load Testing**

#### **Concurrent Users**
- [ ] **User Load**
  - [ ] Test with 10 simultaneous users
  - [ ] Test with 50 simultaneous users
  - [ ] Test with 100 simultaneous users
  - [ ] Monitor system performance

#### **Database Performance**
- [ ] **Data Volume**
  - [ ] Test with 1000+ products
  - [ ] Test with 1000+ customers
  - [ ] Test with 1000+ appointments
  - [ ] Monitor query performance

### **7.2 Mobile Performance**

#### **Mobile Testing**
- [ ] **Device Testing**
  - [ ] Test on iPhone (various models)
  - [ ] Test on Android devices
  - [ ] Test on tablets (iPad, Android)
  - [ ] Test responsive design

- [ ] **Performance**
  - [ ] Test loading times on 3G
  - [ ] Test loading times on 4G
  - [ ] Test offline functionality
  - [ ] Monitor mobile performance

---

## 🐛 **MODULE 8: ERROR HANDLING & EDGE CASES**

### **8.1 Error Scenarios**

#### **Network Errors**
- [ ] **Connection Issues**
  - [ ] Test offline functionality
  - [ ] Test slow network conditions
  - [ ] Test network timeouts
  - [ ] Verify error messages

#### **Server Errors**
- [ ] **Error Handling**
  - [ ] Test 500 server errors
  - [ ] Test 404 not found errors
  - [ ] Test 403 forbidden errors
  - [ ] Verify user-friendly error pages

### **8.2 Edge Cases**

#### **Input Validation**
- [ ] **Extreme Inputs**
  - [ ] Test very long text inputs
  - [ ] Test special characters and Unicode
  - [ ] Test emoji inputs
  - [ ] Test script injection attempts

#### **Date & Time Edge Cases**
- [ ] **Timezone Issues**
  - [ ] Test leap year dates
  - [ ] Test daylight saving time
  - [ ] Test international date formats
  - [ ] Test timezone conversions

---

## 🔍 **MODULE 9: BROWSER & DEVICE COMPATIBILITY**

### **9.1 Browser Testing**

#### **Desktop Browsers**
- [ ] **Chrome**
  - [ ] Test all features on latest Chrome
  - [ ] Verify JavaScript functionality
  - [ ] Check CSS rendering
  - [ ] Test form submissions

- [ ] **Firefox**
  - [ ] Test all features on latest Firefox
  - [ ] Verify JavaScript functionality
  - [ ] Check CSS rendering
  - [ ] Test form submissions

- [ ] **Safari**
  - [ ] Test all features on latest Safari
  - [ ] Verify JavaScript functionality
  - [ ] Check CSS rendering
  - [ ] Test form submissions

- [ ] **Edge**
  - [ ] Test all features on latest Edge
  - [ ] Verify JavaScript functionality
  - [ ] Check CSS rendering
  - [ ] Test form submissions

### **9.2 Device Testing**

#### **Mobile Devices**
- [ ] **iOS Devices**
  - [ ] iPhone 12/13/14/15
  - [ ] iPad (various sizes)
  - [ ] Test touch interactions
  - [ ] Verify mobile navigation

- [ ] **Android Devices**
  - [ ] Various Android phones
  - [ ] Android tablets
  - [ ] Test touch interactions
  - [ ] Verify mobile navigation

---

## 📋 **TESTING DELIVERABLES**

### **Daily Testing Log**
- [ ] **Test Results**: Pass/Fail for each test case
- [ ] **Bug Reports**: Document any issues found
- [ ] **Feature Requests**: Note improvements needed
- [ ] **Performance Notes**: Document any performance issues

### **Weekly Summary Report**
- [ ] **Progress Summary**: What was tested, what passed/failed
- [ ] **Critical Issues**: High-priority bugs found
- [ ] **Next Week Plan**: What to test next
- [ ] **Resource Needs**: Any additional tools or access needed

### **Final Testing Report**
- [ ] **Complete Test Coverage**: All features tested
- [ ] **Bug Summary**: All issues found and their status
- [ ] **Performance Metrics**: Load times, response times
- [ ] **Recommendations**: Improvements for production

---

## 🎯 **TESTING PRIORITIES**

### **High Priority (Week 1-2)**
1. **Authentication & Security** - Critical for production
2. **Appointment Booking** - Core business functionality
3. **Basic CRUD Operations** - Essential features

### **Medium Priority (Week 3-4)**
1. **CMS Management** - Content editing capabilities
2. **User Management** - Admin functionality
3. **Settings Configuration** - System customization

### **Low Priority (Week 5-8)**
1. **Performance Testing** - Optimization opportunities
2. **Edge Cases** - Robustness testing
3. **Browser Compatibility** - Cross-platform support

---

## 🚀 **GETTING STARTED TODAY**

1. **Run the setup script**: `npm run setup-test-env`
2. **Start with Module 1**: Authentication testing
3. **Use test accounts**: admin@test.com, staff@test.com, user@test.com
4. **Document everything**: Use this checklist to track progress
5. **Report issues**: Document bugs and improvements as you find them

**Happy Testing! 🎉**
