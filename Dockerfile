FROM oven/bun:1 AS dependencies

WORKDIR /app


COPY package.json bun.lock* ./

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

####

FROM oven/bun:1 AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

ENV NODE_ENV=production
ENV LOCAL_DATABASE_URL="file:./dev.db"

RUN bun run build

####

FROM oven/bun:1 AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder --chown=bun:bun /app/node_modules ./node_modules
# Use this if build doesn't transform source
COPY --from=builder --chown=bun:bun /app/src ./src
# COPY --from=builder --chown=bun:bun /app/dist ./dist
COPY --from=builder --chown=bun:bun /app/package.json ./package.json

# Use this if build stage doesn't exist
# COPY --from=dependencies --chown=bun:bun /app/node_modules ./node_modules
# COPY --chown=bun:bun /app/src ./src
# COPY --chown=bun:bun /package.json ./package.json

USER bun

CMD ["bun", "."]