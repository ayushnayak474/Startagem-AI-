import { app } from './server/app.js';
import { seedDemoData } from './server/db/seedDemo.js';
import path from 'path';
import express from 'express';
import fs from 'fs';

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  // Ensure demo user & pre-computed decisions are seeded
  try {
    await seedDemoData();
  } catch (err) {
    console.warn('Initial demo seed warning:', err);
  }

  if (!isProduction) {
    // Mount Vite in development mode
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('⚡ Vite development middleware mounted');
  } else {
    // Serve static files in production
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
      console.log('📦 Serving production build from dist/');
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Stratagem AI running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
