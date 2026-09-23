import type { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AccountNav } from "@/components/account/AccountNav";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [user, locale, t] = await Promise.all([
    getCurrentUser(),
    getLocale(),
    getTranslations("Header"),
  ]);
  if (!user) {
    redirect({ href: { pathname: "/login", query: { redirect: "/account" } }, locale });
  }
  const currentUser = user!;

  return (
    <Container>
      <Breadcrumb current={t("myAccount")} />

      <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        <aside className="lg:w-56 lg:shrink-0">
          <div className="mb-4 hidden lg:block">
            <p className="truncate font-medium">{currentUser.name}</p>
            <p className="truncate text-sm text-ink/60">{currentUser.email}</p>
          </div>

          <AccountNav />

          <div className="mt-4 hidden border-t border-ink/10 pt-4 lg:block">
            <LogoutButton />
          </div>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </Container>
  );
}
