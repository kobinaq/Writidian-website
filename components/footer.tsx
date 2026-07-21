import {
  APP_URL,
  CONTACT_EMAIL,
  FOOTER_LINKS,
  SITE,
  SOCIALS,
} from "@/lib/constants";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/10 bg-surface/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-serif text-lg text-ink">{SITE.name}</p>
            <p className="mt-1 max-w-xs text-sm text-ink-muted">
              {SITE.tagline}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 inline-block font-accent text-sm text-gold transition-colors hover:text-ink"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-8">
            <div>
              <p className="font-eyebrow text-[13px] tracking-wide text-ink-muted">
                Explore
              </p>
              <ul className="mt-3 space-y-2">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-eyebrow text-[13px] tracking-wide text-ink-muted">
                Product
              </p>
              <ul className="mt-3 space-y-2">
                <li>
                  <a
                    href={APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    Open app
                  </a>
                </li>
                <li>
                  <a
                    href="/#soundscapes"
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    Features
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-eyebrow text-[13px] tracking-wide text-ink-muted">
                Social
              </p>
              <ul className="mt-3 space-y-2">
                {SOCIALS.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="text-xs text-ink-muted/80">
          © {year} {SITE.name}
        </p>
      </div>
    </footer>
  );
}
