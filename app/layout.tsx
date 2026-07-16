import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { SoundProvider } from "@/components/sound-context";
import { SITE } from "@/lib/constants";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://writidian.com"),
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE.name,
    description: SITE.description,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
  themeColor: "#f7f4ee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden bg-paper font-sans text-ink">
        <a
          href="#top"
          className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-sm bg-espresso px-4 py-2 text-sm text-paper opacity-0 transition-[transform,opacity] duration-200 focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Skip to content
        </a>
        <SoundProvider>
          <div className="grain" aria-hidden />
          {children}
        </SoundProvider>
      </body>
    </html>
  );
}
