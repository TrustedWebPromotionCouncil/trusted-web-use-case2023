# syntax = docker/dockerfile:experimental
# Base
FROM node:18-bullseye-slim as base
# Development
FROM base as development
COPY . /root/app
WORKDIR /root/app

 # Local
FROM base as local
COPY . /root/app
WORKDIR /root/app

# Build
FROM base as build
COPY . /root/app
WORKDIR /root/app
ARG MODE
RUN yarn && yarn build -- --mode $MODE --base=/

# Release 
FROM nginx:1.23-alpine-slim as release
RUN apk upgrade --update
COPY --from=build /root/app/dist/ /var/www/html/public/