#for testing and development
FROM node:12.13-alpine

# docker build --build-arg NODE_ENV=value
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY .env.development ./.env

COPY . .

#command from compose is the same. No need to repeat here?
#RUN if [ "$NODE_ENV" = "development" ]; then npm run start:debug; fi

#probably no need to check these:
#RUN if [ "$NODE_ENV" = "testing" ]; then npm run test:e2e-ci; fi

#just run testing case and compose will override if it's development? maybe
#RUN npm run test:e2e-ci
CMD ["npm", "test:e2e-ci"]