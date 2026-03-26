# ----- STAGE 1: Builder -----
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package info and install ALL dependencies (including devDependencies like Vite)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# IMPORTANT: If your frontend relies on VITE_ API variables, pass them as build args here:
# ARG VITE_API_BASE_URL
# ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ARG VITE_APP_RAPID_API_KEY
ARG VITE_APP_RAPID_AIML_BASE_URL
ARG VITE_APP_GEMINI_API_KEY
ARG VITE_APP_GROQ_API
ARG VITE_API_BASE_URL

# Build the React application (outputs to /app/dist)
RUN npm run build

# ----- STAGE 2: Production Server -----
# Using the unprivileged version of Nginx which runs as a non-root user by default
FROM nginxinc/nginx-unprivileged:alpine AS runner

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled React build from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose unprivileged port (8080 is standard for non-root Nginx)
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]