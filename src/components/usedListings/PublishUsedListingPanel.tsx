"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LinkButton, Button } from "@/components/ui/Button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ResendVerificationButton } from "@/components/account/ResendVerificationButton";
import { UsedListingForm } from "./UsedListingForm";
import type { AuthUser } from "@/types/auth";
import type { Category } from "@/types/catalog";

/**
 * Botón "Publicar un usado" que abre el form ahí mismo (sin navegar a otra
 * pantalla) para un usuario logueado y verificado — ver pedido del usuario.
 * Un visitante sin sesión va a /login (no hay nada que mostrar inline); uno
 * logueado pero sin verificar ve el mismo aviso que en checkout.
 */
export function PublishUsedListingPanel({
  categories,
  user,
}: {
  categories: Category[];
  user: AuthUser | null;
}) {
  const t = useTranslations("NewUsedListingPage");
  const tList = useTranslations("UsedListingsPage");
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <LinkButton href={{ pathname: "/login", query: { redirect: pathname } }}>
        {tList("publishCta")}
      </LinkButton>
    );
  }

  if (!open) {
    return <Button onClick={() => setOpen(true)}>{tList("publishCta")}</Button>;
  }

  function handleSaved() {
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="w-full rounded-xl border border-ink/10 p-5">
      <h2 className="text-lg font-semibold">{t("title")}</h2>
      <p className="mt-1 text-sm text-ink/60">{t("subtitle")}</p>

      {!user.emailVerified ? (
        <div className="mt-4 max-w-md rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p>{t("verifyEmailPrompt")}</p>
          <p className="mt-2">
            <ResendVerificationButton
              email={user.email}
              className="font-medium underline underline-offset-2 hover:text-amber-900"
            />
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-2 text-sm font-medium underline underline-offset-2"
          >
            {t("close")}
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <UsedListingForm
            categories={categories}
            user={user}
            onSaved={handleSaved}
            onCancel={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
