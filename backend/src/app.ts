import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes';

export const app = express();

// 1. Helmet PRIMERO, con CSP completo
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
      baseUri: ["'self'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false
}));

// 2. CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true
}));

// 3. Body parser
app.use(express.json({ limit: '10kb' }));

// 4. Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas solicitudes, intenta más tarde' }
});
app.use('/api', limiter);

// 5. Rutas de la API
app.use('/api/auth', authRoutes);

// 6. Ruta /health
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 7. robots.txt (evita que ZAP lo marque como 404)
app.get('/robots.txt', (_req: Request, res: Response) => {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /api/\n');
});

// 8. sitemap.xml (evita que ZAP lo marque como 404)
app.get('/sitemap.xml', (_req: Request, res: Response) => {
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>http://localhost:3000/health</loc></url>
</urlset>`);
});

// 9. Handler 404 explícito (también con Helmet aplicado)
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada', path: req.path });
});

// 10. Error handler global
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});