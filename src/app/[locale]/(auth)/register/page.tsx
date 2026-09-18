"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { register } from "@/lib/auth/client";
import { ApiError } from "@/lib/api/client";

const PASSWORD_PATTERN = "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}";
const PASSWORD_HINT =
  "Mínimo 8 caracteres, con al menos una mayúscula, una minúscula, un número y un símbolo.";
const PASSWORD_MAX_LENGTH = 72;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-primary focus:outline-none";
const labelClass = "flex flex-col gap-1 text-sm";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emailTaken, setEmailTaken] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setEmailTaken(false);
    setFieldErrors({});

    if (!EMAIL_PATTERN.test(email)) {
      setFieldErrors({ email: "Email inválido" });
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const name = `${firstName.trim()} ${lastName.trim()}`.trim();
      await register(name, email, password, phone.trim() || undefined);
      router.push("/account");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setEmailTaken(err.statusCode === 409);

        if (err.errors && err.errors.length > 0) {
          const map: Record<string, string> = {};
          for (const fieldError of err.errors) {
            map[fieldError.field] = fieldError.message;
          }
          setFieldErrors(map);
        } else {
          setError(err.message);
        }
      } else {
        setError("No se pudo crear la cuenta");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <h1 className="text-2xl font-semibold">Crear cuenta</h1>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-6 flex max-w-md flex-col gap-4"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className={labelClass}>
            Nombre
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              maxLength={70}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Apellido
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              maxLength={70}
              className={inputClass}
            />
          </label>
        </div>

        <label className={labelClass}>
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className={labelClass}>
            Contraseña
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              maxLength={PASSWORD_MAX_LENGTH}
              pattern={PASSWORD_PATTERN}
              title={PASSWORD_HINT}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Confirmar contraseña
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              maxLength={PASSWORD_MAX_LENGTH}
              className={inputClass}
            />
          </label>
        </div>
        <p className="text-xs text-ink/50">{PASSWORD_HINT}</p>

        <label className={labelClass}>
          Teléfono <span className="text-ink/40">(opcional)</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ej: 11 5555 5555"
            maxLength={30}
            className={inputClass}
          />
        </label>

        {(error || Object.keys(fieldErrors).length > 0) && (
          <div className="flex flex-col gap-1 text-sm text-primary">
            {error && (
              <p>
                {error}
                {emailTaken && (
                  <>
                    {" "}
                    <Link href="/forgot-password" className="underline">
                      ¿Recuperar contraseña?
                    </Link>
                  </>
                )}
              </p>
            )}
            {Object.values(fieldErrors).map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>
    </Container>
  );
}
