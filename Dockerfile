# Etapa 1: dependencias (capa cacheable mientras no cambie el lockfile).
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Etapa 2: build. Next incrusta las NEXT_PUBLIC_* al compilar, por eso
# llegan como build args (ver Docker/docker-compose-frontend-publico.yml)
# y no como variables del contenedor.
FROM node:22-alpine AS build
WORKDIR /app

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_API_ORIGIN
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
# Server-side fetches (e.g. the footer's settings call, rendered on every
# page) run during `next build` too, while it's collecting/prerendering
# page data — so this needs a real value here, not just at container
# runtime, or it falls back to an unreachable localhost and every page
# render stalls on that fetch until it times out.
ARG API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_API_ORIGIN=$NEXT_PUBLIC_API_ORIGIN \
    NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID \
    API_BASE_URL=$API_BASE_URL \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Etapa 3: runtime mínimo con el output standalone (ver next.config.ts).
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3001

# Usuario sin privilegios.
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001

# API_BASE_URL (server-side) se pasa como variable de entorno del
# contenedor: no es NEXT_PUBLIC_, así que se lee en runtime.
CMD ["node", "server.js"]
