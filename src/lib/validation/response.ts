/**
 * Validation for response submissions — the single source of truth shared by
 * the API route (server-side enforcement) and the final scene form (UX hints).
 */

export const RESPONSE_VALUES = ["yes", "time", "talk", "no", "message"] as const;
export type ResponseValue = (typeof RESPONSE_VALUES)[number];

export const MESSAGE_MAX_LENGTH = 3000;
/** Hidden anti-spam field — real users never fill it. */
export const HONEYPOT_FIELD = "website";
/** Localstorage key for the idempotency token that prevents accidental duplicates. */
export const CLIENT_TOKEN_STORAGE_KEY = "iycHMh-client-token";

export interface ParsedSubmission {
  response: ResponseValue;
  message: string | null;
  clientToken: string | null;
}

export type ParseResult =
  | { ok: true; data: ParsedSubmission }
  | { ok: false; error: string };

function isResponseValue(value: unknown): value is ResponseValue {
  return typeof value === "string" && (RESPONSE_VALUES as readonly string[]).includes(value);
}

/**
 * Validates and normalizes a submission body.
 * Returns a typed, trimmed, length-checked result or a safe error string.
 */
export function parseSubmission(body: unknown): ParseResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Please send a valid response." };
  }

  const record = body as Record<string, unknown>;

  if (!isResponseValue(record.response)) {
    return { ok: false, error: "Please choose one of the available responses." };
  }

  // A free-written message needs words; everything else may send without one.
  if (record.response === "message") {
    const hasText = typeof record.message === "string" && record.message.trim().length > 0;
    if (!hasText) {
      return { ok: false, error: "Please write a few words from your heart — or choose one of the four options instead." };
    }
  }

  let message: string | null = null;
  if (typeof record.message === "string" && record.message.trim().length > 0) {
    message = record.message.trim();
    message = message.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
    if (message.length === 0) {
      message = null;
    }
  }

  if (message && message.length > MESSAGE_MAX_LENGTH) {
    return { ok: false, error: `Your message is a little too long — please keep it under ${MESSAGE_MAX_LENGTH} characters.` };
  }

  let clientToken: string | null = null;
  if (typeof record.clientToken === "string" && record.clientToken.length > 0) {
    // Tokens are UUIDs generated in the browser; cap length defensively.
    clientToken = record.clientToken.slice(0, 64).replace(/[^a-zA-Z0-9-]/g, "");
    if (clientToken.length === 0) clientToken = null;
  }

  return { ok: true, data: { response: record.response, message, clientToken } };
}

/** Human-readable labels, used by the dashboard and the notification email. */
export const RESPONSE_LABELS: Record<ResponseValue, string> = {
  yes: "Yes — she wants to try again",
  time: "She needs some time to think",
  talk: "She wants to talk first",
  no: "She doesn't think she can continue",
  message: "She wrote something from her heart",
};
