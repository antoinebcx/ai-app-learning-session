/**
 * GET /api/scenarios — list the available demo scenarios.
 * The frontend uses this to render the scenario picker, the editable system
 * prompt, and the tool toggle list. Handlers are stripped before sending.
 */
import { Router } from 'express';
import { listScenarios } from '../scenarios/index.js';

export const scenariosRouter = Router();

scenariosRouter.get('/', (_req, res) => {
  res.json(listScenarios());
});
