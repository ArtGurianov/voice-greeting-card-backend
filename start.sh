#!/bin/sh

yarn typeorm migration:generate -n init
echo "MIGRATIONS ARE GENERATED"
yarn nest build
echo "BUILD HAS COMPLETED"
yarn typeorm migration:run
echo "MIGRATIONS APPLIED TO SCHEMA"

[ "$NODE_ENV" = "development" ] && npm run start:debug
[ "$NODE_ENV" = "test" ] && npm run test:e2e-ci
[ "$NODE_ENV" = "production" ] && npm run start:prod