import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { OwnerDashboard } from "@/components/owner/OwnerDashboard";

/**
 * /owner — the private dashboard.
 * The authenticated user is re-verified on the server for EVERY render.
 * If the visitor is not exactly the configured owner, they are sent to login.
 */
export const metadata: Metadata = {
  title: "For Mohan — Private Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OwnerPage() {
  let user = null;
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user: authenticated },
    } = await supabase.auth.getUser();
    user = authenticated;
  } catch {
    redirect("/owner/login");
  }

  const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const email = user?.email?.trim().toLowerCase();

  if (!user || !ownerEmail || email !== ownerEmail) {
    redirect("/owner/login");
  }

  return (
    <div className="min-h-dvh bg-midnight">
      <div aria-hidden className="fixed inset-0 -z-10 bg-[radial-gradient(120%_90%_at_50%_0%,#300D20_0%,#09070B_75%)]" />
      <OwnerDashboard />
    </div>
  );
}
