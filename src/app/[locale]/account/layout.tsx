import { redirect } from "next/navigation";
import type { ReactNode } from "react";
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
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/account");

  return (
    <Container>
      <Breadcrumb current="Mi cuenta" />

      <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        <aside className="lg:w-56 lg:shrink-0">
          <div className="mb-4 hidden lg:block">
            <p className="truncate font-medium">{user.name}</p>
            <p className="truncate text-sm text-ink/60">{user.email}</p>
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
