"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ResendVerificationButton } from "./ResendVerificationButton";
import { ApiError } from "@/lib/api/client";
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from "@/types/api";
import type { AuthUser } from "@/types/auth";

const inputClass =
  "w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-primary focus:outline-none disabled:bg-ink/5 disabled:text-ink/50";
const labelClass = "flex flex-col gap-1 text-sm";

export function ProfileForm({ user }: { user: AuthUser }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      const res = await fetch("/api/backend/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: phone.trim() || null }),
      });
      const body = (await res.json()) as
        | ApiSuccessEnvelope<AuthUser>
        | ApiErrorEnvelope;
      if (!body.success) {
        throw new ApiError(body.message, body.statusCode, body.errors);
      }
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudieron guardar los cambios",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="font-medium">Datos personales</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Nombre
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={2}
            maxLength={150}
            required
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          <span>
            Teléfono <span className="text-ink/40">(opcional)</span>
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+54 ..."
            maxLength={30}
            className={inputClass}
          />
        </label>
      </div>

      <label className={labelClass}>
        Email
        <input type="email" value={user.email} disabled className={inputClass} />
        {user.emailVerified ? (
          <span className="text-xs text-ink/50">Verificado</span>
        ) : (
          <span className="flex flex-wrap items-center gap-2 text-xs text-amber-600">
            Sin verificar ·{" "}
            <ResendVerificationButton email={user.email} />
          </span>
        )}
      </label>

      {error && <p className="text-sm text-primary">{error}</p>}
      {success && !error && (
        <p className="text-sm text-ink/60">Cambios guardados.</p>
      )}

      <div>
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
