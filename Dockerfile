# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
RUN npm ci

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Copy all source files
COPY packages/ ./packages/
COPY apps/ ./apps/
COPY tsconfig.base.json ./
COPY package.json ./
# Single uncacheable build step - generates prisma, builds all workspaces, verifies all dists
RUN apk add --no-cache openssl
RUN DATABASE_URL="postgresql://dummy" DIRECT_URL="postgresql://dummy" npx prisma generate --schema=packages/database/prisma/schema.prisma && \
    echo "--- Building shared ---" && \
    npm run build -w packages/shared && \
    ls packages/shared/dist/index.js && \
    echo "✅ Shared dist OK" && \
    echo "--- Building database ---" && \
    npm run build -w packages/database && \
    ls packages/database/dist/index.js && \
    echo "✅ Database dist OK" && \
    echo "--- Building backend ---" && \
    npm run build -w apps/backend && \
    echo "✅ Backend dist OK" && \
    echo "--- BUILDER DIST DEBUG ---" && \
    ls -la apps/backend/src && \
    ls -la apps/backend/dist && \
    find apps/backend/dist -name "env.js" || echo "NOT FOUND" && \
    echo "--- Building frontend ---" && \
    npm run build -w apps/frontend && \
    echo "✅ Frontend dist OK" && \
    echo "=== ALL BUILDS PASSED ==="

# Stage 3: Runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

RUN apk add --no-cache curl openssl

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=builder /app/apps/frontend/dist ./apps/frontend/dist
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/database/package.json ./packages/database/package.json
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["sh", "-c", "echo \"--- DIST CONTENTS ---\" && ls -la apps/backend/dist && echo \"--- CONFIG CONTENTS ---\" && ls -la apps/backend/dist/config || echo \"NO CONFIG DIR\" && echo \"--- STARTING NODE ---\" && node apps/backend/dist/index.js"]
