import express from 'express';
import route from './routes/index.js';
import helmet from 'helmet';
import { globalErrorHandler } from './middlewares/errorHandles.middleware.js';

const app = express();

app.use(helmet());

app.use(express.json());
app.use('/api/v1', route);

app.use(globalErrorHandler);

export default app;
