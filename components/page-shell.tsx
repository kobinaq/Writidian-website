import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { SmoothScroll } from "@/components/smooth-scroll";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <Nav />
      <main className="w-full max-w-full overflow-x-hidden">{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
