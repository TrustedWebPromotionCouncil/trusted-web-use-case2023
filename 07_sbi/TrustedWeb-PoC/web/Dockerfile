FROM node:20-alpine3.17
WORKDIR /usr/src/app
COPY ./package.json ./
RUN CHOKIDAR_USEPOLLING=true \
apk update && \
apk upgrade && \
apk add --no-cache make gcc g++ python3 && \
yarn install
COPY ./ .
RUN yarn run build
ENV SESSION_SECRET="b9092e7ca5d5a8890a9132437982f5c7" \
NODE_ENV=production \
DATABASE_URL="${DATABASE_URL}"
CMD [ "yarn", "start" ]