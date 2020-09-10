FROM node:12.13-alpine as development
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i -g yarn
RUN yarn install
COPY . .
COPY start.sh /
RUN chmod +x /start.sh


FROM node:12.13-alpine as build
WORKDIR /usr/src/app
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build


FROM node:12.13-alpine as production
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i -g yarn
RUN yarn install --production
COPY . .
COPY --from=build /usr/src/app/dist ./dist
COPY start.sh /
RUN chmod +x /start.sh
CMD ["/start.sh"]