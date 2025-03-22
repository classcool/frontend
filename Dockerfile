FROM oven/bun:latest AS base
WORKDIR /app

FROM base AS installer
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

FROM installer AS builder
WORKDIR /app
COPY --from=installer /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

EXPOSE 3000
