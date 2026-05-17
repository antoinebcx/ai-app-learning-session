/**
 * AgentLoopDiagram — the hero diagram of the deck.
 *
 * A sequence diagram (USER · LLM · TOOL lifelines) animates an agent turn:
 *   user message → LLM → function_call → tool → result → LLM → answer.
 * The active arrow + lifeline pulse on each phase. Plays on mount, loops,
 * and can be replayed via the button.
 */
import { useEffect, useState } from 'react';
import { Button } from '../../design/Button';

type Phase =
  | 'idle'
  | 'user-in'
  | 'llm-1'
  | 'tool-call'
  | 'tool-run'
  | 'tool-return'
  | 'llm-2'
  | 'final';

type Lane = 'USER' | 'LLM' | 'TOOL';

type Message = {
  id: string;
  from: Lane;
  to: Lane;
  label: string;
  y: number;
  phase: Phase;
};

const LANES: { id: Lane; x: number; tone: 'ink' | 'accent' | 'amber'; sub: string }[] = [
  { id: 'USER', x: 100, tone: 'ink', sub: 'your app' },
  { id: 'LLM', x: 410, tone: 'accent', sub: 'the model' },
  { id: 'TOOL', x: 720, tone: 'amber', sub: 'your code' },
];

const MESSAGES: Message[] = [
  { id: 'm1', from: 'USER', to: 'LLM', label: 'user message',         y: 90,  phase: 'user-in' },
  { id: 'm2', from: 'LLM',  to: 'TOOL', label: 'function_call',        y: 200, phase: 'tool-call' },
  { id: 'm3', from: 'TOOL', to: 'LLM',  label: 'function_call_output', y: 290, phase: 'tool-return' },
  { id: 'm4', from: 'LLM',  to: 'USER', label: 'assistant message',    y: 400, phase: 'final' },
];

const SEQUENCE: { phase: Phase; ms: number }[] = [
  { phase: 'user-in',     ms: 700 },
  { phase: 'llm-1',       ms: 800 },
  { phase: 'tool-call',   ms: 700 },
  { phase: 'tool-run',    ms: 700 },
  { phase: 'tool-return', ms: 700 },
  { phase: 'llm-2',       ms: 800 },
  { phase: 'final',       ms: 800 },
  { phase: 'idle',        ms: 1500 },
];

export function AgentLoopDiagram() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [run, setRun] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let i = 0;
    const tick = () => {
      if (cancelled) return;
      const step = SEQUENCE[i % SEQUENCE.length];
      setPhase(step.phase);
      i += 1;
      window.setTimeout(tick, step.ms);
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, [run]);

  const llmActive = phase === 'llm-1' || phase === 'llm-2' || phase === 'user-in' || phase === 'tool-return';
  const toolActive = phase === 'tool-call' || phase === 'tool-run' || phase === 'tool-return';
  const userActive = phase === 'user-in' || phase === 'final';

  return (
    <div className="rounded-xl border border-line bg-surface p-6 sm:p-8 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            One agent turn
          </div>
          <div className="mt-1 text-xs font-mono text-ink-soft h-4">
            {phaseLabel(phase)}
          </div>
        </div>
        <Button size="sm" variant="secondary" onClick={() => setRun((r) => r + 1)}>
          Replay
        </Button>
      </div>

      <svg viewBox="0 0 820 480" className="w-full h-auto">
        <defs>
          <marker id="ah-idle" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#A1A1AA" />
          </marker>
          <marker id="ah-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#10A37F" />
          </marker>
          <marker id="ah-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#D97706" />
          </marker>
        </defs>

        {/* Lifelines */}
        {LANES.map((lane) => {
          const active =
            (lane.id === 'USER' && userActive) ||
            (lane.id === 'LLM' && llmActive) ||
            (lane.id === 'TOOL' && toolActive);
          return (
            <g key={lane.id}>
              {/* Lifeline header */}
              <rect
                x={lane.x - 70}
                y={20}
                width={140}
                height={36}
                rx={6}
                fill={active ? toneFill(lane.tone) : '#FFFFFF'}
                stroke={toneStroke(lane.tone)}
                strokeWidth={active ? 2 : 1}
                className="transition-all duration-300"
              />
              <text
                x={lane.x}
                y={38}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontFamily="JetBrains Mono, monospace"
                fill={active ? toneText(lane.tone) : toneStroke(lane.tone)}
                fontWeight="600"
              >
                {lane.id}
              </text>
              <text
                x={lane.x}
                y={70}
                textAnchor="middle"
                fontSize="10"
                fill="#A1A1AA"
              >
                {lane.sub}
              </text>
              {/* Dashed lifeline */}
              <line
                x1={lane.x}
                y1={80}
                x2={lane.x}
                y2={460}
                stroke={active ? toneStroke(lane.tone) : '#E4E4E7'}
                strokeDasharray="4 4"
                strokeWidth={active ? 1.5 : 1}
                className="transition-all duration-300"
              />
            </g>
          );
        })}

        {/* Messages */}
        {MESSAGES.map((m) => {
          const from = LANES.find((l) => l.id === m.from)!;
          const to = LANES.find((l) => l.id === m.to)!;
          const active = phase === m.phase;
          const dx = to.x > from.x ? -8 : 8; // arrowhead clearance
          const tone =
            m.from === 'TOOL' || m.to === 'TOOL' ? 'amber' : 'accent';
          const stroke = active ? toneStroke(tone) : '#A1A1AA';
          const marker = active
            ? tone === 'amber'
              ? 'ah-amber'
              : 'ah-accent'
            : 'ah-idle';
          const labelX = (from.x + to.x) / 2;

          return (
            <g key={m.id} className="transition-opacity">
              <line
                x1={from.x + (to.x > from.x ? 8 : -8)}
                y1={m.y}
                x2={to.x + dx}
                y2={m.y}
                stroke={stroke}
                strokeWidth={active ? 2.5 : 1.5}
                markerEnd={`url(#${marker})`}
                className="transition-all duration-300"
              />
              <text
                x={labelX}
                y={m.y - 8}
                textAnchor="middle"
                fontSize="11"
                fontFamily="JetBrains Mono, monospace"
                fill={active ? toneText(tone) : '#52525B'}
                className="transition-all duration-300"
              >
                {m.label}
              </text>
            </g>
          );
        })}

        {/* Loop annotation */}
        <g opacity={toolActive ? 1 : 0.25} className="transition-opacity">
          <path
            d="M 600 175 C 660 220, 660 270, 600 305"
            stroke="#D97706"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            fill="none"
          />
          <text
            x={680}
            y={245}
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
            fill="#D97706"
          >
            loop while
          </text>
          <text
            x={680}
            y={260}
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
            fill="#D97706"
          >
            tools called
          </text>
        </g>
      </svg>

      <p className="mt-2 text-sm text-ink-soft max-w-2xl">
        That's the entire loop. Everything else — built-in tools, structured
        outputs, multi-step plans — is variation on this theme.
      </p>
    </div>
  );
}

function phaseLabel(p: Phase): string {
  switch (p) {
    case 'idle':        return '—';
    case 'user-in':     return 'user message arrives';
    case 'llm-1':       return 'LLM reasons';
    case 'tool-call':   return 'LLM calls a tool';
    case 'tool-run':    return 'tool runs';
    case 'tool-return': return 'tool returns result';
    case 'llm-2':       return 'LLM resumes';
    case 'final':       return 'assistant replies';
  }
}

function toneFill(tone: 'ink' | 'accent' | 'amber'): string {
  if (tone === 'accent') return '#ECFDF5';
  if (tone === 'amber') return '#FEF3C7';
  return '#F4F4F5';
}
function toneStroke(tone: 'ink' | 'accent' | 'amber'): string {
  if (tone === 'accent') return '#10A37F';
  if (tone === 'amber') return '#D97706';
  return '#52525B';
}
function toneText(tone: 'ink' | 'accent' | 'amber'): string {
  if (tone === 'accent') return '#047857';
  if (tone === 'amber') return '#92400E';
  return '#18181B';
}
