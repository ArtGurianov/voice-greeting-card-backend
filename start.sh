#!/bin/sh

yarn typeorm migration:generate -n init
echo "MIGRATIONS HAS BEEN GENERATED"
yarn nest build
echo "BUILD HAS BEEN COMPLETED"
yarn typeorm migration:run
echo "MIGRATIONS HAS BEEN RUN"
npm run start:debug #dev
#node dist/main #prod