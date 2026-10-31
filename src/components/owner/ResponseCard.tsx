import { RESPONSE_LABELS, type ResponseValue } from "@/lib/validation/response";
import { cn } from "@/lib/utils";

export interface OwnerResponse {
  id: string;
  response: ResponseValue;
  message: string | null;
  status: "unread" | "read";
  submitted_at: string;
}

const BADGE_STYLES: Record<ResponseValue, string> = {
  yes: "border-champagne/50 bg-champagne/10 text-champagne",
  time: "border-rose/40 bg-rose/10 text-rose",
  talk: "border-ivory/30 bg-ivory/10 text-ivory/90",
  no: "border-wine/60 bg-wine/25 text-rose",
};

/** One submission card on the owner dashboard. */
export function ResponseCard({
  response,
  onToggleRead,
}: {
  response: OwnerResponse;
  onToggleRead: (id: string, next: "read" | "unread") => void;
}) {
  const submitted = new Date(response.submitted_at);

  return (
    <article
      className={cn(
        "rounded-2xl border p-5 transition-colors sm:p-6",
        response.status === "unread"
          ? "border-champagne/35 bg-burgundy/55"
          : "border-rose/15 bg-burgundy/30"
      )}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] tracking-wide",
            BADGE_STYLES[response.response]
          )}
        >
          {response.status === "unread" && (
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-rose" />
          )}
          {RESPONSE_LABELS[response.response]}
        </span>
        <time
          dateTime={response.submitted_at}
          className="text-xs tabular-nums text-ivory/45"
        >
          {submitted.toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
        <span className="ml-auto">
          <button
            type="button"
            onClick={() => onToggleRead(response.id, response.status === "read" ? "unread" : "read")}
            className="rounded-full border border-rose/20 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.15em] text-rose/80 transition-colors hover:border-rose/50 hover:text-champagne"
          >
            Mark as {response.status === "read" ? "unread" : "read"}
          </button>
        </span>
      </div>

      {response.message ? (
        <div className="mt-4 rounded-xl border border-rose/10 bg-midnight/50 p-4">
          <p className="whitespace-pre-wrap text-sm font-light leading-relaxed text-ivory/80">
            {response.message}
          </p>
        </div>
      ) : (
        <p className="mt-4 text-xs font-light italic text-ivory/35">
          No message — she chose to answer with her selection only.
        </p>
      )}
    </article>
  );
}
