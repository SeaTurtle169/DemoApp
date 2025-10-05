# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.18.0

################################################################################
# Base stage
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app

################################################################################
# Dependencies stage
FROM base AS deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

################################################################################
# Build stage
FROM base AS build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .
RUN npm run build

################################################################################
# Final stage
FROM node:${NODE_VERSION}-alpine AS final

# Use modern ENV syntax (no warning)
ENV NODE_ENV=production

# Install missing system deps so `npm install -g serve` won't fail
RUN apk add --no-cache bash curl

# Install static server
RUN npm install -g serve

WORKDIR /usr/src/app

# Copy only what's needed
COPY --from=build /usr/src/app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
