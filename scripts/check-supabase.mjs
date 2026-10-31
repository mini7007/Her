/**
 * One-off connectivity check: Supabase URL + keys + migration status.
 * Run with: node scripts/check-supabase.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

// Minimal .env.local parser (no dotenv dependency needed).
const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^"|"$/g, "")];
    })
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("FAIL: Supabase URL or service key missing from .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log("Project URL:", url);

// Does the table exist, and can the service role read it?
const { data, error } = await supabase
  .from("relationship_responses")
  .select("id, response, status, submitted_at")
  .order("submitted_at", { ascending: false })
  .limit(5);

if (error) {
  console.error("DB ERROR:", error.code, "-", error.message);
  if (error.code === "PGRST205" || /does not exist|schema cache/i.test(error.message)) {
    console.error("→ The migration has NOT been run yet.");
    console.error("→ Open Supabase Dashboard → SQL Editor, paste supabase/migrations/001_relationship_responses.sql, and Run.");
  }
  process.exit(1);
}

console.log("SUCCESS: relationship_responses is reachable. Rows:", data?.length ?? 0);

// ── End-to-end cleanup mode: node scripts/check-supabase.mjs --cleanup ──────
if (process.argv.includes("--cleanup")) {
  const testToken = "e2e-verification-token-001";
  const { data: testRows } = await supabase
    .from("relationship_responses")
    .select("id, response")
    .eq("client_token", testToken);
  console.log(`Cleanup: ${testRows?.length ?? 0} test row(s) found`);
  if (testRows && testRows.length > 0) {
    const { error: del } = await supabase
      .from("relationship_responses")
      .delete()
      .eq("client_token", testToken);
    if (del) {
      console.error("DELETE FAILED:", del.message);
      process.exit(1);
    }
    console.log("Cleanup: test row(s) deleted — dashboard is empty again.");
  }

  // Also sweep any rows marked as verification tests by their message text.
  const { data: marked, error: markedError } = await supabase
    .from("relationship_responses")
    .delete()
    .like("message", "TEST (Mohan):%")
    .select("id");
  if (!markedError) {
    console.log(`Cleanup: ${marked?.length ?? 0} marked test row(s) deleted.`);
  }
  const { error: rlDel } = await supabase
    .from("response_rate_limits")
    .delete()
    .neq("client_hash", "___none___");
  if (rlDel) {
    console.error("Rate-limit cleanup failed:", rlDel.message);
    process.exit(1);
  }
  console.log("Cleanup: rate-limit window entries cleared.");
}


const { data: limits, error: limitsError } = await supabase
  .from("response_rate_limits")
  .select("client_hash")
  .limit(1);

if (limitsError) {
  console.error("rate-limits table ERROR:", limitsError.message);
  process.exit(1);
}
console.log("SUCCESS: response_rate_limits is reachable.");
console.log("ALL SUPABASE CHECKS PASSED");
