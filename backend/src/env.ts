/**
 * Loads and validates environment variables from `.env`.
 * Centralising this here means the rest of the codebase imports a single typed
 * `env` object and never touches `process.env` directly. We fail fast at boot
 * if a required variable (e.g. OPENAI_API_KEY) is missing.
 */
import dotenv from 'dotenv';
dotenv.config();

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}. Copy .env.example to .env and fill it in.`);
  return v;
}

export const env = {
  OPENAI_API_KEY: required('OPENAI_API_KEY'),
  PORT: Number(process.env.PORT ?? 8787),
  DEFAULT_MODEL: process.env.DEFAULT_MODEL ?? 'gpt-5.4-mini',
};
