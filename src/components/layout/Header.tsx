import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { mainNav, site } from "@/config/site";
import { getCurrentUser } from "@/lib/auth/session";
import { getCartItemCount } from "@/lib/cart/session";
import { getCategoryGroups } from "@/lib/catalog/facets";
import { CartIcon } from "@/components/cart/CartIcon";
import { SearchInput } from "./SearchInput";
import { LogoutButton } from "./LogoutButton";
import { AccountMenu } from "./AccountMenu";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";
import { ProductsMegaMenu } from "./ProductsMegaMenu";
import { TopBar } from "./TopBar";

const navLinkClass = "underline-offset-4 hover:text-primary hover:underline";

export async function Header() {
  const [user, cartCount, t, tNav, categoryGroups] = await Promise.all([
    getCurrentUser(),
    getCartItemCount(),
    getTranslations("Header"),
    getTranslations("Nav"),
    getCategoryGroups(),
  ]);

  const navItems = mainNav.map((item) => ({
    label: tNav(item.key),
    href: item.href,
  }));
  const beforeProducts = navItems.slice(0, navItems.findIndex((item) => item.href === "/products"));
  const afterProducts = navItems.slice(navItems.findIndex((item) => item.href === "/products") + 1);
  const productsLabel = tNav("products");

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
          <nav className="hidden items-center gap-4 text-base whitespace-nowrap md:flex xl:gap-6">
            <NavLinks items={beforeProducts} className={navLinkClass} />
            <ProductsMegaMenu label={productsLabel} groups={categoryGroups} className={navLinkClass} />
            <NavLinks items={afterProducts} className={navLinkClass} />
          </nav>
          {/* A partir de lg, no de md: con 7 ítems de nav + buscador fijo no
              entraban juntos en el rango 768-1023px (se generaba scroll
              horizontal) — entre esos anchos el buscador baja a la segunda
              fila, igual que en mobile. Ya en lg, el buscador arranca
              angosto (justo entra) y recién crece a partir de xl, que es
              donde sobra lugar. */}
          <div className="hidden lg:block">
            <SearchInput className="w-56 xl:w-72 2xl:w-96" />
          </div>
          <div className="ml-auto flex items-center gap-1 whitespace-nowrap sm:gap-2">
            <div className="hidden md:block">
              <AccountMenu user={user} />
            </div>
            <CartIcon initialCount={cartCount} isAuthenticated={!!user} />
            <MobileNav
              beforeProductsItems={beforeProducts}
              productsLabel={productsLabel}
              categoryGroups={categoryGroups}
              afterProductsItems={afterProducts}
            >
              {accountLinks}
            </MobileNav>
          </div>
        </div>
        <div className="border-t border-ink/10 px-4 py-3 lg:hidden">
          <SearchInput />
        </div>
      </header>
    </>
  );
}
