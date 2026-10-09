# Contributing to Room Booking & Statistics System

Thank you for contributing! Please follow these guidelines to ensure consistency and maintainability.

## Getting Started
1. Clone the repository and install dependencies (`npm install`).
2. Create your feature branch from `main`.

## Branch Naming Conventions
- `feature/<feature-name>` (e.g., `feature/student-booking-history`)
- `fix/<bug-name>` (e.g., `fix/booking-status-badge`)
- `refactor/<feature-name>` (e.g., `refactor/booking-service`)
- `docs/<document-name>` (e.g., `docs/update-readme`)

## Commit Message Conventions
Follow conventional commits format:
- `feat: add booking history page`
- `fix: fix booking status display`
- `docs: update README`
- `refactor: improve booking service`

## Coding Standards & Conventions
- Use TypeScript with strict types. Do not bypass the type system or disable warnings.
- Follow existing component naming conventions (PascalCase for components, camelCase for variables/functions).
- Respect database independence rules: never modify or invent database fields, tables, or relations.

## Pull Request Process
1. Ensure your code compiles and tests pass.
2. Submit a Pull Request with a clear description of changes.
3. Code review required before merging.
