import { PageShell } from "@/components/page-shell";
import { ABOUT } from "@/lib/about";
import { SITE } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `About — ${SITE.name}`,
  description: ABOUT.body[0],
};

export default function AboutPage() {
  return (
    <PageShell>
      <article className="bg-paper px-5 pb-24 pt-28 sm:px-8 sm:pb-32 sm:pt-36">
        <div className="mx-auto max-w-3xl">
          <p className="font-eyebrow text-[15px] tracking-wide text-gold">
            {ABOUT.eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-[clamp(2.2rem,6vw,4rem)] leading-[1.08] tracking-tight text-ink">
            Write + Quotidian
          </h1>
          <p className="font-accent mt-4 text-lg text-ink-muted">
            {ABOUT.etymologyLead}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {ABOUT.parts.map((part, i) => (
              <div
                key={part.label}
                className="rounded-2xl border border-ink/10 bg-surface/70 px-5 py-6 text-center"
              >
                <p className="font-serif text-2xl text-ink">{part.label}</p>
                <p className="font-accent mt-2 text-sm text-ink-muted">
                  {part.note}
                </p>
                {i < ABOUT.parts.length - 1 ? (
                  <p className="mt-3 font-eyebrow text-gold sm:hidden">+</p>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-14 space-y-5">
            {ABOUT.body.map((para) => (
              <p
                key={para.slice(0, 32)}
                className="text-base leading-relaxed text-ink-muted sm:text-lg"
              >
                {para}
              </p>
            ))}
          </div>

          <section className="mt-20">
            <h2 className="font-serif text-[clamp(1.75rem,4vw,2.75rem)] tracking-tight text-ink">
              {ABOUT.whoTitle}
            </h2>
            <p className="font-accent mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
              {ABOUT.whoBody}
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {ABOUT.pillars.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-ink/10 bg-paper px-6 py-8"
                >
                  <p className="font-eyebrow text-[14px] tracking-wide text-gold">
                    {p.title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-20 grid gap-10 sm:grid-cols-2">
            <div>
              <p className="font-eyebrow text-[14px] tracking-wide text-gold">
                {ABOUT.visionTitle}
              </p>
              <p className="mt-3 font-serif text-xl leading-snug text-ink sm:text-2xl">
                {ABOUT.vision}
              </p>
            </div>
            <div>
              <p className="font-eyebrow text-[14px] tracking-wide text-gold">
                {ABOUT.missionTitle}
              </p>
              <p className="mt-3 font-serif text-xl leading-snug text-ink sm:text-2xl">
                {ABOUT.mission}
              </p>
            </div>
          </section>

          <section
            id="contact"
            className="mt-24 scroll-mt-28 rounded-2xl bg-espresso px-6 py-12 text-center text-paper sm:px-10 sm:py-14"
          >
            <h2 className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] tracking-tight">
              {ABOUT.contactTitle}
            </h2>
            <p className="font-accent mt-3 text-paper/70">
              {ABOUT.contactBody}
            </p>
            <a
              href={`mailto:${ABOUT.email}`}
              className="mt-6 inline-block font-serif text-xl text-gold-soft transition-opacity hover:opacity-80 sm:text-2xl"
            >
              {ABOUT.email}
            </a>
          </section>
        </div>
      </article>
    </PageShell>
  );
}
