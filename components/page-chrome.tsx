import type { ReactNode } from "react";

export function PageHero({
  title,
  lead,
}: {
  title: string;
  lead?: string;
}) {
  return (
    <header className="mx-auto max-w-3xl px-5 pb-10 text-center sm:px-8 sm:pb-14">
      <h1 className="font-serif text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.08] tracking-tight text-ink">
        {title}
      </h1>
      <div
        aria-hidden
        className="mx-auto mt-5 h-1 w-16 bg-gold/40 sm:mt-6"
      />
      {lead ? (
        <p className="mt-6 text-base leading-relaxed text-ink-muted sm:mt-8 sm:text-lg">
          {lead}
        </p>
      ) : null}
    </header>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-5 pb-20 text-base leading-relaxed text-ink/85 sm:px-8 sm:pb-28 sm:text-lg sm:leading-relaxed">
      {children}
    </div>
  );
}

export function ProseSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif text-xl tracking-tight text-ink sm:text-2xl">
        {title}
      </h2>
      <div className="space-y-3 text-ink-muted">{children}</div>
    </section>
  );
}
