import type { Metadata } from "next";
import { LoginForm } from "@/components/owner/LoginForm";

export const metadata: Metadata = {
  title: "Owner Sign-in — If You Could Hear My Heart",
  robots: { index: false, follow: false },
};

export default function OwnerLoginPage() {
  return (
    <div className="relative min-h-dvh bg-midnight">
      <div aria-hidden className="fixed inset-0 -z-10 bg-[radial-gradient(120%_90%_at_50%_0%,#300D20_0%,#09070B_75%)]" />
      <LoginForm />
    </div>
  );
}
