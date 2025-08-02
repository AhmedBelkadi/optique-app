# Optique App

A modern product management application built with Next.js, Prisma, and TypeScript.

## Features

- **Authentication**: User registration and login with secure password hashing
- **Product Management**: CRUD operations for products with filtering and search
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript support with Zod validation
- **Database**: SQLite database with Prisma ORM
- **Session Management**: Encrypted sessions stored in database
- **Form Handling**: Server actions with useActionState for optimal UX
- **Validation**: Client and server-side validation with proper error handling

## Project Structure

```
app/
├── login/
│   ├── page.tsx          # Login page with useActionState
│   └── actions.ts        # Server actions for login with validation
├── register/
│   ├── page.tsx          # Registration page with useActionState
│   └── actions.ts        # Server actions for registration with validation
├── products/
│   ├── page.tsx          # Product listing with filters
│   ├── new/
│   │    ├── page.tsx     # Create new product form with useActionState
│   │    └── actions.ts   # Server actions for product creation
│   ├── [id]/
│   │    ├── page.tsx     # Product details page
│   │    ├── details.tsx  # Product details component
│   │    ├── edit/
│   │    │    ├── page.tsx # Edit product form with useActionState
│   │    │    └── actions.ts # Server actions for product updates
│   │    └── delete.ts    # Delete product route handler
└── layout.tsx            # Root layout with navigation

lib/
├── prisma.ts             # Prisma client configuration
├── utils/
│   └── crypto.ts         # Password hashing and session encryption utilities
└── modules/
    ├── auth/
    │   ├── schema/
    │   │   └── authSchema.ts    # Authentication validation schemas
    │   └── services/
    │       ├── session.ts       # Session management with database storage
    │       ├── loginUser.ts     # Login service
    │       └── registerUser.ts  # Registration service
    └── products/
        ├── schema/
        │   └── productSchema.ts # Product validation schemas
        ├── queries/
        │   ├── getAllProducts.ts # Get all products query
        │   └── getProductById.ts # Get product by ID query
        └── services/
            ├── createProduct.ts  # Create product service
            ├── updateProduct.ts  # Update product service
            └── deleteProduct.ts  # Delete product service
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
ENCRYPTION_KEY="your-32-character-secret-key-here!!"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Important**: Make sure your `ENCRYPTION_KEY` is exactly 32 characters long for AES-256 encryption.

### 3. Database Setup

Generate Prisma client and push the schema to the database:

```bash
npm run db:generate
npm run db:push
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Key Features

### Authentication & Session Management

- **Secure Password Hashing**: Uses bcryptjs with 12 salt rounds
- **Encrypted Sessions**: Session data is encrypted using AES-256-CBC
- **Database Storage**: Sessions are stored in the database with encryption
- **Automatic Cleanup**: Expired sessions are automatically removed

### Form Handling with useActionState

- **Optimistic Updates**: Forms provide immediate feedback
- **Loading States**: Built-in loading indicators during form submission
- **Error Handling**: Comprehensive error display with field-level validation
- **Server Actions**: All forms use server actions for better performance

### Validation

- **Zod Schemas**: Type-safe validation for all forms
- **Client & Server Validation**: Validation on both client and server
- **Field-Level Errors**: Specific error messages for each form field
- **Real-time Feedback**: Immediate validation feedback

### Product Management

- **Full CRUD**: Create, Read, Update, Delete operations
- **Search & Filter**: Filter by name, description, and category
- **Responsive Design**: Works on all device sizes
- **Clean UI**: Minimal, focused interface ready for customization

## Usage

### Authentication

1. **Register**: Visit `/register` to create a new account
2. **Login**: Visit `/login` to sign in to your account

### Product Management

1. **View Products**: Visit `/products` to see all products with filtering options
2. **Create Product**: Click "Add New Product" or visit `/products/new`
3. **Edit Product**: Click "Edit" on any product card or visit `/products/[id]/edit`
4. **Delete Product**: Click "Delete" on the product details page

## Technologies Used

- **Next.js 15**: React framework with App Router and Server Actions
- **TypeScript**: Type-safe JavaScript
- **Prisma**: Database ORM with SQLite
- **Tailwind CSS**: Utility-first CSS framework
- **Zod**: Schema validation
- **bcryptjs**: Password hashing
- **Node.js Crypto**: Session encryption/decryption
- **useActionState**: React hook for form state management

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio

### Database Management

The application uses SQLite for simplicity. For production, consider using PostgreSQL or MySQL by updating the `DATABASE_URL` in your environment variables and changing the provider in `prisma/schema.prisma`.

### Security Features

- **Session Encryption**: All session data is encrypted before storage
- **Password Hashing**: Secure password hashing with bcryptjs
- **Input Validation**: Comprehensive validation on all inputs
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **XSS Protection**: React's built-in XSS protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
