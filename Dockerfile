FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS prod

WORKDIR /app
COPY . /app
RUN ls
RUN pnpm -F "@graviola/render" -F "@graviola/contracts" install
RUN pnpm --F "@graviola/render" run build 

FROM base AS runner
WORKDIR /app
COPY --from=prod /app/render /app/render
COPY --from=prod /app/package.json /app/package.json
# RUN pnpm -F "@graviola/render" install --prod

# ENV HOST=0.0.0.0
# ENV PORT=4321   
# EXPOSE 4321

# CMD ["]
# CMD [ "node", "dist/server/entry.mjs" ]

