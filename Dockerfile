FROM node:18.17.1-alpine AS build-stage

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm ci --loglevel error --no-fund --only-production

COPY --chown=node:node . .

EXPOSE 5000

CMD [ "node", "./src/index.js" ]
