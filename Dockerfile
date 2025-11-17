# ------------------------------
# 1. Build Stage
# ------------------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only the app directory containing package.json
COPY instaclone_fe/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app code
COPY instaclone_fe/ .

# Build production files
RUN npm run build

# ------------------------------
# 2. Production Stage
# ------------------------------
FROM nginx:stable-alpine

# Clear default static files
RUN rm -rf /usr/share/nginx/html/*

# Copy Vite build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
