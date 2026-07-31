import { PageHero, Prose } from "@/components/page-chrome";
import { SiteShell } from "@/components/site-shell";
import { ABOUT } from "@/lib/about";
import { SITE } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `About — ${SITE.name}`,
  description:
    "Writidian is coined from Write and Quotidian. A dedicated ecosystem for thinking through writing.",
};

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="bg-paper pt-6 sm:pt-10">
        <PageHero title={ABOUT.title} lead={ABOUT.coined} />

        <div className="mx-auto mb-14 flex max-w-3xl flex-col items-center gap-4 px-5 font-serif text-2xl text-ink sm:mb-20 sm:flex-row sm:justify-center sm:gap-6 sm:text-4xl">
          {ABOUT.equation.map((part, i) => (
            <div key={part.word} className="flex items-center gap-4 sm:gap-6">
              {i > 0 ? (
                <span className="text-gold" aria-hidden>
                  {i === ABOUT.equation.length - 1 ? "=" : "+"}
                </span>
              ) : null}
              <div className="flex flex-col items-center">
                <span className={part.emphasis ? "font-bold italic" : undefined}>
                  {part.word}
                </span>
                {part.note ? (
                  <span
                    className={`mt-2 font-sans text-[10px] uppercase tracking-[0.2em] sm:text-xs ${
                      part.emphasis ? "text-gold" : "text-ink-muted"
                    }`}
                  >
                    {part.note}
                  </span>
                ) : (
                  <span className="mt-2 h-4" aria-hidden />
                )}
              </div>
            </div>
          ))}
        </div>

        <Prose>
          {ABOUT.paragraphs.map((p) => (
            <p key={p} className="text-center text-ink/80">
              {p}
            </p>
          ))}
        </Prose>
      </section>
    </SiteShell>
  );
}
