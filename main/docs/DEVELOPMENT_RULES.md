# Development Process Rules

## Core Rule

No feature should be added directly without following:

Plan → Build → Test → Log → Document → Review → Deploy

## Mandatory Checklist for Every Feature

- Database model or schema update
- API/service function
- Permission guard
- UI screen/component
- Loading state
- Empty state
- Error state
- Audit log for sensitive actions
- Input validation
- TypeScript types
- Documentation

## AI Coding Assistant Rules

- Never remove working features unless explicitly requested.
- Never expose secrets to frontend code.
- Never perform destructive actions without confirmation.
- Never create admin action without audit log.
- Always keep light/dark theme support.
- Always add loading, empty, and error states.
- Always validate API input.
- Always protect admin pages with permissions.

## Git Branch Rules

- `main` = production
- `staging` = pre-production
- `dev` = active development
- `feature/*` = new feature
- `fix/*` = bug fix
- `hotfix/*` = urgent production fix
