# Optique App

A modern product management application built with Next.js, Prisma, and TypeScript.

## 🚀 Features

- **Authentication**: User registration and login with secure password hashing
- **Product Management**: CRUD operations for products with filtering and search
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript support with Zod validation
- **Database**: PostgreSQL database with Prisma ORM
- **Session Management**: Encrypted sessions stored in database
- **Form Handling**: Server actions with useActionState for optimal UX
- **Validation**: Client and server-side validation with proper error handling
- **Security**: CSRF protection, rate limiting, and input sanitization
- **Performance**: Image optimization, code splitting, and memoization
- **Testing**: Comprehensive test suite with Jest and Testing Library

## 🛡️ Security Features

- **CSRF Protection**: All forms include CSRF tokens
- **Rate Limiting**: API endpoints protected against abuse
- **Input Sanitization**: DOMPurify for XSS prevention
- **Session Encryption**: AES-256-CBC encrypted sessions
- **Password Hashing**: bcryptjs with 12 salt rounds
- **Environment Validation**: Runtime environment variable validation
- **Security Headers**: Comprehensive security headers

## ⚡ Performance Optimizations

- **Next.js Image Optimization**: Automatic image optimization with WebP/AVIF support
- **Code Splitting**: Dynamic imports for heavy components
- **Memoization**: React.memo for expensive components
- **Bundle Optimization**: Package import optimization
- **Lazy Loading**: Components loaded on demand
- **Image Prioritization**: Critical images loaded first

## 🧪 Testing

- **Unit Tests**: Jest and Testing Library setup
- **Component Tests**: Comprehensive component testing
- **Mocking**: Proper mocking of external dependencies
- **Coverage**: Test coverage reporting
- **Type Checking**: TypeScript compilation checks

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── common/            # Shared components
│   ├── features/          # Feature-specific components
│   └── ui/               # UI components
├── features/              # Feature modules
│   ├── auth/             # Authentication
│   ├── products/         # Product management
│   └── categories/       # Category management
├── lib/                   # Utilities and configurations
│   ├── shared/           # Shared utilities
│   └── hooks/            # Custom React hooks
└── types/                # TypeScript type definitions
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/optique"
ENCRYPTION_KEY="your-32-character-secret-key-here!!"
NODE_ENV="development"
SENTRY_DSN="your-sentry-dsn" # Optional
LOG_LEVEL="info"
```

**Important**: Make sure your `ENCRYPTION_KEY` is exactly 32 characters long for AES-256 encryption.

### 3. Database Setup

```bash
npm run db:generate
npm run db:push
```

### 4. Development

```bash
npm run dev
```

### 5. Testing

```bash
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### 6. Code Quality

```bash
npm run lint          # ESLint
npm run lint:fix      # Auto-fix linting issues
npm run type-check    # TypeScript check
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run type-check` - TypeScript compilation check
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run analyze` - Bundle analysis

## 🔒 Security Implementation

### CSRF Protection
All forms include CSRF tokens to prevent cross-site request forgery attacks.

### Rate Limiting
- Authentication endpoints: 5 requests per 15 minutes
- API endpoints: 60 requests per minute
- Upload endpoints: 10 uploads per minute

### Input Validation
- Zod schemas for runtime validation
- DOMPurify for XSS prevention
- Input length limits and sanitization

### Session Security
- Encrypted session data
- Secure cookie settings
- Automatic session cleanup

## ⚡ Performance Features

### Image Optimization
- Next.js Image component with WebP/AVIF support
- Automatic responsive images
- Lazy loading and prioritization
- Blur placeholders

### Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting
- Component-level lazy loading

### Memoization
- React.memo for expensive components
- useCallback for stable references
- Optimized re-renders

## 🧪 Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Service layer testing
- Utility function testing

### Integration Tests
- API endpoint testing
- Database operation testing
- Authentication flow testing

### Mocking
- Next.js router mocking
- External service mocking
- Environment variable mocking

## 📊 Code Quality

### Linting
- ESLint with Next.js and TypeScript rules
- Prettier for code formatting
- Pre-commit hooks with lint-staged

### Type Safety
- Full TypeScript implementation
- Strict type checking
- Zod runtime validation

### Error Handling
- Centralized error handling
- User-friendly error messages
- Comprehensive error logging

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables
Ensure all required environment variables are set in production:
- `DATABASE_URL`
- `ENCRYPTION_KEY`
- `NODE_ENV=production`

### Security Checklist
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Environment variables secured
- [ ] Database connection secured
- [ ] Rate limiting enabled
- [ ] Error monitoring configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run linting and tests
6. Submit a pull request

### Development Workflow
```bash
git checkout -b feature/your-feature
npm run lint:fix
npm test
git commit -m "feat: add your feature"
```

## 📝 License

MIT License - see LICENSE file for details.

## 🔄 Recent Improvements

### Security Enhancements
- ✅ CSRF protection for all forms
- ✅ Rate limiting for API endpoints
- ✅ Removed hardcoded encryption key
- ✅ Enhanced input sanitization
- ✅ Security headers configuration

### Performance Optimizations
- ✅ Next.js Image optimization
- ✅ Code splitting with dynamic imports
- ✅ React.memo for component optimization
- ✅ Bundle size optimization
- ✅ Image format optimization (WebP/AVIF)

### Code Quality
- ✅ Comprehensive error handling
- ✅ Centralized error logging
- ✅ TypeScript strict mode
- ✅ ESLint and Prettier configuration
- ✅ Pre-commit hooks

### Testing Infrastructure
- ✅ Jest and Testing Library setup
- ✅ Component testing examples
- ✅ Mocking configuration
- ✅ Test coverage reporting
- ✅ Type checking in CI

### Development Experience
- ✅ Enhanced development scripts
- ✅ Better error messages
- ✅ Improved documentation
- ✅ Code formatting automation
- ✅ Quality assurance tools
