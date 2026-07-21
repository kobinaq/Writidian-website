export const APP_URL = "https://app.writidian.com";
export const CONTACT_EMAIL = "hello@writidian.com";

export const SITE = {
  name: "Writidian",
  tagline: "A distraction-free writing haven.",
  description:
    "Writidian is a supportive digital environment for anyone who wants to write — soundscapes, daily prompts, and an uncluttered editor built for critical thinking.",
};

export const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/writidian",
  },
] as const;

export const FOOTER_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/about#contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Our stance on AI", href: "/stance" },
] as const;

export const COPY = {
  heroEyebrow: "A distraction-free writing haven",
  heroHeadline: "To grow your inner human writer.",
  heroSupport:
    "Experience this supportive digital environment for anyone who wants to write",
  sanctuaryQuiet:
    "In here, it's just you, your thoughts and the page.",
  sanctuaryDesc:
    "Each feature within Writidian is built to help you think critically through the art of writing. We value the power of the human mind.",
  problemLead:
    "The modern digital environment is hostile to the human writing process. Distracted are everywhere, and the chance to think critically is now often deferred to AI models.",
  problemPurpose:
    "Writidian's purpose is to help you create a dedicated, immersive ecosystem for critical thinking through writing.",
  problemBridge: "We're doing this with:",
  soundscapesTitle: "Soundscapes that support your flow",
  soundscapesBody:
    "Writidian's in-built library of soundscapes puts you in the right headspace to carve out the world you're building in your mind, and sustain the focus you need to finish your drafts.",
  soundscapesBullets: [
    "Binaural sounds for peak attention and focus",
    "Non-binaural sounds for everyday auditory experiences",
    "Genre soundscapes for putting you in the mood while you write in a specific genre e.g science fiction, fantasy, romance, journaling, etc.",
  ],
  binauralsTip: "Use headphones for best effect.",
  promptTitle:
    "A new writing prompt every day to spark your creative and reflective mind.",
  promptBody:
    "Quickly get rid of writer's block with Writidian's prompt of the day! Every day presents an opportunity for a new story.",
  samplePromptLabel: "Nostalgia",
  samplePrompt:
    "There is a song you refuse to listen to anymore because it transports you to a time you can't get back. What time is that?",
  editorTitle: "Your uncluttered editor lives here",
  editorBody:
    'A clean sheet for your words awaits you with only the features you need, where you need them. A true representation of "Less is more".',
  streakTitle: "Building a writing habit with a momentum that stays with you",
  streakBody:
    "With only 100 words a day, you can start building your writing streak. You're practically building a critical thinking streak too!",
  stanceTitle: "Built against the grain",
  stanceBody:
    "AI has thinned the art of writing and the wellbeing that comes with doing hard creative work yourself. Writidian takes the other path. No generators. No rewrite buttons. A space that asks you to think.",
  platformNote:
    "Writidian is a web app today. A mobile app is in the pipeline.",
  finalCta: "Start your Writidian journey today",
  finalSupport: "Sign up for free * No credit card required",
};

export const SAMPLE_PROMPTS = [
  {
    label: "Atmosphere",
    text: "In your shared apartment, your two roommates are mad at each other. There's tension in the atmosphere. What happened?",
  },
  {
    label: "Nostalgia",
    text: "There is a song you refuse to listen to anymore because it transports you to a time you can't get back. What time is that?",
  },
  {
    label: "Threshold",
    text: "You find a door that was not there yesterday. The handle is warm. Do you open it — and what waits on the other side?",
  },
] as const;

export const MOMENTUM_STATS = [
  {
    id: "rhythm",
    label: "See your writing rhythm",
    value: "Sanctuary Hours · Words Flowed",
    detail:
      "Track Sanctuary hours, words flowed, and your daily momentum. Log off-device writing in case you prefer to write in a physical book.",
    bullets: [] as readonly string[],
  },
  {
    id: "advanced",
    label: "Learn from advanced statistics.",
    value: "Patterns that sharpen your practice",
    detail: "",
    bullets: [
      "Understand with prompt categories your gravitate to a lot more",
      'Find out which soundscapes you prefer most when "zoning in".',
      "Track your peak writing hours for higher productivity",
    ] as readonly string[],
  },
] as const;

export const GENRES = [
  "Journaling",
  "Literary Fiction",
  "Romance",
  "Horror",
  "Non-binaural",
  "Science Fiction",
  "Fantasy",
] as const;

export const EDITOR_SAMPLE_LINES = [
  '"Mister! Mister! MISTER!"',
  "Her last call woke me up.",
  "Apparently, she bore the name Linda. Her face was unfamiliar but I knew her somehow.",
  '"We need to go now! They\'ll be here any minute!" she yelled over me as I lay on the cold hard floor.',
] as const;

/**
 * Social-style notification clutter for the sanctuary reveal.
 * Desktop: left + right columns below the narration band.
 * Mobile (mx/my): tight 2×3 grid below narration; mox/moy = gentler scatter.
 */
export const SOCIAL_CLUTTER = [
  {
    id: "s1",
    brand: "instagram" as const,
    platform: "Instagram",
    title: "maya · liked your photo",
    body: "and 14 others · 2m",
    accent: "#E1306C",
    x: 16,
    y: 42,
    mx: 24,
    my: 42,
    ox: -48,
    oy: -28,
    mox: -28,
    moy: -18,
    rot: -5,
    mobile: true,
  },
  {
    id: "s2",
    brand: "x" as const,
    platform: "X",
    title: "Trending in your area",
    body: "Hot take thread you do not need",
    accent: "#000000",
    x: 84,
    y: 42,
    mx: 76,
    my: 42,
    ox: 48,
    oy: -30,
    mox: 28,
    moy: -18,
    rot: 5,
    mobile: true,
  },
  {
    id: "s3",
    brand: "discord" as const,
    platform: "Discord",
    title: "#general · writers-den",
    body: "12 new mentions waiting for you",
    accent: "#5865F2",
    x: 18,
    y: 56,
    mx: 24,
    my: 57,
    ox: -52,
    oy: 6,
    mox: -30,
    moy: 8,
    rot: -4,
    mobile: true,
  },
  {
    id: "s4",
    brand: "tiktok" as const,
    platform: "TikTok",
    title: "For You",
    body: "Watch this before you write",
    accent: "#FE2C55",
    x: 86,
    y: 56,
    mx: 76,
    my: 57,
    ox: 50,
    oy: 4,
    mox: 30,
    moy: 8,
    rot: 6,
    mobile: false,
  },
  {
    id: "s5",
    brand: "pinterest" as const,
    platform: "Pinterest",
    title: "47 new ideas for you",
    body: "Writing desks & quiet corners",
    accent: "#E60023",
    x: 50,
    y: 62,
    mx: 76,
    my: 72,
    ox: 0,
    oy: 36,
    mox: 26,
    moy: 22,
    rot: -3,
    mobile: true,
  },
  {
    id: "s6",
    brand: "slack" as const,
    platform: "Slack",
    title: "design-team",
    body: "Another ping. Another tab.",
    accent: "#4A154B",
    x: 82,
    y: 70,
    mx: 76,
    my: 57,
    ox: 44,
    oy: 32,
    mox: 28,
    moy: 8,
    rot: 4,
    mobile: true,
  },
  {
    id: "s7",
    brand: "whatsapp" as const,
    platform: "WhatsApp",
    title: "Jordan",
    body: "hey u free rn???",
    accent: "#25D366",
    x: 15,
    y: 70,
    mx: 24,
    my: 72,
    ox: -50,
    oy: 38,
    mox: -26,
    moy: 22,
    rot: -5,
    mobile: true,
  },
  {
    id: "s8",
    brand: "calendar" as const,
    platform: "Calendar",
    title: "Standup",
    body: "Starts in 5 minutes",
    accent: "#E74C3C",
    x: 85,
    y: 82,
    mx: 76,
    my: 84,
    ox: 46,
    oy: 36,
    mox: 28,
    moy: 24,
    rot: 5,
    mobile: false,
  },
  {
    id: "s9",
    brand: "chatgpt" as const,
    platform: "ChatGPT",
    title: "Rewrite this?",
    body: "Generate a better paragraph",
    accent: "#10A37F",
    x: 20,
    y: 84,
    mx: 24,
    my: 84,
    ox: -44,
    oy: 28,
    mox: -28,
    moy: 24,
    rot: -4,
    mobile: false,
  },
  {
    id: "s10",
    brand: "youtube" as const,
    platform: "YouTube",
    title: "Suggested for you",
    body: "Infinite scroll is calling",
    accent: "#FF0000",
    x: 50,
    y: 78,
    mx: 50,
    my: 88,
    ox: 8,
    oy: 40,
    mox: 0,
    moy: 28,
    rot: 3,
    mobile: false,
  },
] as const;

/** Sample soundscapes from client copy — category in title, track name as featured bed. */
export const SOUNDSCAPE_SCENES = [
  {
    id: "journaling",
    title: "Journaling",
    track: "Bubbly Reflection",
    line: "A soft bed for reflection — thoughts finding their way onto the page.",
    image: "/images/writing-studio-notebook.png",
    tint: "rgba(36, 28, 18, 0.42)",
    midTint: "rgba(150, 120, 70, 0.2)",
    objectPos: "object-[48%_48%]",
    fgPos: "object-[45%_75%]",
  },
  {
    id: "literary",
    title: "Literary Fiction",
    track: "Dusty Photo Frame",
    line: "Quiet rooms. Precise sentences. Memory settling into ink.",
    image: "/images/hero-mid-story.jpg",
    tint: "rgba(40, 32, 22, 0.45)",
    midTint: "rgba(120, 95, 60, 0.22)",
    objectPos: "object-[55%_40%]",
    fgPos: "object-[50%_78%]",
  },
  {
    id: "romance",
    title: "Romance",
    track: "Amber Drift",
    line: "Warm pulse under soft light. The page keeps the heart honest.",
    image: "/images/writing-studio-golden.png",
    tint: "rgba(90, 40, 50, 0.42)",
    midTint: "rgba(180, 110, 90, 0.22)",
    objectPos: "object-[55%_38%]",
    fgPos: "object-[50%_78%]",
  },
  {
    id: "horror",
    title: "Horror",
    track: "Basement Door Ajar",
    line: "A low hum in the walls. Something waits just past the margin.",
    image: "/images/soundscape-night.png",
    tint: "rgba(8, 6, 16, 0.58)",
    midTint: "rgba(40, 25, 45, 0.38)",
    objectPos: "object-[45%_50%]",
    fgPos: "object-[48%_82%]",
  },
  {
    id: "nonbinaural",
    title: "Non-binaural",
    track: "Light rain Birdsong",
    line: "Everyday weather for everyday writing — rain, birds, and room to think.",
    image: "/images/soundscape-forest.png",
    tint: "rgba(20, 35, 30, 0.48)",
    midTint: "rgba(50, 90, 70, 0.28)",
    objectPos: "object-[50%_36%]",
    fgPos: "object-[52%_85%]",
  },
] as const;
