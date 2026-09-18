
export const site = {
  name: "ChoppersRC",
};

export const mainNav = [
  { key: "home", href: "/" },
  { key: "products", href: "/products" },
  { key: "about", href: "/about" },
  { key: "blog", href: "/blog" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
] as const;

export const legalNav = [
  { key: "faqLong", href: "/faq" },
  { key: "terms", href: "/terms" },
  { key: "privacy", href: "/privacy" },
] as const;
