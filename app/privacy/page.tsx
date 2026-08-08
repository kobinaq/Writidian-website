import { PrivacyPageContent } from "@/components/privacy/privacy-page";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Privacy Policy — ${SITE.name}`,
  description: `Privacy Notice for Writidian LLC. How we collect, use, share, and protect your personal information when you use Writidian.`,
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <PrivacyPageContent />
    </SiteShell>
  );
}
