import express from 'express';
import route from './routes/index.js';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandle.middleware.js';
import { authMiddleware } from './middlewares/auth.middleware.js';
import { NotFoundError } from './core/apiError.js';

const app = express();

app.use(helmet());

app.use(express.json());

app.use(authMiddleware);

app.use('/api/v1', route);

app.use((req, res, next) => {
  next(new NotFoundError('Route not found'));
});

app.use(errorHandler);

export default app;
