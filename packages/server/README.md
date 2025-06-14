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
   cp .env.example .env
   # Edit .env and add your ANTHROPIC_API_KEY
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

- `ANTHROPIC_API_KEY` - Required. Your Anthropic API key for Claude AI
- `PORT` - Optional. Server port (defaults to 3001)

## Data Format

The service returns symbol data as a boolean array representing a 9x7 pixel grid in column-major order, matching the client application's internal format.