/**
 * Slide registry. Order in this array IS the presentation order.
 * Each entry pairs a slide component with its metadata so the Presentation
 * container can wire up navigation without inspecting JSX.
 */
import type { ComponentType } from 'react';
import type { SlideMeta } from '../Slide';

import { Intro } from './intro';
import { Slide_1_1 } from './s1_1_next_token';
import { Slide_1_2 } from './s1_2_tokens';
import { Slide_1_3 } from './s1_3_context';
import { Slide_1_4 } from './s1_4_hallucination';
import { Slide_2_1 } from './s2_1_agent_loop';
import { Slide_2_2 } from './s2_2_tool_contract';
import { Slide_2_3 } from './s2_3_builtins_custom';
import { Slide_2_4 } from './s2_4_grounding';
import { Slide_3_1 } from './s3_1_use_well';
import { Slide_3_2 } from './s3_2_pattern_ladder';
import { Slide_3_3 } from './s3_3_principles';
import { Outro } from './outro';

export type SlideEntry = {
  Component: ComponentType;
  meta: SlideMeta;
  title: string;
};

export const slides: SlideEntry[] = [
  { Component: Intro,      meta: { id: 'intro',  section: 'intro' },                                title: 'Building with AI, from first principles.' },
  { Component: Slide_1_1,  meta: { id: '1-1',    section: '1', sectionLabel: 'LLM',  number: '1.1' }, title: 'Hello, model.' },
  { Component: Slide_1_2,  meta: { id: '1-2',    section: '1', sectionLabel: 'LLM',  number: '1.2' }, title: 'Tokens, not letters.' },
  { Component: Slide_1_3,  meta: { id: '1-3',    section: '1', sectionLabel: 'LLM',  number: '1.3' }, title: 'Context window — the working memory.' },
  { Component: Slide_1_4,  meta: { id: '1-4',    section: '1', sectionLabel: 'LLM',  number: '1.4' }, title: 'Hallucination is the default failure mode.' },
  { Component: Slide_2_1,  meta: { id: '2-1',    section: '2', sectionLabel: 'Agent', number: '2.1' }, title: 'The agent loop.' },
  { Component: Slide_2_2,  meta: { id: '2-2',    section: '2', sectionLabel: 'Agent', number: '2.2' }, title: 'Tools are contracts.' },
  { Component: Slide_2_3,  meta: { id: '2-3',    section: '2', sectionLabel: 'Agent', number: '2.3' }, title: 'Built-in tools, custom tools.' },
  { Component: Slide_2_4,  meta: { id: '2-4',    section: '2', sectionLabel: 'Agent', number: '2.4' }, title: 'Grounding beats clever prompting.' },
  { Component: Slide_3_1,  meta: { id: '3-1',    section: '3', sectionLabel: 'Use',   number: '3.1' }, title: 'Use it well in your daily work.' },
  { Component: Slide_3_2,  meta: { id: '3-2',    section: '3', sectionLabel: 'Build', number: '3.2' }, title: 'Start simple, escalate.' },
  { Component: Slide_3_3,  meta: { id: '3-3',    section: '3', sectionLabel: 'Build', number: '3.3' }, title: 'The seven things that matter most.' },
  { Component: Outro,      meta: { id: 'outro',  section: 'outro' },                                title: 'Now let’s build.' },
];
