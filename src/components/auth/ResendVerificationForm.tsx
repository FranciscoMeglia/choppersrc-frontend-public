"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { apiFetch, ApiError } from "@/lib/api/client";
import { showToast } from "@/lib/toast/toastStore";

const inputClass =
  "w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-primary focus:outline-none";

export function ResendVerificationForm({
  initialEmail = "",
}: {
  initialEmail?: string;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiFetch("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      showToast("Si el email existe y no fue verificado, te mandamos un nuevo link");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "No se pudo reenviar el email",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={255}
          className={inputClass}
        />
      </label>
      {error && <p className="text-sm text-primary">{error}</p>}
      <div>
        <Button type="submit" variant="secondary" disabled={loading}>
          {loading ? "Enviando..." : "Reenviar email de verificación"}
        </Button>
      </div>
    </form>
  );
}
