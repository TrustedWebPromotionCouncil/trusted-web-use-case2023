FROM ubuntu:22.04

# install nodejs
RUN apt update
RUN apt install -y ca-certificates curl gnupg 
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt update && apt install -y nodejs
RUN npm install -g npm \
    npm install -g yarn \
    yarn set version stable

WORKDIR /var/www/app
RUN yarn install

CMD [ "yarn", "start" ]
