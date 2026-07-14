import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Analytics } from "@/components/sections/analytics";
import { Editor } from "@/components/sections/editor";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Prompt } from "@/components/sections/prompt";
import { SanctuaryReveal } from "@/components/sections/sanctuary-reveal";
import { Soundscapes } from "@/components/sections/soundscapes";
import { Stance } from "@/components/sections/stance";
import { Streak } from "@/components/sections/streak";

export default function Home() {
  return (
    <SmoothScroll>
      <Nav />
      <main className="w-full max-w-full overflow-x-hidden">
        <Hero />
        <SanctuaryReveal />
        <Problem />
        <Soundscapes />
        <Prompt />
        <Editor />
        <Streak />
        <Analytics />
        <Stance />
        <FinalCta />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
