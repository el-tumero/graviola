FROM oven/bun:1
WORKDIR /app
COPY . .
USER bun
EXPOSE 8085
ENV NODE_ENV production
CMD ["bun", "event/server.ts"]