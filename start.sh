#!/bin/sh

yarn typeorm migration:generate -n init
echo "MIGRATIONS HAS BEEN GENERATED GENERATED"
yarn typeorm migration:run
echo "MIGRATIONS HAS BEEN RUN"
npm run start:debug