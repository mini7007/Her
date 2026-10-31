import { ExperienceShell } from "@/components/layout/ExperienceShell";

/**
 * The entire cinematic experience — one persistent shell, eight scenes.
 * Music, state and transitions live in the shell so nothing restarts as
 * Bacha moves through the story.
 */
export default function Page() {
  return <ExperienceShell />;
}
