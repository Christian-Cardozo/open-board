# syntax=docker/dockerfile:1.7
ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS base
WORKDIR /repo

FROM base AS deps
COPY package-lock.json package.json ./
COPY tsconfig*.json ./
RUN npm ci

FROM deps AS build
COPY app ./app
COPY public ./public
COPY next.config.ts ./
COPY postcss.config.mjs ./
RUN npm run build \
    && ls -la /repo/.next/ || (echo "No se generó .next" && exit 1)

FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build --chown=node:node /repo/.next/standalone ./
COPY --from=build --chown=node:node /repo/.next/static ./.next/static
COPY --from=build --chown=node:node /repo/public ./public

# ✅ usar el usuario 'node' que ya existe en la imagen
USER node

EXPOSE 3000
CMD ["node", "server.js"]
