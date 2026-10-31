import type { ResponseValue } from "@/lib/validation/response";

/** A memory card on the "Our Story" timeline. */
export interface TimelineMemory {
  id: string;
  /** Display date, e.g. "18 September 2023" or "Winter 2023". */
  date: string;
  title: string;
  description: string;
  category: TimelineCategoryId;
  photo?: MemoryPhoto;
  /**
   * True for empty-state placeholder cards. Placeholders are clearly
   * editorial (never presented as real memories) and exist so Mohan can
   * replace them with genuine moments in src/content/relationship.ts.
   */
  placeholder?: boolean;
}

export interface MemoryPhoto {
  /** Path inside /public, e.g. "/images/first-day.jpg". */
  src: string;
  alt: string;
  caption?: string;
}

export type TimelineCategoryId =
  | "beginning"
  | "memories"
  | "little-moments"
  | "laughter"
  | "conversations"
  | "dreams";

export interface TimelineCategory {
  id: TimelineCategoryId;
  title: string;
  /** Short line shown under the category title. */
  blurb: string;
}

/** One of the six commitment cards (Scene 06). */
export interface Commitment {
  number: string;
  title: string;
  description: string;
}

/** A playlist track. Artist may be empty — the UI hides empty artist names. */
export interface Track {
  id: string;
  title: string;
  artist: string;
  /** Path inside /public, e.g. "/music/khat.mp3". */
  src: string;
}

/** One of the four equally-respectful answer options (Scene 08). */
export interface ResponseOption {
  value: ResponseValue;
  label: string;
  /** Quiet helper line shown under the label. */
  helper: string;
}

/** A paragraph of the central love letter, with display semantics. */
export interface LetterPart {
  kind: "salutation" | "body" | "emphasis" | "signoff" | "signature" | "dedication";
  text: string;
}

export interface RelationshipContent {
  meta: {
    title: string;
    description: string;
  };
  sender: { name: string };
  recipient: { name: string };
  /** ISO date "YYYY-MM-DD" — interpreted as local midnight, visitor's timezone. */
  relationshipStartDateISO: string;
  opening: {
    heading: string;
    lines: string[];
    ctaLabel: string;
    skipLabel: string;
  };
  story: {
    heading: string;
    subheading: string;
    categories: TimelineCategory[];
    memories: TimelineMemory[];
    emptyState: { title: string; line: string };
  };
  apology: {
    heading: string;
    paragraphs: string[];
  };
  absence: {
    heading: string;
    paragraphs: string[];
  };
  letter: {
    heading: string;
    parts: LetterPart[];
    readFullyLabel: string;
  };
  commitments: {
    heading: string;
    items: Commitment[];
    closing: string[];
  };
  music: {
    heading: string;
    subtitle: string;
    tracks: Track[];
    defaultVolume: number;
    /** Track id that begins playing the moment she lands. */
    autoStartTrackId: string;
  };
  final: {
    heading: string;
    paragraphs: string[];
    question: string;
    /** A single quiet plea, rendered in handwriting before the question. */
    plea: string;
    options: ResponseOption[];
    messagePrompt: string;
    messageMaxLength: number;
    sendLabel: string;
    skipMessageLabel: string;
    thankYou: string[];
    writeMoreLabel: string;
    acknowledgementByResponse: Record<ResponseValue, string>;
  };
  /**
   * Short handwritten thoughts that drift faintly across every scene.
   * Editable; empty array disables the effect.
   */
  whispers: string[];
  notification: {
    subject: string;
    ownerDashboardPath: string;
  };
}
