/** Escape text for safe interpolation into HTML (email bodies). */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Render stored plain-text messages safely (paragraphs on newlines). */
export function renderMessageAsHtml(message: string): string {
  return escapeHtml(message)
    .split(/\r?\n/)
    .map((line) => (line.trim().length > 0 ? `<p>${line}</p>` : "<p>&nbsp;</p>"))
    .join("");
}
