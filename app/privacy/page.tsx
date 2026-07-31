import { PageHero, Prose, ProseSection } from "@/components/page-chrome";
import { SiteShell } from "@/components/site-shell";
import { CONTACT_EMAIL, SITE } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Privacy Policy — ${SITE.name}`,
  description: `How ${SITE.name} collects, uses, and protects your information.`,
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <section className="bg-paper pt-6 sm:pt-10">
        <PageHero
          title="Privacy Policy"
          lead="Last updated July 31, 2026. We do not track your writing content or sell your data."
        />
        <Prose>
          <ProseSection title="Our commitment">
            <p>
              Writidian exists to protect a quiet space for thinking. We solely
              focus on providing the best possible writing environment. We do
              not sell your personal data, and we do not use your drafts to
              train generative AI models.
            </p>
          </ProseSection>

          <ProseSection title="Information we collect">
            <p>Depending on how you use Writidian, we may collect:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Account details such as name, email address, and authentication
                data
              </li>
              <li>
                Content you choose to create and store in the app (drafts,
                prompts you save, preferences)
              </li>
              <li>
                Usage and device information needed to operate and secure the
                service (for example, approximate logs, browser type, and
                session timing)
              </li>
              <li>
                Payment-related information processed by our payment providers
                if you subscribe to a paid plan
              </li>
            </ul>
          </ProseSection>

          <ProseSection title="How we use information">
            <p>We use information to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Provide, sync, and improve the Writidian product</li>
              <li>Authenticate you and keep the service secure</li>
              <li>Respond to support requests</li>
              <li>Send transactional messages and, with consent, product updates</li>
              <li>Meet legal obligations</li>
            </ul>
          </ProseSection>

          <ProseSection title="Your writing">
            <p>
              Your drafts belong to you. We treat writing content as private.
              We do not sell it, and we do not use it to train third-party or
              first-party generative models that produce text for others.
            </p>
          </ProseSection>

          <ProseSection title="Sharing">
            <p>
              We share data only with service providers who help us run
              Writidian (for example hosting, analytics that do not require
              reading your drafts, email, and payments), when required by law,
              or with your direction (such as export or sharing features you
              initiate).
            </p>
          </ProseSection>

          <ProseSection title="Retention">
            <p>
              We keep account and content data while your account is active and
              for a reasonable period afterward if needed for backups, legal
              claims, or abuse prevention. You may request deletion of your
              account and associated content subject to those limits.
            </p>
          </ProseSection>

          <ProseSection title="Security">
            <p>
              We use industry-standard measures to protect data in transit and
              at rest. No method of transmission or storage is perfectly
              secure; please use a strong password and protect your devices.
            </p>
          </ProseSection>

          <ProseSection title="Children">
            <p>
              Writidian is not directed at children under 13 (or the equivalent
              minimum age in your region). If you believe a child has provided
              us personal information, contact us and we will take appropriate
              steps.
            </p>
          </ProseSection>

          <ProseSection title="Your choices">
            <p>
              You may access, correct, export, or delete account information by
              using in-app controls where available, or by emailing{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-gold underline-offset-2 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              . Depending on where you live, you may have additional rights
              under local privacy law.
            </p>
          </ProseSection>

          <ProseSection title="Changes">
            <p>
              We may update this policy. We will revise the date above when we
              do. Continued use of Writidian after an update means you
              acknowledge the revised policy.
            </p>
          </ProseSection>

          <ProseSection title="Contact">
            <p>
              Privacy questions:{" "}
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
