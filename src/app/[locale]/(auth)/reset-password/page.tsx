"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button, LinkButton } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { apiFetch, ApiError } from "@/lib/api/client";

const PASSWORD_PATTERN = "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}";
const PASSWORD_HINT =
  "Mínimo 8 caracteres, con al menos una mayúscula, una minúscula, un número y un símbolo.";
const PASSWORD_MAX_LENGTH = 72;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
      });
      setDone(true);
    } catch (err) {
      if (err instanceof ApiError && err.errors && err.errors.length > 0) {
        const map: Record<string, string> = {};
        for (const fieldError of err.errors) {
          map[fieldError.field] = fieldError.message;
        }
        setFieldErrors(map);
      } else {
        setError(
          err instanceof ApiError
            ? err.message
            : "No se pudo actualizar la contraseña",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <h1 className="text-2xl font-semibold">Restablecer contraseña</h1>

      {!token && (
        <div className="mt-4 flex max-w-sm flex-col gap-4">
          <p className="text-sm text-ink/60">
            Este link no es válido. Pedí uno nuevo.
          </p>
          <div>
            <LinkButton href="/forgot-password">
              Pedir link de recuperación
            </LinkButton>
          </div>
        </div>
      )}

      {token && done && (
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-sm text-ink/60">
            Contraseña actualizada. Ya podés iniciar sesión con ella.
          </p>
          <div>
            <LinkButton href="/login">Iniciar sesión</LinkButton>
          </div>
        </div>
      )}

      {token && !done && (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 flex max-w-sm flex-col gap-3"
        >
          <PasswordInput
            placeholder="Contraseña nueva"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            maxLength={PASSWORD_MAX_LENGTH}
            pattern={PASSWORD_PATTERN}
            title={PASSWORD_HINT}
            className="w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <PasswordInput
            placeholder="Confirmar contraseña nueva"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            maxLength={PASSWORD_MAX_LENGTH}
            className="w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <p className="text-xs text-ink/50">{PASSWORD_HINT}</p>
          {(error || Object.keys(fieldErrors).length > 0) && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1 text-sm text-primary">
                {error && <p>{error}</p>}
                {Object.values(fieldErrors).map((message) => (
                  <p key={message}>{message}</p>
                ))}
              </div>
              {error && (
                <LinkButton
                  href="/forgot-password"
                  variant="secondary"
                  className="self-start"
                >
                  Pedir un link nuevo
                </LinkButton>
              )}
            </div>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </Button>
        </form>
      )}
    </Container>
  );
}
