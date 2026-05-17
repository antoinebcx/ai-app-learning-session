/**
 * Backend entry point.
 * Boots a small Express server that exposes two endpoints:
 *   - GET  /api/scenarios  — list the demo scenarios (customer-support, web-research)
 *   - POST /api/chat       — run an agent turn against the OpenAI Responses API
 * The frontend (Vite dev server) talks to this over HTTP/SSE in development.
 */
import express from 'express';
import cors from 'cors';
import { env } from './env.js';
import { scenariosRouter } from './routes/scenarios.js';
import { chatRouter } from './routes/chat.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/scenarios', scenariosRouter);
app.use('/api/chat', chatRouter);

app.listen(env.PORT, () => {
  console.log(`backend listening on http://localhost:${env.PORT}`);
});
