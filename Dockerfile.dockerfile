# Stage 1: Build
# Use an official Node.js runtime as a parent image
FROM node:20-slim AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source
COPY . .

# Stage 2: Production
# Use a minimal image for production
FROM node:20-slim

WORKDIR /usr/src/app

# Copy dependencies from builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
# Copy application code
COPY --from=builder /usr/src/app .

# Expose port and start the app
EXPOSE 8080
CMD [ "npm", "start" ]