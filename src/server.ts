import app from './app.js';
import { config } from './config/index.js';
import { redisService } from './config/redis.js';

const PORT = config.port;

const startServer = async () => {
  try {
    await redisService.connect();

    app.listen(PORT, () => {
      console.log(`Server url is http://localhost:${PORT}`);
    });

    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, closing server...');
      await redisService.disconnect();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received, closing server...');
      await redisService.disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
