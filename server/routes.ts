import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running with Firebase" });
  });

  // All other API routes will be handled by Firebase on the client side
  app.get("/api/*", (req, res) => {
    res.status(404).json({ 
      message: "API endpoint not found - using Firebase client-side",
      note: "All data operations are now handled by Firebase Firestore on the client"
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}