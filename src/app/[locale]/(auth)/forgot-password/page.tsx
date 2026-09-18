"use client";

import { useState, type FormEvent } from "react";
import { Container } from "@/components/ui/Container";
import { Button, LinkButton } from "@/components/ui/Button";
import { apiFetch, ApiError } from "@/lib/api/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "No se pudo enviar el email",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <h1 className="text-2xl font-semibold">Recuperar contraseña</h1>

      {sent ? (
        <div className="mt-4 flex flex-col gap-4">
          <p className="max-w-sm text-sm text-ink/60">
            Si el email existe, te mandamos un link para recuperar tu
            contraseña. Revisá tu bandeja de entrada (y la carpeta de spam).
          </p>
          <div>
            <LinkButton href="/login" variant="secondary">
              Volver a iniciar sesión
            </LinkButton>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex max-w-sm flex-col gap-3"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={255}
            className="rounded border border-ink/20 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          {error && <p className="text-sm text-primary">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar link de recuperación"}
          </Button>
        </form>
      )}
    </Container>
  );
}
