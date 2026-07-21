export const APP_URL = "https://app.writidian.com";
export const CONTACT_EMAIL = "hello@writidian.com";

export const SITE = {
  name: "Writidian",
  tagline: "A space for intentional writing.",
  description:
    "Writidian is a writing sanctuary for people who want to think and write for themselves. Soundscapes, daily prompts, and a built-in editor.",
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
  heroHeadline: "Write like the craft still matters.",
  heroSupport:
    "A quiet space that raises your odds of finishing what you started.",
  problemWords:
    "Phones, tabs, and digital noise compete with focus. The place you sit down in should help you finish, not work against you.",
  soundscapesTitle: "Soundscapes that match your story",
  soundscapesBody:
    "Pair the scene on the page with the world in your ears. Writing a forest chapter? Step into forest sound. Each soundscape is built to hold the mood while you write.",
  binaurals:
    "Binaurals for focused headspace. Alpha for relaxed focus, Beta for alertness, Gamma for peak attention, Theta for creativity, Delta for deep calm.",
  binauralsTip: "Use headphones for best effect.",
  promptTitle: "A prompt waiting every morning",
  promptBody:
    "A new prompt every day from a large collection. Sometimes a scene starter you continue. Built to provoke thinking and get you writing immediately.",
  samplePromptLabel: "Nostalgia",
  samplePrompt:
    "There is a song you refuse to listen to anymore because it transports you to a time you can't get back. What time is that?",
  editorTitle: "The editor lives here",
  editorBody:
    "Writing happens inside Writidian itself. No bouncing between tools. Open a prompt, start a draft, stay in the flow.",
  streakTitle: "Momentum that stays with you",
  streakBody:
    "Build a writing streak you can feel. Each day you show up, the flame grows. Miss a day and it resets. Simple pressure that keeps you returning to the page.",
  analyticsTitle: "See your writing rhythm",
  analyticsBody:
    "Track sanctuary hours, words flowed, and the shape of your week. A quiet mirror of your practice, not a leaderboard.",
  stanceTitle: "Built against the grain",
  stanceBody:
    "AI has thinned the art of writing and the wellbeing that comes with doing hard creative work yourself. Writidian takes the other path. No generators. No rewrite buttons. A space that asks you to think.",
  platformNote:
    "Writidian is a web app today. A mobile app is in the pipeline.",
  finalCta: "Start writing for free.",
  finalSupport: "Sign up and step into your sanctuary.",
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
    id: "compass",
    label: "Thematic Compass",
    value: "Fantasy · 42%",
    detail: "Your drafts lean toward worlds that ask for wonder.",
  },
  {
    id: "resonance",
    label: "Soundscape Resonance",
    value: "Arcsine Drift",
    detail: "The bed that held your longest uninterrupted session.",
  },
  {
    id: "rhythm",
    label: "Flow Rhythm",
    value: "24 min avg",
    detail: "Quiet stretches where the timer disappeared.",
  },
  {
    id: "hours",
    label: "Sanctuary Hours",
    value: "18.4 h",
    detail: "Time spent inside the writing room this month.",
  },
  {
    id: "words",
    label: "Words Flowed",
    value: "12,480",
    detail: "Not a leaderboard — a mirror of showing up.",
  },
] as const;

export const GENRES = [
  "Romance",
  "Horror",
  "Sci-fi",
  "Fantasy",
  "Literary",
  "Journaling",
  "Mystery",
  "Poetry",
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

/** Genre soundscapes aligned with the Writidian app Genres tab. */
export const SOUNDSCAPE_SCENES = [
  {
    id: "romance",
    title: "Romance",
    track: "Arcsine Drift",
    line: "Soft pulse under candlelight. The page keeps the heart honest.",
    image: "/images/writing-sanctuary-focus.jpg",
    tint: "rgba(120, 60, 70, 0.45)",
    midTint: "rgba(180, 120, 100, 0.25)",
  },
  {
    id: "horror",
    title: "Horror",
    track: "Basement Door Ajar",
    line: "A low hum in the walls. Something waits just past the margin.",
    image: "/images/writing-sanctuary-focus.jpg",
    tint: "rgba(30, 20, 40, 0.55)",
    midTint: "rgba(60, 40, 50, 0.35)",
  },
  {
    id: "scifi",
    title: "Science Fiction",
    track: "Orbital Sand Hymn",
    line: "Vacuum hush and distant engines. Tomorrow written in present tense.",
    image: "/images/writing-sanctuary-focus.jpg",
    tint: "rgba(20, 40, 70, 0.5)",
    midTint: "rgba(40, 80, 120, 0.3)",
  },
  {
    id: "fantasy",
    title: "Fantasy",
    track: "Moonglass Spires",
    line: "Wind through ancient stone. Magic that still costs something.",
    image: "/images/writing-sanctuary-focus.jpg",
    tint: "rgba(40, 50, 80, 0.48)",
    midTint: "rgba(90, 70, 130, 0.28)",
  },
  {
    id: "literary",
    title: "Literary Fiction",
    track: "Sunlit Inkflow",
    line: "Quiet rooms. Precise sentences. The truth arrives slowly.",
    image: "/images/writing-sanctuary-focus.jpg",
    tint: "rgba(50, 40, 30, 0.42)",
    midTint: "rgba(140, 110, 70, 0.22)",
  },
] as const;
