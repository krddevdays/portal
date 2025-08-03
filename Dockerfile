FROM node:20.16-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

ARG SENTRY_URL=https://sentry.io/
ARG SENTRY_ORG=krddev
ARG SENTRY_PROJECT=portal
ENV SENTRY_URL $SENTRY_URL
ENV SENTRY_ORG $SENTRY_ORG
ENV SENTRY_PROJECT $SENTRY_PROJECT

RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN \
    SENTRY_AUTH_TOKEN="$(cat /run/secrets/SENTRY_AUTH_TOKEN)" && \
    export SENTRY_AUTH_TOKEN && \
    ASSET_PREFIX="https://krddev-portal.storage.yandexcloud.net" npm run build

FROM amazon/aws-cli:2.15.4 as uploader
WORKDIR /app
COPY --from=builder /app/.next/static ./.next/static
RUN --mount=type=secret,id=S3_ACCESS_KEY_ID \
    --mount=type=secret,id=S3_SECRET_ACCESS_KEY \
    aws configure set aws_access_key_id $(cat /run/secrets/S3_ACCESS_KEY_ID) && \
    aws configure set aws_secret_access_key $(cat /run/secrets/S3_SECRET_ACCESS_KEY) && \
    aws configure set region ru-central1 && \
    aws configure set endpoint_url https://storage.yandexcloud.net && \
    aws s3 cp --recursive --no-progress --cache-control "public,max-age=31536000" ./.next/static s3://krddev-portal/_next/static

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=uploader --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
