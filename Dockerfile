FROM node:20-alpine AS base
LABEL org.opencontainers.image.source https://github.com/siberiacancode/confreviewer

FROM base AS builder

WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN corepack enable pnpm && pnpm install --production=false

COPY . .

ENV NODE_ENV production

ARG DATABASE_URL
ENV DATABASE_URL ${DATABASE_URL}

RUN pnpm prisma generate
RUN pnpm build

FROM base AS runner

COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/next.config.ts next.config.ts
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/prisma prisma
COPY --from=builder /app/lib/generated lib/generated

ENV NEXT_TELEMETRY_DISABLED 1
ENV DATABASE_URL ${DATABASE_URL}

CMD sh -c "pnpm prisma migrate deploy && pnpm start -p $PORT"
