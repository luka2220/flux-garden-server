# ---- builder ----
FROM node:22 as BUILD
WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src

RUN pnpm run build

# ---- runtime ----
FROM node:22
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

ENV NODE_ENV=production PORT=8080
COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/dist ./dist
EXPOSE 8000
CMD ["node", "dist/app.js"]
