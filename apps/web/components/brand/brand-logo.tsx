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
      className={`inline-flex items-center justify-center border-b-2 border-transparent focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-header-background ${className}`}
      href={href}
    >
      <Image
        alt="Aestetica Plus"
        className="h-auto w-full"
        height={733}
        loading="eager"
        sizes="(min-width: 1280px) 208px, (min-width: 640px) 176px, 120px"
        src="/brand/logo.png"
        width={2144}
      />
    </Link>
  );
}
