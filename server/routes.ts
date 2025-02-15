import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertProductSchema } from "@shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Products API
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.post("/api/products", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.sendStatus(403);
    }

    const result = insertProductSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }

    const product = await storage.createProduct(result.data);
    res.status(201).json(product);
  });

  app.delete("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.sendStatus(403);
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.sendStatus(400);
    }

    await storage.deleteProduct(id);
    res.sendStatus(204);
  });

  app.patch("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.sendStatus(403);
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.sendStatus(400);
    }

    const result = insertProductSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }

    const product = await storage.updateProduct(id, result.data);
    if (!product) {
      return res.sendStatus(404);
    }

    res.json(product);
  });

  const httpServer = createServer(app);
  return httpServer;
}
