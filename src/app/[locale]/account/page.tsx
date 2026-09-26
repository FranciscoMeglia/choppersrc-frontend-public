import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/session";
import { ProfileForm } from "@/components/account/ProfileForm";
import { ChangeEmailForm } from "@/components/account/ChangeEmailForm";
import { PasswordForm } from "@/components/account/PasswordForm";
import { LogoutAllButton } from "@/components/account/LogoutAllButton";
import { buildMetadata } from "@/lib/seo/metadata";
import type { AppLocale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

// Privada (requiere login, ver account/layout.tsx) — noindex.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AccountPage" });
  return buildMetadata({ locale: locale as AppLocale, href: "/account", title: t("title"), description: t("subtitle"), noIndex: true });
}

export default async function AccountPage() {
  const [user, t] = await Promise.all([
    getCurrentUser(),
    getTranslations("AccountPage"),
  ]);
  const currentUser = user!;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="mt-1 text-sm text-ink/60">{t("subtitle")}</p>
      </div>

      <div className="flex flex-col gap-10">
        <ProfileForm user={currentUser} />

        <hr className="border-ink/10" />

        <ChangeEmailForm pendingEmail={currentUser.pendingEmail} />

        <hr className="border-ink/10" />

        <PasswordForm />

        <hr className="border-ink/10" />

        <div className="flex flex-col gap-3">
          <h2 className="font-medium">{t("activeSessionsTitle")}</h2>
          <p className="text-sm text-ink/60">{t("activeSessionsHint")}</p>
          <div>
            <LogoutAllButton />
          </div>
        </div>
      </div>
    </div>
  );
}
