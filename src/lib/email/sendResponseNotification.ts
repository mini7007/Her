import { Resend } from "resend";
import { RESPONSE_LABELS, type ResponseValue } from "@/lib/validation/response";
import { renderMessageAsHtml, escapeHtml } from "@/lib/security/sanitize";

/**
 * Resend notification — sent AFTER a successful database insert.
 * A failed email must never undo or fail the submission.
 * Personal message contents are never logged.
 */

export interface NotificationPayload {
  response: ResponseValue;
  message: string | null;
  submittedAt: Date;
}

export type NotificationResult =
  | { sent: true }
  | { sent: false; reason: "not_configured" | "error" };

export function buildOwnerDashboardUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
    "http://localhost:3000";
  return `${base}/owner`;
}

export async function sendResponseNotification(
  payload: NotificationPayload
): Promise<NotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.OWNER_EMAIL;
  const from = process.env.RESEND_FROM || "If You Could Hear My Heart <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.warn(
      "[email] RESEND_API_KEY or OWNER_EMAIL missing — notification skipped (submission is already saved)."
    );
    return { sent: false, reason: "not_configured" };
  }

  const subject = "Bacha has responded to your letter ❤️";
  const dashboardUrl = buildOwnerDashboardUrl();
  const submittedAt = payload.submittedAt.toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  const html = `
  <!doctype html>
  <html>
    <body style="margin:0;padding:0;background:#09070B;font-family:Georgia,serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#09070B;padding:32px 16px;">
        <tr><td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#300D20;border-radius:16px;border:1px solid rgba(220,167,181,0.25);overflow:hidden;">
            <tr>
              <td style="padding:28px 32px 8px;">
                <p style="margin:0;font-size:12px;letter-spacing:0.25em;text-transform:uppercase;color:#DCA7B5;">If You Could Hear My Heart</p>
                <h1 style="margin:12px 0 0;font-size:24px;font-weight:400;color:#FFF5ED;">${escapeHtml(subject)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 8px;">
                <p style="margin:0 0 16px;font-size:16px;color:#E8D6B5;">
                  <strong style="color:#FFF5ED;">Response:</strong> ${escapeHtml(RESPONSE_LABELS[payload.response])}
                </p>
                ${
                  payload.message
                    ? `<div style="margin:0 0 16px;padding:16px 20px;background:rgba(255,245,237,0.06);border-left:2px solid #651B35;border-radius:8px;">
                         <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#DCA7B5;">Her message</p>
                         <div style="color:#FFF5ED;font-size:15px;line-height:1.7;">${renderMessageAsHtml(payload.message)}</div>
                       </div>`
                    : `<p style="margin:0 0 16px;font-size:15px;color:rgba(255,245,237,0.6);">No message was attached.</p>`
                }
                <p style="margin:0 0 24px;font-size:14px;color:rgba(255,245,237,0.65);">Received: ${escapeHtml(submittedAt)}</p>
                <p style="margin:0 0 32px;">
                  <a href="${escapeHtml(dashboardUrl)}"
                     style="display:inline-block;background:#651B35;color:#FFF5ED;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:14px;">
                    Open your private dashboard
                  </a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 28px;border-top:1px solid rgba(220,167,181,0.15);">
                <p style="margin:0;font-size:12px;color:rgba(255,245,237,0.45);">This link is protected by your owner login. Whatever her heart said — breathe, and listen first. ❤️</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
  </html>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({ from, to, subject, html });
    if (error) {
      // Log the provider error only — never the message contents.
      console.error("[email] Resend rejected the notification:", error.message);
      return { sent: false, reason: "error" };
    }
    return { sent: true };
  } catch (err) {
    console.error(
      "[email] Notification failed:",
      err instanceof Error ? err.message : "unknown error"
    );
    return { sent: false, reason: "error" };
  }
}
