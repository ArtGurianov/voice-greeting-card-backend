#!/bin/sh

yarn typeorm migration:generate -n init
echo "MIGRATIONS ARE GENERATED"
yarn typeorm migration:run
echo "MIGRATIONS APPLIED TO SCHEMA"

[ "$NODE_ENV" = "development" ] && yarn start:debug
[ "$NODE_ENV" = "production" ] || [ "$NODE_ENV" = "staging" ] && yarn start:prod
#TEST CASE IS SPECIFIED IN .circleci config
#OTHERWISE YOU MAY USE:
#[ "$NODE_ENV" = "test" ] && yarn test:e2e-ci
