# Dot Matrix AI Service

REST API service for generating dot-matrix symbols using Claude AI.

## Features

- **AI Symbol Generation**: Generate 9x7 pixel symbols for any character using Claude Sonnet 4
- **REST API**: Simple HTTP API for integration with the client application
- **Validation**: Request validation using Zod schemas
- **CORS Support**: Cross-origin requests enabled for client integration

## API Endpoints

### Health Check
```
GET /health
```

Returns service status.

### Generate Symbol
```
POST /api/predict
Content-Type: application/json

{
  "character": "A"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "A",
    "data": [true, false, true, ...]
  }
}
```

## Setup

1. **Environment Variables**
   ```bash
   # Copy example file for development
   cp .env.example .env.local
   
   # Edit .env.local with your actual API key
   # This file is git-ignored and automatically loaded by dotenv
   ```

2. **Development**
   ```bash
   npm run dev
   ```

3. **Production**
   ```bash
   npm run build
   npm start
   ```

## Environment Variables

This project uses a hierarchical environment configuration:

### Environment Files (priority order)
1. **`.env.local`** - Development overrides (git-ignored)
2. **`.env`** - Production configuration (tracked)
3. **`.env.example`** - Template file (tracked)

### Setup for Development
```bash
# Copy template and customize
cp .env.example .env.local
# Edit .env.local with your actual API key
```

### Variables
- `ANTHROPIC_API_KEY` - Required. Your Anthropic API key for Claude AI
- `PORT` - Optional. Server port (defaults to 3001)

**Example `.env.local`:**
```env
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
PORT=3001
```

**Security:** Always use `.env.local` for development with real API keys. This file is automatically loaded by dotenv and ignored by git.

## Data Format

The service returns symbol data as a boolean array representing a 9x7 pixel grid in column-major order, matching the client application's internal format.