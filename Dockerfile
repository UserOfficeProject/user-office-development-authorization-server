FROM node:16.15.0-alpine AS build-stage

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm ci --loglevel error --no-fund

COPY --chown=node:node . .

EXPOSE 5000

CMD [ "node", "./build/index.js" ]
