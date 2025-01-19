#!/bin/bash

pnpm build # build all packages
pnpm clean # remove all dependencies (node_modules)
pnpm install --prod # install production dependencies
docker build --file ./docker/render.Dockerfile -t eltumero/graviola-render:latest . # build render image
docker build --file ./docker/event.Dockerfile -t eltumero/graviola-event:latest . # build event image
pnpm clean # remove all dependencies (node_modules)
pnpm install # install all (dev & prod) dependencies