#!/bin/sh

set -o errexit

# Note: migrations are already should be created before running the container

# generate_migrations() {
#     npx ts-node ./node_modules/typeorm/cli.js migration:generate -n init -f src/config/typeormConnectionOptions.ts
# }

apply_migrations() {
    npx ts-node ./node_modules/typeorm/cli.js migration:run -f src/config/typeormConnectionOptions.ts
}

if [ "$NODE_ENV" = "development" ]
then
    if apply_migrations; then echo "MIGRATIONS ARE APPLIED TO THE SCHEMA"; else exit 1; fi
    # if generate_migrations; then echo "MIGRATIONS ARE GENERATED"; else exit 1; fi
fi

yarn start

