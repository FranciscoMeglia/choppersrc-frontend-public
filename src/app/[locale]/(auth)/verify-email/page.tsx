"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { ResendVerificationForm } from "@/components/auth/ResendVerificationForm";
import { apiFetch, ApiError } from "@/lib/api/client";

type Status = "verifying" | "success" | "error" | "idle";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>(token ? "verifying" : "idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    apiFetch("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
      .then(() => {
        if (!cancelled) setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? err.message
            : "No se pudo verificar el email",
        );
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <Container>
      <h1 className="text-2xl font-semibold">Verificar email</h1>

      {status === "verifying" && (
        <p className="mt-4 text-sm text-ink/60">Verificando tu email...</p>
      )}

      {status === "success" && (
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-sm text-ink/60">
            Tu email quedó verificado. Ya podés comprar en la tienda.
          </p>
          <div>
            <LinkButton href="/account">Ir a mi cuenta</LinkButton>
          </div>
        </div>
      )}

      {(status === "error" || status === "idle") && (
        <div className="mt-4 flex max-w-sm flex-col gap-4">
          {status === "error" && (
            <p className="text-sm text-primary">{error}</p>
          )}
          <p className="text-sm text-ink/60">
            {status === "error"
              ? "Pedí un link nuevo:"
              : "Ingresá tu email para recibir el link de verificación:"}
          </p>
          <ResendVerificationForm />
        </div>
      )}
    </Container>
  );
}
