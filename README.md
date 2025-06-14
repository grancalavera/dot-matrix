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

### Client
Create `packages/client/.env.local`:
```env
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Server
Create `packages/server/.env`:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
PORT=3001
```

## AI Integration Options

The application supports two AI integration modes:

1. **Client-Side**: Direct Claude API calls from the browser (original implementation)
2. **Server-Side**: API calls through the REST service (new monorepo feature)

Both implementations are maintained for flexibility and can be switched based on requirements.

## Development

This project uses npm workspaces for monorepo management. Each package maintains its own dependencies while sharing common development tools at the root level.

### Tech Stack
- **Frontend**: React 19, TypeScript, Vite, @react-rxjs
- **Backend**: Express, TypeScript, Claude AI SDK
- **Testing**: Playwright (E2E)
- **Validation**: Zod
- **State Management**: RxJS with @react-rxjs