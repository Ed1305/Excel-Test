import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

// In-memory store for assessment results
const results: any[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API constraints
  app.get("/api/results", (req, res) => {
    res.json(results);
  });

  app.post("/api/results", (req, res) => {
    const newResult = {
      ...req.body,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString()
    };
    results.unshift(newResult);
    res.status(201).json({ success: true, id: newResult.id });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production fallback
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
