// Sample per-model data for the assistant. Which demo agent runs on which model,
// and how each model behaved in Tether's sandbox attack runs.
import { agentById } from "./data";
import { models } from "./run";

type ModelStats = {
  agents: string[];
  suiteCaught: number; // of 7
  caughtLate: number;
  followedInjection: number; // % of sandbox injection attempts the model acted on before Tether stepped in
  lastRun: string;
};

const stats: Record<string, ModelStats> = {
  "claude-sonnet-5-5": { agents: ["procurement", "support", "hr-helper"], suiteCaught: 7, caughtLate: 2, followedInjection: 6, lastRun: "Today 09:44" },
  "claude-opus-5-5": { agents: ["finance"], suiteCaught: 7, caughtLate: 0, followedInjection: 3, lastRun: "Yesterday" },
  "gpt-5": { agents: ["research"], suiteCaught: 7, caughtLate: 1, followedInjection: 7, lastRun: "2 days ago" },
  "gemini-2-5-pro": { agents: ["report-builder"], suiteCaught: 7, caughtLate: 1, followedInjection: 9, lastRun: "3 days ago" },
  "llama-4-maverick": { agents: ["onboarding"], suiteCaught: 7, caughtLate: 0, followedInjection: 12, lastRun: "2 days ago" },
};

export type ModelDetail = (typeof models)[number] & ModelStats & {
  agentNames: string[];
  actionsToday: number;
  topScore: number;
  topAgent: string;
};

export function modelDetail(id: string): ModelDetail {
  const m = models.find((x) => x.id === id)!;
  const s = stats[id];
  const list = s.agents.map((a) => agentById(a)!);
  const top = list.reduce((a, b) => (b.score > a.score ? b : a));
  return {
    ...m,
    ...s,
    agentNames: list.map((a) => a.name),
    actionsToday: list.reduce((n, a) => n + a.actionsToday, 0),
    topScore: top.score,
    topAgent: top.name,
  };
}

export const allModelIds = models.map((m) => m.id);
