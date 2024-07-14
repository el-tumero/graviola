FROM node:20 AS build

WORKDIR /app

COPY . .

RUN yarn

FROM ghcr.io/foundry-rs/foundry AS compile

WORKDIR /app

COPY --from=build /app /app

COPY foundry.toml /app/

# Install dis stuff
RUN forge install OpenZeppelin/openzeppelin-contracts --no-git --no-commit
RUN forge install foundry-rs/forge-std --no-git --no-commit
RUN forge remappings > remappings.txt

RUN forge build --config-path /app/foundry.toml

FROM node:20

WORKDIR /app

COPY --from=build /app /app

RUN mkdir -p /contracts/
RUN mv ./* /contracts/