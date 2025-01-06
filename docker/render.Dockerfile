FROM node:alpine
WORKDIR /app
COPY . .
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
ENV NODE_ENV production
CMD ["node", "render/dist/server/entry.mjs"]