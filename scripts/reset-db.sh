#!/bin/bash
set -e
echo "Resetting database..."
npx prisma migrate reset --force --schema packages/database/prisma/schema.prisma
echo "Database reset complete."
