import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { modelsRouter } from './routes/models';
import { proxyRouter } from './routes/proxy';
import { recommendRouter } from './routes/recommend';
import { adminRouter } from './routes/admin';
import { heartbeatRouter } from './routes/heartbeat';
import { adminRouter } from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/models', modelsRouter);
app.use('/api/proxy', proxyRouter);
app.use('/api/recommend', recommendRouter);
app.use('/api/admin', adminRouter);
app.use('/api/admin/heartbeat', heartbeatRouter);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🧭 ModelCompass API running on port ${PORT}`);
});
