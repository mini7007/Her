"use client";

import { RelationshipCounter } from "@/components/timeline/RelationshipCounter";
import { RelationshipTimeline } from "@/components/timeline/RelationshipTimeline";
import { SceneHeader } from "@/components/layout/SceneHeader";
import { relationship } from "@/content/relationship";
import { formatDateLong, parseLocalDate } from "@/lib/utils";

/**
 * SCENE 02 — "Our Story": the live counter since 18 September 2023 and the
 * six-chapter timeline (real memories when provided, honest empty states
 * when not).
 */
export function OurStoryScene() {
  const startDate = parseLocalDate(relationship.relationshipStartDateISO);

  return (
    <section aria-labelledby="story-heading" className="mx-auto max-w-3xl pb-6">
      <SceneHeader
        eyebrow="Scene 02 — Our Story"
        title={relationship.story.heading}
        subtitle={relationship.story.subheading}
      />
      <h2 id="story-heading" className="sr-only">
        {relationship.story.heading}
      </h2>

      <p className="mb-3 text-center text-[11px] uppercase tracking-[0.3em] text-rose/60">
        Since {formatDateLong(startDate)}
      </p>
      <RelationshipCounter />

      <div className="mt-16">
        <RelationshipTimeline />
      </div>
    </section>
  );
}
