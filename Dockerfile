FROM node:20-alpine AS build

WORKDIR /app

COPY . .

RUN apk add --no-cache git openssh

RUN yarn install

RUN yarn workspace @graviola/contracts types

RUN yarn workspace @graviola/render build


FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/render .

RUN yarn remove-dev-deps

RUN yarn install --production

ENV HOST=0.0.0.0

ENV PORT=4321

EXPOSE 4321

CMD ["yarn", "start:prod"]