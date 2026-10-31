"use client";

import { useCallback, useEffect, useState } from "react";
import { CLIENT_TOKEN_STORAGE_KEY } from "@/lib/validation/response";

/**
 * An idempotency token that prevents *accidental* duplicate submissions
 * (double taps, flaky networks). It is generated once per device and reused;
 * when Bacha intentionally chooses to respond again, the shell rotates it.
 */
export function useClientToken() {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    try {
      let existing = window.localStorage.getItem(CLIENT_TOKEN_STORAGE_KEY);
      if (!existing) {
        existing =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `t-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        window.localStorage.setItem(CLIENT_TOKEN_STORAGE_KEY, existing);
      }
      setToken(existing);
    } catch {
      // Private browsing / storage disabled — submission still works, just
      // without accidental-double-submit protection.
      setToken(
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `t-${Date.now()}`
      );
    }
  }, []);

  const rotateToken = useCallback(() => {
    const fresh =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `t-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    setToken(fresh);
    try {
      window.localStorage.setItem(CLIENT_TOKEN_STORAGE_KEY, fresh);
    } catch {
      /* ignore */
    }
  }, []);

  return { token, rotateToken };
}
