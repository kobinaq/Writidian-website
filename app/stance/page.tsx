import { PageShell } from "@/components/page-shell";
import { SITE } from "@/lib/constants";
import { STANCE } from "@/lib/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Our stance on AI — ${SITE.name}`,
  description: STANCE.lead,
};

export default function StancePage() {
  return (
    <PageShell>
      <article className="bg-paper px-5 pb-24 pt-28 sm:px-8 sm:pb-32 sm:pt-36">
        <div className="mx-auto max-w-3xl">
          <p className="font-eyebrow text-[15px] tracking-wide text-gold">
            {STANCE.eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-[clamp(2.2rem,6vw,4rem)] leading-[1.08] tracking-tight text-ink">
            {STANCE.title}
          </h1>
          <p className="font-accent mt-5 text-lg leading-relaxed text-ink-muted sm:text-xl">
            {STANCE.lead}
          </p>
          <div className="mt-14 space-y-12">
            {STANCE.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-2xl tracking-tight text-ink">
                  {section.heading}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-ink-muted sm:text-lg">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </article>
    </PageShell>
  );
}
