import express from 'express';
import route from './routes/index.js';
import helmet from 'helmet';

const app = express();

app.use(helmet());

app.use(express.json());
app.use('/api/v1', route);

export default app;
