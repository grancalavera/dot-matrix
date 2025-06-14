# Dot Matrix - Monorepo

A dot-matrix symbol designer and composer application with AI-powered symbol generation.

## Architecture

This is a monorepo containing two packages:

- **`packages/client`** - React frontend application (Vite + TypeScript)
- **`packages/server`** - REST API service for AI symbol generation (Express + TypeScript)

## Features

### Client Application
- **Symbol Designer**: Create and edit 9x7 pixel symbols for characters (A-Z, 0-9, punctuation)
- **Message Composer**: Arrange symbols into scrolling messages up to 80 characters
- **AI Integration**: Generate symbols using Claude Sonnet 4 (via client-side API or server API)
- **Symbol Management**: Save, copy, paste, and export symbols
- **Navigation**: React Router-based navigation with browser history support

### AI Service
- **REST API**: HTTP endpoints for AI symbol generation
- **Claude Integration**: Uses Claude Sonnet 4 for intelligent symbol generation
- **Validation**: Request validation with proper error handling
- **CORS Support**: Configured for client application integration

## Quick Start

### Development
```bash
# Start both client and server
npm run dev:all

# Or start individually
npm run dev        # Client only (default)
npm run dev:server # Server only
```

### URLs
- **Client**: http://localhost:5173
- **Server**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## Workspace Commands

```bash
# Install all dependencies
npm install

# Build all packages
npm run build

# Run tests (client)
npm run test

# Type checking (all packages)
npm run typecheck

# Linting (all packages)
npm run lint
```

## Package-Specific Commands

```bash
# Run commands in specific workspace
npm run dev --workspace=packages/client
npm run build --workspace=packages/server

# Or use workspace shortcuts
npm run dev        # → packages/client
npm run dev:server # → packages/server
```

## Environment Setup

This project uses a hierarchical environment configuration system:

### Environment Files Priority (highest to lowest)
1. **`.env.local`** - Local development overrides (ignored by git)
2. **`.env`** - Production/shared environment variables (tracked by git)
3. **`.env.example`** - Template with example values (tracked by git)

### Client Environment (`packages/client/`)

**For Development:**
```bash
# Copy example and customize for local development
cp packages/client/.env.example packages/client/.env.local
# Edit .env.local with your local settings
```

**Environment Variables:**
```env
# packages/client/.env.local (for development)
VITE_AI_SERVICE_URL=http://localhost:3001
```

### Server Environment (`packages/server/`)

**For Development:**
```bash
# Copy example and customize for local development  
cp packages/server/.env.example packages/server/.env.local
# Edit .env.local with your actual API key
```

**Environment Variables:**
```env
# packages/server/.env.local (for development)
ANTHROPIC_API_KEY=your_actual_anthropic_api_key_here
PORT=3001
```

### File Structure
```
packages/
├── client/
│   ├── .env.example     # Template (tracked)
│   ├── .env            # Production config (tracked)  
│   └── .env.local      # Development config (ignored)
└── server/
    ├── .env.example    # Template (tracked)
    ├── .env           # Production config (tracked)
    └── .env.local     # Development config (ignored)
```

**Security Notes:**
- `.env.local` files are git-ignored and contain sensitive data
- `.env` files are tracked for production deployment
- Always use `.env.local` for development with real API keys

## AI Integration

The application uses a server-side AI integration approach:

- **Client**: Makes HTTP requests to the REST API service
- **Server**: Handles Claude AI integration with enhanced prompts
- **Benefits**: No API key exposure in browser, centralized AI logic, enhanced prompts
- **Requirements**: Server must be running for AI functionality

## Development

This project uses npm workspaces for monorepo management. Each package maintains its own dependencies while sharing common development tools at the root level.

### Tech Stack
- **Frontend**: React 19, TypeScript, Vite, @react-rxjs
- **Backend**: Express, TypeScript, Claude AI SDK
- **Testing**: Playwright (E2E)
- **Validation**: Zod
- **State Management**: RxJS with @react-rxjs