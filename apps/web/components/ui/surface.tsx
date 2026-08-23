import type { ComponentPropsWithoutRef } from "react";

type SurfaceProps = ComponentPropsWithoutRef<"section">;

export function Surface({ className = "", ...props }: SurfaceProps) {
  return (
    <section
      className={`rounded-design-xl border border-border bg-surface p-6 shadow-design-soft sm:p-8 ${className}`}
      {...props}
    />
  );
}
