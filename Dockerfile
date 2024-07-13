# Base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Install libc6-compat for compatibility
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package.json package-lock.json ./
# Install dependencies
RUN npm ci

# Build the application
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the application code
COPY . .

# Disable Next.js telemetry during the build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Final production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Disable Next.js telemetry during runtime
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy necessary files from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chown=nextjs:nodejs data.json data.json

# Set the correct permission for prerender cache
RUN mkdir -p .next \
    && chown nextjs:nodejs .next

# Switch to non-root user
USER nextjs

# Expose the application port
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run the application
CMD ["node", "server.js"]
