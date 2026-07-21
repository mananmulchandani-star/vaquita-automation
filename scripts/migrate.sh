#!/bin/bash
set -e
npx prisma migrate deploy --schema packages/database/prisma/schema.prisma
