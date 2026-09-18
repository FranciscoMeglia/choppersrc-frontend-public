import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ComponentProps,
  ReactNode,
} from "react";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "secondary";

function buttonClasses(variant: Variant, className: string) {
  const base = "rounded px-4 py-2 text-sm font-medium transition-colors";
  const variants: Record<Variant, string> = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    secondary: "border border-ink/20 text-ink hover:bg-ink/5",
  };
  return `${base} ${variants[variant]} ${className}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return <button className={buttonClasses(variant, className)} {...props} />;
}

type LinkButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  ComponentProps<typeof Link> & { variant?: Variant; children?: ReactNode };

export function LinkButton({
  variant = "primary",
  className = "",
  ...props
}: LinkButtonProps) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}
