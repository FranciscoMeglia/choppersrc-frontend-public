"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { login } from "@/lib/auth/client";
import { ApiError } from "@/lib/api/client";

/**
 * `?redirect=` viene de la URL — cualquiera puede armar un link tipo
 * `/login?redirect=https://sitio-falso.com` para que, después de un login
 * legítimo, la víctima termine redirigida a un sitio externo (phishing
 * post-login). Sólo se acepta si es una ruta interna: empieza con `/` pero
 * no con `//` ni `/\` (ambos son formas de que el navegador lo interprete
 * como una URL absoluta a otro origen, no como una ruta relativa).
 */
function resolveSafeRedirect(raw: string | null): string {
  if (!raw) return "/account";
  if (raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\")) return raw;
  return "/account";
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push(resolveSafeRedirect(searchParams.get("redirect")));
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "No se pudo iniciar sesión",
      );
    } finally {
      setLoading(false);
    }
  }

  const message = searchParams.get("message");

  return (
    <Container>
      <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
      {message && (
        <p className="mt-4 max-w-sm rounded border border-ink/10 bg-ink/5 px-3 py-2 text-sm">
          {message}
        </p>
      )}
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
          className="w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
        <PasswordInput
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
        <Link href="/forgot-password" className="self-start text-xs text-ink/60 hover:text-primary">
          ¿Olvidaste tu contraseña?
        </Link>
        {error && <p className="text-sm text-primary">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>
    </Container>
  );
}
