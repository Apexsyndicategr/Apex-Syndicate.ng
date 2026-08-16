import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import apiRoutes from './server/routes/api';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Mount API Endpoints FIRST
  app.use('/api', apiRoutes);

  // Serve static public downloads folder
  const publicDownloadsPath = path.join(process.cwd(), 'public');
  app.use(express.static(publicDownloadsPath));

  // Vite middleware for development vs static fallback in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[APEX SYNDICATE] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
