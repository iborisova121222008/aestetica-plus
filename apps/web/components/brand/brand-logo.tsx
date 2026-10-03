import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = Readonly<{
  href: string;
  className?: string;
}>;

export function BrandLogo({ className = "", href }: BrandLogoProps) {
  return (
    <Link
      aria-label="Aestetica Plus"
      className={`inline-flex items-center justify-center rounded-design-sm bg-surface-pure/95 px-2 shadow-design-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-strong focus-visible:ring-offset-2 ${className}`}
      href={href}
    >
      <Image
        alt="Aestetica Plus"
        className="h-auto w-full"
        height={733}
        loading="eager"
        sizes="(min-width: 1280px) 224px, 128px"
        src="/brand/logo.png"
        width={2144}
      />
    </Link>
  );
}
