FROM node:12.13-alpine

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i -g yarn
RUN yarn install

COPY .env.${NODE_ENV} ./.env

COPY . .

COPY start.sh /
RUN chmod +x /start.sh

CMD ["/start.sh"]