# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install necessary tools for building
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Use the non-root user
USER appuser

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"] 