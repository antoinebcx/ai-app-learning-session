/**
 * The singleton OpenAI SDK client used by the whole backend.
 * Holding the API key on the server (never in the browser) is the entire
 * reason this backend exists — see /api/chat for the proxy that uses it.
 */
import OpenAI from 'openai';
import { env } from './env.js';

export const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
