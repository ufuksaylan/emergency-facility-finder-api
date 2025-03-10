#!/bin/sh
# Concatenate the default directory with the first argument passed to the script.
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create src/database/migrations/"$1"
