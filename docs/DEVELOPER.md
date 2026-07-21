# Developer Guide

Welcome to the VAQUITA Automation development team. This document outlines our coding standards, workflow, and architecture patterns.

## Code Style & Conventions

- **TypeScript Strict Mode**: Absolutely no `any`. Use generics or `unknown` with type narrowing.
- **Formatting**: We use Prettier and ESLint. Run `npm run lint` before committing.
- **Commit Messages**: Follow Conventional Commits format (`feat: ...`, `fix: ...`, `chore: ...`).

## Architecture Patterns

We follow a modular, 3-tier architecture:

1. **Controllers**: Handle HTTP request/response parsing, validation (Zod), and call Services. (No business logic here).
2. **Services**: Contain all core business logic and transaction management.
3. **Repositories / ORM**: Prisma handles database interaction directly within services.

## Adding a New Feature (Step-by-step)

1. **Database Schema**: Update `packages/database/prisma/schema.prisma`.
2. **Migrate**: Run `npm run prisma:migrate`.
3. **Generate**: Run `npm run prisma:generate`.
4. **Service**: Create or update the relevant service in `apps/backend/src/services/`.
5. **Tests**: Write unit tests for the service logic in `apps/backend/src/__tests__/unit/`.
6. **Controller**: Create the HTTP route and validation logic in `apps/backend/src/controllers/`.
7. **Frontend**: Build the UI components in `apps/frontend/src/components/` utilizing Radix UI.
8. **Integration**: Connect frontend to backend using React Query.

## Testing Guidelines

- **Unit Tests**: Mandatory for all Services and Utility functions. Mock database connections (`vi.mock('@/lib/prisma')`).
- **Integration Tests**: Mandatory for all critical API routes (Auth, Orders, Webhooks). Use test database containers.
- **Frontend Tests**: Mandatory for reusable UI components. Check rendering states (loading, empty, populated, error).

Use `npm run test` to execute the full suite via Vitest.
