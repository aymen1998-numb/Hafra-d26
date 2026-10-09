import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    // Rewrite admin routes to /admin/index.html before vite.middlewares
    app.use((req, res, next) => {
      const urlPath = req.url.split('?')[0];
      if (urlPath === '/admin' || urlPath.startsWith('/admin/')) {
        // If not requesting a static asset file with extension (e.g. .js, .css, .tsx, .png)
        if (!urlPath.match(/\.[a-zA-Z0-9]+$/) || urlPath.endsWith('.html')) {
          req.url = '/admin/index.html' + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');
        }
      }
      next();
    });

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "mpa", // Multi-page app
    });
    app.use(vite.middlewares);

  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // Serve admin SPA
    app.get('/admin', (req, res) => res.sendFile(path.join(distPath, 'admin', 'index.html')));
    app.get('/admin/*', (req, res) => res.sendFile(path.join(distPath, 'admin', 'index.html')));
    
    // Serve main app
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
