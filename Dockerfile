FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy the built assets to the subpath directory
COPY --from=builder /app/dist /usr/share/nginx/html/energy_tracker

RUN rm /etc/nginx/conf.d/default.conf
COPY vite-nginx.conf /etc/nginx/conf.d/nginx.conf

# Install dependencies needed for the server at runtime (full-stack)
RUN apk add nodejs npm

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server ./server
COPY --from=builder /app/src/lib/db.ts ./src/lib/db.ts
COPY --from=builder /app/database ./database

# Production dependencies only
RUN npm ci --only=production

# Expose Nginx port
EXPOSE 80

# Phase 2: Docker Environment Variables
ENV DATABASE_URL=$DATABASE_URL
ENV NEON_PROJECT_ID=$NEON_PROJECT_ID
ENV NEON_API_KEY=$NEON_API_KEY

# Phase 13: Subpath startup handler
RUN echo "#!/bin/sh" > start.sh && \
    echo "npx tsx server/index.ts &" >> start.sh && \
    echo "nginx -g 'daemon off;'" >> start.sh && \
    chmod +x start.sh

CMD ["./start.sh"]
