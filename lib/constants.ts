export const APP_URL = "https://app.writidian.com";

export const SITE = {
  name: "Writidian",
  tagline: "A space for intentional writing.",
  description:
    "Writidian is a writing sanctuary for people who want to think and write for themselves. Soundscapes, daily prompts, and a built-in editor. No AI.",
};

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
  stanceTitle: "Built against the grain",
  stanceBody:
    "AI has thinned the art of writing and the wellbeing that comes with doing hard creative work yourself. Writidian takes the other path. No generators. No rewrite buttons. A space that asks you to think.",
  platformNote:
    "Writidian is a web app today. A mobile app is in the pipeline.",
  finalCta: "Start writing for free.",
  finalSupport: "Sign up and step into your sanctuary.",
};

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

/** Social-style notification clutter for the sanctuary reveal */
export const SOCIAL_CLUTTER = [
  {
    id: "s1",
    platform: "Feed",
    title: "@everyone",
    body: "liked your photo · 2m",
    accent: "#E1306C",
    x: 10,
    y: 12,
    ox: -48,
    oy: -38,
    rot: -16,
  },
  {
    id: "s2",
    platform: "Chirp",
    title: "Trending now",
    body: "Hot take thread you do not need",
    accent: "#1DA1F2",
    x: 78,
    y: 10,
    ox: 52,
    oy: -42,
    rot: 14,
  },
  {
    id: "s3",
    platform: "Ping",
    title: "12 new mentions",
    body: "Your group chat will not wait",
    accent: "#5865F2",
    x: 16,
    y: 36,
    ox: -56,
    oy: 8,
    rot: -10,
  },
  {
    id: "s4",
    platform: "Scroll",
    title: "For You",
    body: "Watch this before you write",
    accent: "#000000",
    x: 84,
    y: 34,
    ox: 50,
    oy: 6,
    rot: 18,
  },
  {
    id: "s5",
    platform: "Heart",
    title: "47 likes",
    body: "Someone replied to your story",
    accent: "#FF2D55",
    x: 48,
    y: 16,
    ox: -8,
    oy: -52,
    rot: -20,
  },
  {
    id: "s6",
    platform: "Buzz",
    title: "Breaking",
    body: "Another notification. Another tab.",
    accent: "#FF4500",
    x: 62,
    y: 58,
    ox: 44,
    oy: 38,
    rot: 12,
  },
  {
    id: "s7",
    platform: "DM",
    title: "Unread (9)",
    body: "hey u free rn???",
    accent: "#25D366",
    x: 12,
    y: 68,
    ox: -50,
    oy: 44,
    rot: -14,
  },
  {
    id: "s8",
    platform: "Alert",
    title: "URGENT",
    body: "Meeting starts in 5 minutes",
    accent: "#C0392B",
    x: 86,
    y: 70,
    ox: 48,
    oy: 40,
    rot: 16,
  },
  {
    id: "s9",
    platform: "AI",
    title: "Rewrite this?",
    body: "Generate a better paragraph",
    accent: "#7C5CFF",
    x: 34,
    y: 52,
    ox: -42,
    oy: 22,
    rot: -12,
  },
  {
    id: "s10",
    platform: "Feed",
    title: "Suggested for you",
    body: "Infinite scroll is calling",
    accent: "#E1306C",
    x: 70,
    y: 44,
    ox: 46,
    oy: -12,
    rot: 10,
  },
] as const;

export const SOUNDSCAPE_SCENES = [
  {
    id: "forest",
    title: "Forest night",
    line: "Crickets in the dark. Soft wind through the pines. Your scene outside the window.",
    image: "/images/soundscape-forest.png",
  },
  {
    id: "coast",
    title: "Coast",
    line: "Slow tide against the shore. Salt air. The page keeps rhythm with the waves.",
    image: "/images/soundscape-coast.png",
  },
  {
    id: "night",
    title: "Night desk",
    line: "One lamp. Soft room hush. The rest of the world on mute.",
    image: "/images/soundscape-night.png",
  },
] as const;
