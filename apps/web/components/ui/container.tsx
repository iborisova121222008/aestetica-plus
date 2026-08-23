import type { ComponentPropsWithoutRef } from "react";

type ContainerSize = "narrow" | "content" | "wide" | "application";

type ContainerProps = ComponentPropsWithoutRef<"div"> &
  Readonly<{
    size?: ContainerSize;
  }>;

const sizeClasses: Record<ContainerSize, string> = {
  narrow: "max-w-content-narrow",
  content: "max-w-content",
  wide: "max-w-content-wide",
  application: "max-w-application",
};

export function Container({ className = "", size = "content", ...props }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-5 md:px-8 lg:px-12 2xl:px-16 ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
