import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Editor } from "@/components/sections/editor";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { Platform } from "@/components/sections/platform";
import { Problem } from "@/components/sections/problem";
import { Prompt } from "@/components/sections/prompt";
import { SanctuaryReveal } from "@/components/sections/sanctuary-reveal";
import { Soundscapes } from "@/components/sections/soundscapes";
import { Stance } from "@/components/sections/stance";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="w-full max-w-full overflow-x-hidden">
        <Hero />
        <SanctuaryReveal />
        <Problem />
        <Soundscapes />
        <Prompt />
        <Editor />
        <Stance />
        <Platform />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
