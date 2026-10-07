import Image from "next/image";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

type HeroProps = Readonly<{
  matteImage: string;
  glossyImage: string;
  title: string;
  subtitle: string;
  buttonText: string;
}>;

export function Hero({
  buttonText,
  glossyImage,
  matteImage,
  subtitle,
  title,
}: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className="isolate overflow-hidden bg-text"
    >
      <div
        className="relative min-h-[clamp(20rem,48svh,40rem)] w-full overflow-hidden"
        data-hero-matte
      >
        <Image
          alt=""
          className="object-cover object-[50%_42%]"
          fill
          priority
          sizes="100vw"
          src={matteImage}
        />
      </div>

      <div
        className="relative min-h-[clamp(56rem,112svh,66rem)] w-full overflow-hidden"
        data-hero-glossy
      >
        <Image
          alt=""
          className="object-cover object-[50%_42%]"
          fill
          sizes="100vw"
          src={glossyImage}
        />
        <div aria-hidden="true" className="hero-overlay absolute inset-0" />

        <div className="absolute inset-0 z-10 flex items-end">
          <Container
            className="pb-[clamp(2.5rem,7vw,6rem)] pt-20"
            size="wide"
          >
            <div className="mx-auto w-full max-w-3xl text-center text-white">
              <h1
                className="font-display text-display-lg font-medium text-balance"
                id="hero-title"
                lang="en"
              >
                {title}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white sm:text-lg">
                {subtitle}
              </p>
              <div className="mt-7">
                <ButtonLink href="#booking-placeholder" variant="hero">
                  {buttonText}
                </ButtonLink>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
