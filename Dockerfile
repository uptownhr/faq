FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
LABEL fly_launch_runtime="Next/Prisma"
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
# copy workspace dependencies
RUN mkdir faq
COPY faq/package.json ./faq/package.json
COPY pnpm-workspace.yaml ./

RUN corepack enable pnpm && pnpm i --frozen-lockfile;


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/faq/node_modules ./faq/node_modules
COPY tsconfig.base.json tsconfig.json ./
COPY package.json pnpm-lock.yaml* ./
COPY faq/package.json ./faq/package.json
COPY pnpm-workspace.yaml ./
COPY faq ./faq

RUN corepack enable pnpm
RUN pnpm run generate
RUN pnpm run build


# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/faq/dist/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/faq/dist/static ./dist/static
COPY faq/prisma/migrations ./faq/prisma/migrations

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["sh", "-c", "cd faq && npx --yes prisma migrate deploy && node server.js"]