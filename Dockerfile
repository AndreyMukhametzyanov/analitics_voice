FROM node:20-bookworm-slim AS builder

WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
RUN mkdir -p public

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="mysql://build:build@127.0.0.1:3306/build"

RUN npx prisma generate \
  && npm run build \
  && npx esbuild prisma/seed.ts \
    --bundle \
    --platform=node \
    --format=cjs \
    --outfile=prisma/seed.cjs \
    --external:@prisma/client

FROM node:20-bookworm-slim AS runtime

WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && mkdir -p public

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
RUN mkdir -p node_modules/.bin \
  && ln -sf ../prisma/build/index.js node_modules/.bin/prisma

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV WHISPER_URL=http://whisper:8080/inference

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
