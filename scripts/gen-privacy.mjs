import fs from "node:fs";

const text = fs.readFileSync("tmp-privacy-extract.txt", "utf8");

const lastUpdatedMatch = text.match(/Last updated\s+(.+)/i);
const lastUpdated = lastUpdatedMatch?.[1]?.trim() ?? "April 16, 2026";

function clean(s) {
  return s
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

const SECTION_META = [
  { id: "information-we-collect", title: "1. What information do we collect?" },
  { id: "how-we-process", title: "2. How do we process your information?" },
  {
    id: "legal-bases",
    title: "3. What legal bases do we rely on to process your information?",
  },
  {
    id: "sharing",
    title: "4. When and with whom do we share your personal information?",
  },
  {
    id: "cookies",
    title: "5. Do we use cookies and other tracking technologies?",
  },
  {
    id: "ai-products",
    title: "6. Do we offer artificial intelligence-based products?",
  },
  { id: "social-logins", title: "7. How do we handle your social logins?" },
  { id: "retention", title: "8. How long do we keep your information?" },
  { id: "security", title: "9. How do we keep your information safe?" },
  { id: "privacy-rights", title: "10. What are your privacy rights?" },
  { id: "do-not-track", title: "11. Controls for do-not-track features" },
  {
    id: "us-residents",
    title: "12. Do United States residents have specific privacy rights?",
  },
  {
    id: "other-regions",
    title: "13. Do other regions have specific privacy rights?",
  },
  { id: "updates", title: "14. Do we make updates to this notice?" },
  { id: "contact", title: "15. How can you contact us about this notice?" },
  {
    id: "review-update-delete",
    title:
      "16. How can you review, update, or delete the data we collect from you?",
  },
];

const CATEGORY_ROWS = [
  [
    "A. Identifiers",
    "Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name",
    "NO",
  ],
  [
    "B. Personal information as defined in the California Customer Records statute",
    "Name, contact information, education, employment, employment history, and financial information",
    "NO",
  ],
  [
    "C. Protected classification characteristics under state or federal law",
    "Gender, age, date of birth, race and ethnicity, national origin, marital status, and other demographic data",
    "NO",
  ],
  [
    "D. Commercial information",
    "Transaction information, purchase history, financial details, and payment information",
    "NO",
  ],
  ["E. Biometric information", "Fingerprints and voiceprints", "NO"],
  [
    "F. Internet or other similar network activity",
    "Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements",
    "NO",
  ],
  ["G. Geolocation data", "Device location", "NO"],
  [
    "H. Audio, electronic, sensory, or similar information",
    "Images and audio, video or call recordings created in connection with our business activities",
    "NO",
  ],
  [
    "I. Professional or employment-related information",
    "Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us",
    "NO",
  ],
  [
    "J. Education Information",
    "Student records and directory information",
    "NO",
  ],
  [
    "K. Inferences drawn from collected personal information",
    "Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual's preferences and characteristics",
    "NO",
  ],
  ["L. Sensitive personal Information", "", "NO"],
];

/** Parse a section body into blocks */
function parseBody(raw, sectionId) {
  let body = clean(raw);
  body = body
    .replace(/This Privacy Policy was created using Termly.*$/i, "")
    .trim();

  if (sectionId === "contact") {
    body = `If you have questions or comments about this notice, you may contact our Data Protection Officer (DPO) by email at info@writidian.com.

Writidian LLC
Data Protection Officer`;
  }

  const blocks = [];
  let inShort = null;
  const inShortMatch = body.match(/^In Short:\s*([\s\S]+?)(?:\n\n|\n(?=[A-Z#]))/);
  if (inShortMatch) {
    inShort = clean(inShortMatch[1]);
    body = body.slice(inShortMatch[0].length).trim();
  }

  // For US residents: splice hardcoded table over the broken Category/Examples dump
  if (sectionId === "us-residents") {
    const catMarker = "###H3### Categories of Personal Information We Collect";
    const catIdx = body.indexOf(catMarker);
    const alsoIdx = body.indexOf("We may also collect other personal information");
    if (catIdx !== -1 && alsoIdx !== -1) {
      const before = body.slice(0, catIdx);
      const after = body.slice(alsoIdx);
      const explMatch = body
        .slice(catIdx + catMarker.length, alsoIdx)
        .match(
          /The table below shows[\s\S]*?WHAT INFORMATION DO WE COLLECT\?"/,
        );
      const expl = explMatch
        ? clean(explMatch[0])
        : 'The table below shows the categories of personal information we have collected in the past twelve (12) months. The table includes illustrative examples of each category and does not reflect the personal information we collect from you. For a comprehensive inventory of all personal information we process, please refer to the section "WHAT INFORMATION DO WE COLLECT?"';
      body =
        before +
        catMarker +
        "\n" +
        expl +
        "\n<<<TABLE>>>\n" +
        after;
    }
  }

  const lines = body.split("\n");
  let i = 0;
  let paraBuf = [];
  let listBuf = [];

  function flushPara() {
    if (!paraBuf.length) return;
    const t = clean(paraBuf.join(" "));
    if (!t) {
      paraBuf = [];
      return;
    }
    if (/^In Short:\s*/i.test(t)) {
      blocks.push({
        type: "callout",
        text: clean(t.replace(/^In Short:\s*/i, "")),
      });
    } else {
      blocks.push({ type: "p", text: t });
    }
    paraBuf = [];
  }
  function flushList() {
    if (!listBuf.length) return;
    blocks.push({ type: "list", items: listBuf.map(clean) });
    listBuf = [];
  }

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      if (!listBuf.length) flushPara();
      i++;
      continue;
    }

    if (line === "<<<TABLE>>>") {
      flushList();
      flushPara();
      blocks.push({
        type: "table",
        headers: ["Category", "Examples", "Collected"],
        rows: CATEGORY_ROWS.map(([category, examples, collected]) => ({
          category,
          examples,
          collected,
        })),
      });
      i++;
      continue;
    }

    if (line.startsWith("###H3###")) {
      flushList();
      flushPara();
      blocks.push({ type: "h3", text: clean(line.replace("###H3###", "")) });
      i++;
      continue;
    }

    if (line.startsWith("- ")) {
      flushPara();
      listBuf.push(line.slice(2));
      i++;
      continue;
    }

    flushList();
    paraBuf.push(line);
    i++;
  }
  flushList();
  flushPara();

  return { inShort, blocks };
}

// Split by H2
const chunks = text.split(/###H2###\s*/);
const numbered = [];
for (const chunk of chunks.slice(1)) {
  const firstLine = chunk.split("\n")[0].trim();
  if (/^SUMMARY/i.test(firstLine) || /^TABLE OF CONTENTS/i.test(firstLine)) {
    continue;
  }
  if (/^\d+\./.test(firstLine)) {
    numbered.push(chunk);
  }
}

if (numbered.length !== 16) {
  console.error("Expected 16 numbered sections, got", numbered.length);
  process.exit(1);
}

const sections = numbered.map((chunk, idx) => {
  const lines = chunk.split("\n");
  const body = lines.slice(1).join("\n");
  const meta = SECTION_META[idx];
  const { inShort, blocks } = parseBody(body, meta.id);
  return {
    id: meta.id,
    title: meta.title,
    inShort,
    blocks,
  };
});

// Key points from SUMMARY section
const summaryChunk = chunks.find((c) => /^SUMMARY/i.test(c.split("\n")[0]));
const summaryBody = summaryChunk
  ? clean(summaryChunk.split("\n").slice(1).join("\n"))
  : "";

const keyPoints = [
  {
    question: "What personal information do we process?",
    answer:
      "When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.",
    href: "#information-we-collect",
  },
  {
    question: "Do we process any sensitive personal information?",
    answer:
      'Some of the information may be considered "special" or "sensitive" in certain jurisdictions, for example your racial or ethnic origins, sexual orientation, and religious beliefs. We do not process sensitive personal information.',
    href: "#information-we-collect",
  },
  {
    question: "Do we collect any information from third parties?",
    answer: "We do not collect any information from third parties.",
    href: "#information-we-collect",
  },
  {
    question: "How do we process your information?",
    answer:
      "We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so.",
    href: "#how-we-process",
  },
  {
    question:
      "In what situations and with which parties do we share personal information?",
    answer:
      "We may share information in specific situations and with specific third parties.",
    href: "#sharing",
  },
  {
    question: "How do we keep your information safe?",
    answer:
      "We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.",
    href: "#security",
  },
  {
    question: "What are your rights?",
    answer:
      "Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.",
    href: "#privacy-rights",
  },
  {
    question: "How do you exercise your rights?",
    answer:
      "The easiest way to exercise your rights is by submitting a data subject access request, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.",
    href: "#privacy-rights",
  },
];

const introServices = [
  "Visit our website at https://writidian.com or any website of ours that links to this Privacy Notice",
  "Download and use our mobile application (Writidian), or any other application of ours that links to this Privacy Notice",
  "Use Writidian. A writing tool that helps users build an effective writing habit by creating the right distraction-free digital environment for them to write",
  "Engage with us in other related ways, including any marketing or events",
];

const out = `import { CONTACT_EMAIL } from "@/lib/constants";

export type PrivacyTableRow = {
  category: string;
  examples: string;
  collected: string;
};

export type PrivacyBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; text: string }
  | {
      type: "table";
      headers: [string, string, string];
      rows: PrivacyTableRow[];
    };

export type PrivacySection = {
  id: string;
  title: string;
  inShort: string | null;
  blocks: PrivacyBlock[];
};

export type PrivacyKeyPoint = {
  question: string;
  answer: string;
  href: string;
};

export const PRIVACY = {
  title: "Privacy Policy",
  lastUpdated: ${JSON.stringify(lastUpdated)},
  introLead: \`This Privacy Notice for Writidian LLC (doing business as Writidian) ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:\`,
  introServices: ${JSON.stringify(introServices, null, 2)},
  introClose: \`Questions or concerns? Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at \${CONTACT_EMAIL}.\`,
  keyPointsIntro:
    "This summary provides key points from our Privacy Notice. Use the table of contents to find the section you are looking for.",
  keyPoints: ${JSON.stringify(keyPoints, null, 2)} as PrivacyKeyPoint[],
  toc: ${JSON.stringify(
    SECTION_META.map((s) => ({ id: s.id, title: s.title })),
    null,
    2,
  )},
  sections: ${JSON.stringify(sections, null, 2)} as PrivacySection[],
} as const;
`;

fs.writeFileSync("lib/privacy.ts", out);
console.log(
  "Wrote lib/privacy.ts",
  "sections",
  sections.length,
  "keyPoints",
  keyPoints.length,
  "blocks",
  sections.reduce((n, s) => n + s.blocks.length, 0),
);
