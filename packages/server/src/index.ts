// Load environment files FIRST
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

import cors from "cors";
import express from "express";
import { z } from "zod";

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request validation schema
const PredictRequestSchema = z.object({
  character: z.string().min(1).max(1),
});

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "dot-matrix-ai-service" });
});

// AI prediction endpoint
app.post("/api/predict", async (req, res) => {
  try {
    // Validate request body
    const { character } = PredictRequestSchema.parse(req.body);

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({
        error: "Service temporarily unavailable",
        message: "AI prediction service is currently unavailable",
      });
    }

    // Dynamically import ai-service to ensure env vars are loaded
    const { predict } = await import("./ai-service.js");

    // Generate symbol prediction
    const result = await predict(character);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("AI prediction error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        message: "Character must be a single character string",
        details: error.errors,
      });
    }

    if (error instanceof Error) {
      // Don't expose internal error details that might reveal API key info
      const isAuthError =
        error.message.toLowerCase().includes("api key") ||
        error.message.toLowerCase().includes("authentication") ||
        error.message.toLowerCase().includes("unauthorized");

      if (isAuthError) {
        return res.status(503).json({
          error: "Service temporarily unavailable",
          message: "AI prediction service is currently unavailable",
        });
      }

      return res.status(500).json({
        error: "AI prediction failed",
        message: "Failed to generate symbol prediction",
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred",
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Dot Matrix AI Service running on port ${port}`);
  console.log(`📍 Health check: http://localhost:${port}/health`);
  console.log(`🤖 AI endpoint: http://localhost:${port}/api/predict`);
});
