import { getCurrentUser } from "@/lib/auth/session";
import { ProfileForm } from "@/components/account/ProfileForm";
import { PasswordForm } from "@/components/account/PasswordForm";
import { LogoutAllButton } from "@/components/account/LogoutAllButton";

export default async function AccountPage() {
  const user = (await getCurrentUser())!;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold">Mi cuenta</h1>
        <p className="mt-1 text-sm text-ink/60">
          Tus datos personales y tu contraseña.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        <ProfileForm user={user} />

        <hr className="border-ink/10" />

        <PasswordForm />

        <hr className="border-ink/10" />

        <div className="flex flex-col gap-3">
          <h2 className="font-medium">Sesiones activas</h2>
          <p className="text-sm text-ink/60">
            ¿Iniciaste sesión en otro dispositivo? Cerrá todas las sesiones
            activas, incluida esta.
          </p>
          <div>
            <LogoutAllButton />
          </div>
        </div>
      </div>
    </div>
  );
}
