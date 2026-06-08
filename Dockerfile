FROM node:22-slim

ENV DEBIAN_FRONTEND=noninteractive

# Enable pnpm via corepack (ships with Node 16.13+)
RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# Copy manifests — if pnpm-lock.yaml is absent, pnpm import converts package-lock.json
COPY package.json package-lock.json* pnpm-lock.yaml* ./

RUN if [ -f pnpm-lock.yaml ]; then \
      pnpm install --frozen-lockfile; \
    else \
      pnpm import && pnpm install; \
    fi

# Install Chromium + all OS-level dependencies Playwright needs
RUN pnpm exec playwright install --with-deps chromium

COPY . .

CMD ["pnpm", "test"]
