import { AboutPageContent } from "@/components/sections/about-page";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `About — ${SITE.name}`,
  description:
    "Writidian — write every day. Coined from Write and Quotidian. A dedicated ecosystem for thinking through writing.",
};

export default function AboutPage() {
  return (
    <SiteShell>
      <AboutPageContent />
    </SiteShell>
  );
}
