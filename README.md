# Building with AI — Learning Session

A small fullstack app for running a ~90-minute workshop on LLMs and AI agents.

Two parts:
1. **A 12–15 minute presentation** that builds a mental model: LLM → Agent → how to use & build with it.
2. **A working playground** the attendees extend live — pick a scenario, toggle tools, watch the agent loop fire on the event stream.

The whole repo is a teaching artifact: every source file opens with a short header explaining what it is and what's inside.

## Repository structure

```
ai-app-learning-session/
├── backend/      # Express + TypeScript proxy to the OpenAI Responses API
│   └── src/
│       ├── routes/        # /api/scenarios and the streaming /api/chat
│       ├── scenarios/     # demo scenarios (customer-support, web-research)
│       └── openai.ts      # the OpenAI client
│
├── frontend/     # Vite + React + Tailwind
│   └── src/
│       ├── design/        # tiny hand-rolled component primitives
│       ├── playground/    # the live three-pane scenario / chat / event UI
│       └── presentation/  # the scroll-snap deck (slides + illustrations)
│
└── docs/
    └── oai-responses-api.md   # the Responses API guide we built against
```

## Requirements

- Node 20+
- An OpenAI API key with access to `gpt-5.4-mini` (default model)

## Setup

```bash
# Backend
cd backend
cp .env.example .env       # then edit .env and paste your OPENAI_API_KEY
npm install

# Frontend (in another terminal)
cd ../frontend
npm install
```

## Run it

Two terminals, one each:

```bash
# Terminal A — backend on http://localhost:8787
cd backend && npm run dev

# Terminal B — frontend on http://localhost:5173
cd frontend && npm run dev
```

Then open **http://localhost:5173**.

The Vite dev server proxies `/api/*` requests to the backend, so the OpenAI key stays on the server — the browser never sees it.

## What we'll do during the session

1. **Walk the deck** (`/presentation`, ~15 min):
   - §1 **LLM** — next-token prediction, tokens, context window, hallucination.
   - §2 **Agent** — the loop, tool contracts, built-ins vs custom, grounding.
   - §3 **Use & build** — trust-stake matrix, pattern ladder, the seven principles.
   - Use **↓ / ↑ / Space** to move between slides.
2. **Open the playground** (`/playground`):
   - Pick a scenario (customer-support or web-research).
   - Try the suggested prompts; the right-hand panel shows every SSE event the agent emits — this is the magic.
   - Toggle a tool off and re-ask the same question to see how the agent adapts.
   - Edit the system prompt and watch behaviour change.
3. **Extend it live**:
   - Open `backend/src/scenarios/` in your IDE. Each scenario is one file with a system prompt, tool definitions, and handlers.
   - Add a new tool (or a new scenario) — refresh the playground and it shows up in the picker.

## Defaults & customisation

- **Model**: `gpt-5.4-mini`. Override by editing `DEFAULT_MODEL` in `backend/.env`.
- **Port**: backend `8787`, frontend `5173`. Override the backend port via `PORT` in `.env` (and update `vite.config.ts` if you do).
- **Design system**: a single neutral palette + one accent (OpenAI green). All tokens live in `frontend/tailwind.config.ts`; tweak them in one place.

## Build

```bash
# Frontend production bundle
cd frontend && npm run build

# Backend production build
cd backend && npm run build && npm start
```
