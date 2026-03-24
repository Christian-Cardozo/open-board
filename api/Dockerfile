# syntax=docker/dockerfile:1.7
ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS base
WORKDIR /repo

FROM base AS deps
COPY package-lock.json package.json ./
COPY nest-cli.json tsconfig*.json ./
RUN npm ci

FROM deps AS build
COPY src ./src
RUN npm run build \
    && ls -la /repo/dist/ || (echo "No se generó dist" && exit 1)

FROM deps AS deploy
WORKDIR /out
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production

# node_modules y package.json mínimos
COPY --from=deploy --chown=node:node /out/node_modules ./node_modules
COPY --from=deploy --chown=node:node /out/package.json ./package.json

# build de la app
COPY --from=build --chown=node:node /repo/dist/ ./dist

# ✅ usar el usuario 'node' que ya existe en la imagen
USER node

EXPOSE 3000
CMD ["node", "dist/main.js"]
