FROM node:18-slim AS builder

RUN corepack enable && corepack prepare pnpm@10.17.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install

ADD . .

ARG BACKEND_URL
ENV VITE_BACKEND_URL=${BACKEND_URL}

RUN pnpm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
