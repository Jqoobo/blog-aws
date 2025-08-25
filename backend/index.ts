import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import config from './config';
import { serveSwagger, setupSwagger } from './swagger';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import commentRoutes from './routes/comments';
import tagRoutes from './routes/tags';
import errorHandler from './middleware/errorHandler';

const app: Application = express();

app.use(helmet());
app.use(hpp());
app.use(compression());

if (!config.isProd) {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use('/swagger', serveSwagger, setupSwagger);

app.get('/', (_req: Request, res: Response) => res.send('MERN Blog API is running'));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/tags', tagRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ status: 'error', message: 'Not Found' });
});

app.use(errorHandler);

mongoose
  .connect(config.mongodbUrl)
  .then(() => {
    const server = app.listen(config.port, () =>
      console.log(`Server runs on http://localhost:${config.port}`)
    );
    ['SIGINT', 'SIGTERM'].forEach((sig) =>
      process.on(sig, () => {
        console.log(`\n🔌 Shutdown (${sig})`);
        server.close(() =>
          mongoose.disconnect().then(() => process.exit(0))
        );
      })
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
