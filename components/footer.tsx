import { APP_URL, SITE } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/10 bg-surface/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="font-serif text-lg text-ink">{SITE.name}</p>
          <p className="mt-1 text-sm text-ink-muted">{SITE.tagline}</p>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm text-ink-muted">
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            Open app
          </a>
          <a href="#soundscapes" className="transition-colors hover:text-ink">
            Features
          </a>
          <p className="text-ink-muted/80">© {year} {SITE.name}</p>
        </div>
      </div>
    </footer>
  );
}
