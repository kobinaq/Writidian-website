import { PageHero, Prose, ProseSection } from "@/components/page-chrome";
import { SiteShell } from "@/components/site-shell";
import { CONTACT_EMAIL, SITE } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Terms & Conditions — ${SITE.name}`,
  description: `Terms and conditions for using ${SITE.name}.`,
};

export default function TermsPage() {
  return (
    <SiteShell>
      <section className="bg-paper pt-6 sm:pt-10">
        <PageHero
          title="Terms & Conditions"
          lead="Last updated July 31, 2026. By using Writidian, you agree to these terms."
        />
        <Prose>
          <ProseSection title="1. The service">
            <p>
              Writidian is a writing sanctuary — an application for intentional
              writing with soundscapes, daily prompts, an editor, and related
              tools. We may update, improve, or discontinue features as the
              product evolves.
            </p>
          </ProseSection>

          <ProseSection title="2. Your account">
            <p>
              You are responsible for the accuracy of your account information
              and for keeping your login credentials secure. You must be old
              enough to form a binding contract in your jurisdiction, or use
              Writidian only with a parent or guardian&apos;s permission where
              required.
            </p>
          </ProseSection>

          <ProseSection title="3. Your writing">
            <p>
              You retain ownership of the text and other content you create in
              Writidian. By using the service, you grant us a limited license
              to host, store, and display that content solely so we can operate
              the product for you (including sync and export features).
            </p>
            <p>
              You agree not to use Writidian to publish or store illegal,
              harmful, or infringing material.
            </p>
          </ProseSection>

          <ProseSection title="4. Acceptable use">
            <p>
              Do not attempt to disrupt the service, reverse engineer it beyond
              what the law allows, scrape it abusively, or access another
              user&apos;s account. We may suspend accounts that violate these
              terms.
            </p>
          </ProseSection>

          <ProseSection title="5. Plans and billing">
            <p>
              Core features may be offered free of charge. Paid plans, if any,
              are billed according to the pricing shown at signup. Fees are
              generally non-refundable except where required by law or stated
              otherwise at purchase.
            </p>
          </ProseSection>

          <ProseSection title="6. No AI generation">
            <p>
              Writidian does not provide AI writing generators or rewrite tools.
              The product is designed for human thinking and human writing. See
              also our{" "}
              <a href="/stance" className="text-gold underline-offset-2 hover:underline">
                stance on AI
              </a>
              .
            </p>
          </ProseSection>

          <ProseSection title="7. Disclaimers">
            <p>
              Writidian is provided &quot;as is.&quot; To the fullest extent
              permitted by law, we disclaim warranties of merchantability,
              fitness for a particular purpose, and non-infringement. We do not
              guarantee uninterrupted or error-free service.
            </p>
          </ProseSection>

          <ProseSection title="8. Limitation of liability">
            <p>
              To the fullest extent permitted by law, Writidian and its
              operators are not liable for indirect, incidental, special, or
              consequential damages, or for loss of data, profits, or goodwill,
              arising from your use of the service.
            </p>
          </ProseSection>

          <ProseSection title="9. Changes">
            <p>
              We may update these terms. Continued use after changes take
              effect means you accept the revised terms. Material changes will
              be reflected by updating the date above.
            </p>
          </ProseSection>

          <ProseSection title="10. Contact">
            <p>
              Questions about these terms:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-gold underline-offset-2 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </ProseSection>
        </Prose>
      </section>
    </SiteShell>
  );
}
