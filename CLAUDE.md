# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production (runs TypeScript compiler first)
- `pnpm preview` - Preview production build locally

### Code Quality

- `pnpm lint` - Run ESLint with strict settings
- `pnpm typecheck` - Run TypeScript compiler without emitting files

### Testing

- `pnpm test` - Run end-to-end tests with Playwright
- `pnpm test:ui` - Run tests with Playwright UI mode
- `pnpm test:headed` - Run tests in headed mode (visible browser)

## Architecture

### Core Concept

This is a dot-matrix symbol designer and composer application. Users can:

1. **Design** - Create and edit 9x7 pixel symbols for characters (A-Z, 0-9, punctuation)
2. **Compose** - Arrange symbols into scrolling messages up to 80 characters

### Key Technical Details

#### Symbol Format

- Each symbol is 9 rows × 7 columns (63 pixels total)
- Data stored as `boolean[]` in **column-major order** internally
- Rendered in **row-major order** for display
- Index transposition handled by `transposeIndex()` in `src/symbol/model.ts`

#### State Management

- Uses **@react-rxjs** for reactive state management
- Main state streams: `symbolState$`, `clipboard$`, `composeState$`
- Signals pattern for user actions (e.g., `togglePixel$`, `copySymbol$`)
- State persisted to localStorage with BroadcastChannel for multi-tab sync

#### Dual Entry Points

- `main.tsx` - Full application with Design/Compose modes
- `main-quick-edit.tsx` - Simplified symbol editor for quick edits
- Both built via Vite multi-entry configuration

#### AI Integration

- Claude Sonnet 4 integration for symbol prediction
- Requires `VITE_ANTHROPIC_API_KEY` environment variable
- Generates symbols from character prompts with specific pixel art constraints

### File Structure

- `src/symbol/` - Symbol model, state, and services
- `src/compose/` - Message composition and screen rendering
- `src/layout/` - Reusable layout components
- `src/ai/` - OpenAI integration for symbol generation
- `src/lib/` - Utility functions and error handling

### Data Flow

1. User actions create signals via `createSignal()`
2. Signals processed through `scan()` reducers in state streams
3. Components subscribe to state via `bind()` hooks
4. Changes persisted to localStorage and broadcast to other tabs
