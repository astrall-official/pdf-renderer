# Stage 1: Build
FROM node:18 AS builder

WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json ./
COPY package-lock.json ./
# If you use yarn, uncomment the next line and comment out the package-lock.json line
# COPY yarn.lock ./

# Install dependencies
# If you use yarn, change 'npm install' to 'yarn install'
RUN npm install

# Copy the rest of the application's source code
COPY . .

# Build the application (if you have a build step)
# If your project doesn't have a build step, you can remove this line
# or adjust it to your build command.
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy dependencies from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules/

# Copy built application from the builder stage
COPY --from=builder /usr/src/app/.next ./.next/
COPY --from=builder /usr/src/app/public ./public/

# Copy package.json to the production stage as it's needed by 'next start'
COPY --from=builder /usr/src/app/package.json ./

# Expose the port the app runs on (Next.js default is 3000)
EXPOSE 3000

# Command to run the application
# This assumes your package.json has a "start": "next start" script
CMD [ "npm", "start" ]
