# Docker Setup for Optique App

This document explains how to use the Docker configuration for your Next.js 15 app with PostgreSQL and Prisma.

## 📁 Files Created

- `Dockerfile` - Production-optimized multi-stage build
- `Dockerfile.dev` - Development build with hot reloading
- `docker-compose.yml` - Base production configuration
- `docker-compose.override.yml` - Development overrides (auto-applied)
- `env.docker.dev` - Development environment variables
- `env.docker.prod` - Production environment variables
- `.dockerignore` - Optimized build context

## 🚀 Quick Start

### Development Mode

1. **Update environment variables:**
   ```bash
   # Edit env.docker.dev with your actual values
   nano env.docker.dev
   ```

2. **Start development environment:**
   ```bash
   docker-compose up --build
   ```

3. **Access your app:**
   - App: http://localhost:3000
   - Database: localhost:5432
   - **Admin Login**: admin@optique.com / admin123

### Production Mode

1. **Update environment variables:**
   ```bash
   # Edit env.docker.prod with your production values
   nano env.docker.prod
   ```

2. **Build and start production:**
   ```bash
   docker-compose -f docker-compose.yml up --build -d
   ```

3. **Access your app:**
   - App: http://localhost:3000
   - Database: localhost:5432
   - **Admin Login**: admin@optique.com / admin123

## 🌱 Database Seeding

The Docker setup includes automatic database seeding with:

### **What Gets Seeded:**
- ✅ **Admin User**: admin@optique.com / admin123
- ✅ **Roles & Permissions**: Admin (full access), Staff (limited access)
- ✅ **Home Values**: Expertise, Choix Varié, Proximité (in French)
- ✅ **FAQ**: 8 common optician questions (in French)
- ✅ **About Sections**: Notre Histoire, Notre Mission, Notre Équipe (in French)
- ✅ **Testimonials**: 3 customer testimonials (in French)
- ✅ **Appointment Statuses**: 6 statuses (Programmé, Confirmé, etc.)
- ✅ **Site Settings**: Arinass Optique information
- ✅ **Contact Settings**: Your address, phone, email, WhatsApp
- ✅ **Theme Settings**: Brand colors (#1A889D primary, #4A4A4A secondary)

### **How Seeding Works:**
- **Development**: Runs automatically after migrations
- **Production**: Runs automatically after migrations
- **Safe**: Won't create duplicates if data already exists

### **Manual Seeding:**
```bash
# Run seeder manually in running container
docker-compose exec app npm run db:seed

# Or run seeder in production
docker-compose -f docker-compose.yml exec app npm run db:seed
```

## 🔧 Configuration

### Environment Variables

#### Required Variables
- `DATABASE_URL` - PostgreSQL connection string
- `ENCRYPTION_KEY` - 32+ character encryption key
- `NODE_ENV` - development/production

#### Optional Variables
- `GMAIL_USER` - Email service username
- `GMAIL_APP_PASSWORD` - Email service password
- `GOOGLE_PLACES_API_KEY` - Google Places API key
- `FACEBOOK_ACCESS_TOKEN` - Facebook API token
- `SENTRY_DSN` - Error tracking (production)

### Database Configuration

- **Development DB:** `optique_app_dev`
- **Production DB:** `optique_app`
- **User:** `postgres`
- **Password:** `postgres`
- **Port:** `5432`

## 📋 Commands

### Development Commands

```bash
# Start development environment
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up --build --force-recreate
```

### Production Commands

```bash
# Start production environment
docker-compose -f docker-compose.yml up -d

# View production logs
docker-compose -f docker-compose.yml logs -f

# Stop production
docker-compose -f docker-compose.yml down
```

### Database Commands

```bash
# Run Prisma migrations (development)
docker-compose exec app npx prisma migrate dev

# Run Prisma migrations (production)
docker-compose exec app npx prisma migrate deploy

# Open Prisma Studio
docker-compose exec app npx prisma studio

# Generate Prisma client
docker-compose exec app npx prisma generate
```

### Utility Commands

```bash
# Access app container shell
docker-compose exec app sh

# Access database shell
docker-compose exec db psql -U postgres -d optique_app

# View container status
docker-compose ps

# Remove all containers and volumes
docker-compose down -v
```

## 🗂️ Volumes

### Persistent Data
- `postgres_data` - PostgreSQL data (production)
- `postgres_dev_data` - PostgreSQL data (development)
- `uploads` - File uploads in `public/uploads/`

### Development Volumes
- Source code is mounted for hot reloading
- `node_modules` and `.next` are excluded from mounting

## 🔒 Security Notes

### Production Security
1. **Change default passwords:**
   - Update PostgreSQL password in `env.docker.prod`
   - Generate a secure `ENCRYPTION_KEY`

2. **Environment variables:**
   - Never commit `.env` files to version control
   - Use Docker secrets for sensitive data in production

3. **Network security:**
   - Consider using Docker networks for isolation
   - Use reverse proxy (nginx) for production

## 🚀 Deployment

### VPS Deployment

1. **Clone repository:**
   ```bash
   git clone <your-repo>
   cd optique-app
   ```

2. **Configure environment:**
   ```bash
   cp env.docker.prod .env.docker.prod
   # Edit with your production values
   ```

3. **Deploy:**
   ```bash
   docker-compose -f docker-compose.yml up -d --build
   ```

4. **Run migrations:**
   ```bash
   docker-compose exec app npx prisma migrate deploy
   ```

### With Reverse Proxy (Recommended)

Add nginx configuration to handle SSL and routing:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using port 3000
   lsof -i :3000
   # Kill the process or change port in docker-compose.yml
   ```

2. **Database connection issues:**
   ```bash
   # Check database health
   docker-compose exec db pg_isready -U postgres
   ```

3. **Permission issues:**
   ```bash
   # Fix uploads directory permissions
   docker-compose exec app chown -R nextjs:nodejs public/uploads
   ```

4. **Build cache issues:**
   ```bash
   # Clear Docker build cache
   docker builder prune -a
   ```

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs app
docker-compose logs db

# Follow logs in real-time
docker-compose logs -f app
```

## 📊 Monitoring

### Health Checks
- PostgreSQL health check is configured
- App depends on database being healthy

### Resource Usage
```bash
# View resource usage
docker stats

# View container details
docker-compose ps
```

## 🔄 Updates

### Updating the Application
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up --build -d

# Run migrations if needed
docker-compose exec app npx prisma migrate deploy
```

### Database Backups
```bash
# Create backup
docker-compose exec db pg_dump -U postgres optique_app > backup.sql

# Restore backup
docker-compose exec -T db psql -U postgres optique_app < backup.sql
```

---

## 📞 Support

If you encounter any issues with this Docker setup, check the troubleshooting section above or refer to the Docker and Next.js documentation.
