// every knob of the chat lives here; the model and budget can be changed from the environment without a deploy
export const CHAT = {
  model: process.env.CHAT_MODEL || "claude-haiku-4-5",
  // ~120 words of answer plus the sources line, with room to spare
  maxOutputTokens: 700,
  maxQuestionChars: 1000,
  // the last N messages (user + assistant) sent back as context
  historyMessages: 10,
  rateLimit: { requests: 20, window: "10 m" as const, windowMs: 10 * 60_000 },
  // daily spend in "input-token equivalents" (output ×5, cache write ×1.25, cache read ×0.1), ~$1.5/day on Haiku 4.5
  dailyBudget: Number(process.env.CHAT_DAILY_TOKEN_BUDGET) || 1_500_000,
  requestTimeoutMs: 25_000,
} as const;
