/**
 * Playground page.
 * Three-pane layout glued together by the `usePlayground` hook:
 *
 *   ScenarioPanel (left)  │  ChatPanel (center)  │  EventPanel (right)
 *
 * Everything stateful lives in the hook; the panels are presentational.
 */
import { usePlayground } from '../playground/usePlayground';
import { ScenarioPanel } from '../playground/ScenarioPanel';
import { ChatPanel } from '../playground/ChatPanel';
import { EventPanel } from '../playground/EventPanel';

export function PlaygroundPage() {
  const p = usePlayground();

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <ScenarioPanel
        scenarios={p.scenarios}
        selected={p.selected}
        onSelect={p.selectScenario}
        instructions={p.instructions}
        onInstructionsChange={p.setInstructions}
        enabledTools={p.enabledTools}
        onToggleTool={p.toggleTool}
      />
      <ChatPanel
        scenario={p.selected}
        messages={p.uiMessages}
        streaming={p.streaming}
        error={p.error}
        onSend={p.send}
        onAbort={p.abort}
        onReset={p.resetConversation}
      />
      <EventPanel events={p.events} />
    </div>
  );
}
