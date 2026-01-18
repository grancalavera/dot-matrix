# Remove AI & Convert to Single Package

## Progress Tracking

- [x] Stage 1: Remove AI Integration
- [x] Stage 2: Convert to Single Package

## Stage 1: Remove AI Integration

### Delete

- `packages/server/` (entire directory)
- `packages/client/src/ai/service.ts`
- `.env.local` (root)

### Modify

- `packages/client/src/symbol/state.ts` - remove AI imports, signals, hooks
- `packages/client/src/symbol/SymbolDesignerToolbar.tsx` - remove AI button
- `CLAUDE.md` & `README.md` - remove AI docs

### Verify Stage 1

- `pnpm install && pnpm typecheck && pnpm lint && pnpm build && pnpm test`
- ✅ Success criteria: App still works in monorepo structure but without AI features

## Stage 2: Convert to Single Package

### Move to root

- Everything from `packages/client/` → root (src/, public/, index.html, vite.config.ts, etc.)

### Modify

- `package.json` - remove workspace config

### Delete

- `packages/` directory (should be empty after move)

### Verify Stage 2

- `pnpm install && pnpm typecheck && pnpm lint && pnpm build && pnpm test`
- ✅ Success criteria: App works from root as a single package
- ✅ Verified: All checks passed
