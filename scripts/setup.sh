#!/bin/bash
set -e

echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "Error: Node.js version must be >= 20"
  exit 1
fi

echo "Setting up environment variables..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

echo "Installing dependencies..."
npm install

echo "Generating Prisma client..."
npm run prisma:generate

echo "Running migrations..."
npm run prisma:migrate

echo "Running seed..."
npm run prisma:seed

echo "Setup complete! You can now run 'npm run dev' to start the development server."
