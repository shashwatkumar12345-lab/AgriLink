import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use('/api/gemini', (req, res, next) => {
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not defined in the environment.");
      return res.status(500).json({ error: "GEMINI_API_KEY is missing. Please configure it in the settings." });
    }
    next();
  }, createProxyMiddleware({
    target: 'https://generativelanguage.googleapis.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api/gemini': '', // remove base path
    },
    on: {
      proxyReq: (proxyReq, req, res) => {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
          proxyReq.setHeader('x-goog-api-key', apiKey);
        }
      }
    }
  }));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
