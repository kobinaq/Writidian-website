import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Editor } from "@/components/sections/editor";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Prompt } from "@/components/sections/prompt";
import { SanctuaryReveal } from "@/components/sections/sanctuary-reveal";
import { Soundscapes } from "@/components/sections/soundscapes";
import { Stats } from "@/components/sections/stats";

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
        <Stats />
        <FinalCta />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
