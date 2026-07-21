import { PageShell } from "@/components/page-shell";
import { Editor } from "@/components/sections/editor";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Prompt } from "@/components/sections/prompt";
import { SanctuaryReveal } from "@/components/sections/sanctuary-reveal";
import { Soundscapes } from "@/components/sections/soundscapes";
import { Streak } from "@/components/sections/streak";

export default function Home() {
  return (
    <PageShell>
      <Hero />
      <SanctuaryReveal />
      <Problem />
      <Soundscapes />
      <Prompt />
      <Editor />
      <Streak />
      <FinalCta />
    </PageShell>
  );
}
