#!/bin/sh

yarn typeorm migration:generate -n init
echo "MIGRATIONS ARE GENERATED"
yarn nest build
echo "BUILD HAS COMPLETED"
yarn typeorm migration:run
echo "MIGRATIONS APPLIED TO SCHEMA"

[ "$NODE_ENV" = "development" ] && yarn start:debug
[ "$NODE_ENV" = "test" ] && yarn test:e2e-ci
[ "$NODE_ENV" = "production" ] && yarn start:prod