# ---------- Build stage ----------
    FROM node:18-alpine AS builder
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install
    
    COPY . .
    # Ensure prisma client exists in the image (if used at build/runtime)
    RUN npx prisma generate || true
    RUN npm run build
    
    # ---------- Runtime stage ----------
    FROM node:18-alpine AS runner
    WORKDIR /app
    
    ENV NODE_ENV=production
    # Copy only what we need
    COPY --from=builder /app/package*.json ./
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/prisma ./prisma
    COPY --from=builder /app/server.js ./server.js
    COPY --from=builder /app/scripts ./scripts
    
    # Runtime uploads dir (mounted as a volume)
    RUN mkdir -p /app/uploads
    VOLUME ["/app/uploads"]
    
    EXPOSE 3000
    CMD ["node", "server.js"]
    