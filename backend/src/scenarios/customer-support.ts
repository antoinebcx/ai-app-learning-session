/**
 * "Customer support" demo scenario for the fictional brand Lumen Co.
 * Showcases the classic agent loop: look up data, check policy, take action,
 * escalate when stuck. All "data" lives in an in-memory `orders` object —
 * intentionally trivial so attendees can read the whole file in one sitting.
 */
import type { Scenario } from './types.js';

type Order = {
  id: string;
  customer: string;
  item: string;
  status: 'processing' | 'shipped' | 'delivered' | 'returned';
  price: number;
  deliveredAt?: string;
};

const orders: Record<string, Order> = {
  'ORD-1001': {
    id: 'ORD-1001',
    customer: 'alice@example.com',
    item: 'Lumen Glow Lamp',
    status: 'delivered',
    price: 79,
    deliveredAt: '2026-05-02',
  },
  'ORD-1002': {
    id: 'ORD-1002',
    customer: 'bob@example.com',
    item: 'Lumen Pulse Speaker',
    status: 'shipped',
    price: 149,
  },
  'ORD-1003': {
    id: 'ORD-1003',
    customer: 'carol@example.com',
    item: 'Lumen Pulse Speaker',
    status: 'delivered',
    price: 149,
    deliveredAt: '2026-03-01',
  },
  'ORD-1004': {
    id: 'ORD-1004',
    customer: 'dan@example.com',
    item: 'Lumen Glow Bulb (4-pack)',
    status: 'processing',
    price: 39,
  },
};

const REFUND_WINDOW_DAYS = 30;

export const customerSupport: Scenario = {
  id: 'customer-support',
  name: 'Customer support — Lumen Co.',
  tagline: 'A support agent for a fictional smart-home brand. Looks up orders, checks refund policy, and escalates.',
  defaultInstructions: `You are a friendly support agent for Lumen Co., a smart-home brand.
Help customers with orders, deliveries, and refund requests.

Always:
- Look up the order before promising anything.
- Check refund eligibility before issuing a refund (policy: delivered orders within ${REFUND_WINDOW_DAYS} days).
- If a request is outside policy, ambiguous, or sensitive, escalate to a human.
- Keep replies short and warm.`,
  suggestedPrompts: [
    'Hi, I want to return my Lumen Pulse Speaker, order ORD-1003.',
    "I never got my order ORD-1002, can you check what's happening?",
    'My lamp from order ORD-1001 stopped working last night. Can I get a refund?',
    'Is order ORD-1004 shipped yet?',
  ],
  tools: [
    {
      type: 'function',
      name: 'lookup_order',
      description: 'Fetch an order by its ID. Returns customer email, item, status, price, and delivery date when available.',
      parameters: {
        type: 'object',
        properties: {
          order_id: { type: 'string', description: 'Order ID like "ORD-1001".' },
        },
        required: ['order_id'],
        additionalProperties: false,
      },
      strict: true,
    },
    {
      type: 'function',
      name: 'check_refund_eligibility',
      description: `Check whether an order qualifies for a refund under the ${REFUND_WINDOW_DAYS}-day delivered-policy. Returns eligible (bool) and a reason.`,
      parameters: {
        type: 'object',
        properties: {
          order_id: { type: 'string' },
        },
        required: ['order_id'],
        additionalProperties: false,
      },
      strict: true,
    },
    {
      type: 'function',
      name: 'issue_refund',
      description: 'Issue a refund for an order. Only call this after check_refund_eligibility returns eligible=true.',
      parameters: {
        type: 'object',
        properties: {
          order_id: { type: 'string' },
          reason: { type: 'string', description: 'Short human-readable reason for the refund.' },
        },
        required: ['order_id', 'reason'],
        additionalProperties: false,
      },
      strict: true,
    },
    {
      type: 'function',
      name: 'escalate_to_human',
      description: 'Hand the conversation to a human support agent. Use for cases outside policy, sensitive complaints, or anything you cannot resolve with the tools above.',
      parameters: {
        type: 'object',
        properties: {
          reason: { type: 'string', description: 'Why escalation is needed.' },
        },
        required: ['reason'],
        additionalProperties: false,
      },
      strict: true,
    },
  ],
  handlers: {
    lookup_order: ({ order_id }) => {
      const o = orders[order_id as string];
      return o ?? { error: `No order found with id ${order_id}` };
    },
    check_refund_eligibility: ({ order_id }) => {
      const o = orders[order_id as string];
      if (!o) return { eligible: false, reason: 'order not found' };
      if (o.status !== 'delivered') {
        return { eligible: false, reason: `order status is "${o.status}"; only delivered orders can be refunded` };
      }
      const days = Math.floor((Date.now() - new Date(o.deliveredAt!).getTime()) / (1000 * 60 * 60 * 24));
      if (days > REFUND_WINDOW_DAYS) {
        return { eligible: false, reason: `delivered ${days} days ago, policy window is ${REFUND_WINDOW_DAYS} days` };
      }
      return { eligible: true, days_since_delivery: days };
    },
    issue_refund: ({ order_id, reason }) => {
      return {
        ok: true,
        refunded_at: new Date().toISOString(),
        order_id,
        reason,
      };
    },
    escalate_to_human: ({ reason }) => {
      const ticket = `T-${Math.floor(Math.random() * 9000) + 1000}`;
      return { escalated: true, ticket, reason };
    },
  },
};
