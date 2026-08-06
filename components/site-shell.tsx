import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { SmoothScroll } from "@/components/smooth-scroll";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <Nav />
      <main className="w-full max-w-full overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </SmoothScroll>
  );
}
