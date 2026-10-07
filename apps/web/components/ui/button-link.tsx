import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "inverted"
  | "hero";

type ButtonLinkProps = Readonly<{
  children: ReactNode;
  className?: string;
  href: string;
  variant?: ButtonLinkVariant;
}>;

const variantClasses: Record<ButtonLinkVariant, string> = {
  primary:
    "border-primary bg-primary text-text hover:border-primary-hover hover:bg-primary-hover active:translate-y-px",
  secondary:
    "border-border-strong bg-surface text-text hover:border-text hover:bg-background active:translate-y-px",
  tertiary:
    "border-transparent bg-transparent px-3 text-primary-hover underline-offset-4 hover:bg-surface-muted hover:text-text hover:underline active:translate-y-px",
  inverted:
    "border-text bg-text text-background hover:border-primary-hover hover:bg-primary-hover hover:text-text active:translate-y-px",
  hero:
    "border-white bg-transparent text-white hover:border-primary hover:bg-primary hover:text-white active:translate-y-px focus-visible:ring-white focus-visible:ring-offset-text",
};

export function ButtonLink({
  children,
  className = "",
  href,
  variant = "primary",
}: ButtonLinkProps) {
  return (
    <Link
      className={`inline-flex min-h-11 items-center justify-center rounded-design-sm border px-5 py-2.5 text-sm font-semibold transition-colors duration-motion-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background ${variantClasses[variant]} ${className}`}
      href={href}
    >
      {children}
    </Link>
  );
}
