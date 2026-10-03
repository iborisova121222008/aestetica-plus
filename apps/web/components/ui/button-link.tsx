import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkVariant = "primary" | "secondary" | "tertiary" | "inverted";

type ButtonLinkProps = Readonly<{
  children: ReactNode;
  className?: string;
  href: string;
  variant?: ButtonLinkVariant;
}>;

const variantClasses: Record<ButtonLinkVariant, string> = {
  primary:
    "border-rose-deep bg-rose-deep text-surface-pure hover:border-foreground hover:bg-foreground active:translate-y-px",
  secondary:
    "border-border-strong bg-surface text-foreground hover:border-foreground hover:bg-surface-pure active:translate-y-px",
  tertiary:
    "border-transparent bg-transparent px-3 text-rose-deep underline-offset-4 hover:bg-rose-soft hover:text-foreground hover:underline active:translate-y-px",
  inverted:
    "border-surface-pure bg-surface-pure text-foreground hover:border-rose-soft hover:bg-rose-soft active:translate-y-px",
};

export function ButtonLink({
  children,
  className = "",
  href,
  variant = "primary",
}: ButtonLinkProps) {
  return (
    <Link
      className={`inline-flex min-h-11 items-center justify-center rounded-design-md border px-5 py-2.5 text-sm font-semibold transition-colors duration-motion-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background ${variantClasses[variant]} ${className}`}
      href={href}
    >
      {children}
    </Link>
  );
}
