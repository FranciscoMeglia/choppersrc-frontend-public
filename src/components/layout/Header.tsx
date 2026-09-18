import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { mainNav, site } from "@/config/site";
import { getCurrentUser } from "@/lib/auth/session";
import { getCartItemCount } from "@/lib/cart/session";
import { CartIcon } from "@/components/cart/CartIcon";
import { SearchInput } from "./SearchInput";
import { LogoutButton } from "./LogoutButton";
import { AccountMenu } from "./AccountMenu";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";
import { TopBar } from "./TopBar";

const navLinkClass = "underline-offset-4 hover:text-primary hover:underline";

export async function Header() {
  const [user, cartCount, t, tNav] = await Promise.all([
    getCurrentUser(),
    getCartItemCount(),
    getTranslations("Header"),
    getTranslations("Nav"),
  ]);

  const navItems = mainNav.map((item) => ({
    label: tNav(item.key),
    href: item.href,
  }));

  const accountLinks = user ? (
    <>
      <Link href="/account" className={navLinkClass}>
        {t("myAccount")}
      </Link>
      <LogoutButton />
    </>
  ) : (
    <>
      <Link href="/login" className={navLinkClass}>
        {t("login")}
      </Link>
      <Link href="/register" className={navLinkClass}>
        {t("register")}
      </Link>
    </>
  );

  return (
    <>
      <TopBar />
      <header className="relative border-b border-ink/10">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-2 py-2 sm:gap-6 sm:px-6">
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo.webp"
              alt={site.name}
              width={48}
              height={48}
              className="h-10 w-10 sm:h-14 sm:w-14"
              priority
            />
          </Link>
          <nav className="hidden items-center gap-6 text-base whitespace-nowrap md:flex">
            <NavLinks items={navItems} className={navLinkClass} />
          </nav>
          <div className="hidden md:block">
            <SearchInput className="w-72 lg:w-96" />
          </div>
          <div className="ml-auto flex items-center gap-1 whitespace-nowrap sm:gap-2">
            <div className="hidden md:block">
              <AccountMenu user={user} />
            </div>
            <CartIcon initialCount={cartCount} isAuthenticated={!!user} />
            <MobileNav items={navItems}>{accountLinks}</MobileNav>
          </div>
        </div>
        <div className="border-t border-ink/10 px-4 py-3 md:hidden">
          <SearchInput />
        </div>
      </header>
    </>
  );
}
