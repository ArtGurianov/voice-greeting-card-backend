#for testing and development
FROM node:12.13-alpine as development

# docker build --build-arg NODE_ENV=value
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i -g yarn
RUN yarn install

COPY start.sh /
RUN chmod +x /start.sh

COPY .env.development ./.env

COPY . .

#just run testing case and compose will override if it's development? maybe
#RUN npm run test:e2e-ci
#CMD ["npm", "test:e2e-ci"]

#
#ENTRYPOINT ["/start.sh"]
CMD ["/start.sh"]