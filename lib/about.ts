export const ABOUT = {
  title: "About Writidian",
  coined: "Coined from two words that mean a lot to us:",
  lexicon: {
    word: "Writidian",
    pos: "n.",
    gloss: "write every day",
    etymologyLabel: "Etymology",
    etymology: "Write + Quotidian",
    etymologyNote: "every day",
    meaningLabel: "Meaning",
    meaning: "Write every day.",
  },
  equation: [
    { word: "Write", note: null, emphasis: false },
    { word: "Quotidian", note: "(every day)", emphasis: false },
    { word: "Writidian", note: "(Write every day)", emphasis: true },
  ],
  paragraphs: [
    "One of humanity's greatest powers is the ability to think and create anything. And at Writidian, we understand that writing is thinking, as much as it is human.",
    "The modern digital environment is largely hostile to the human process of writing. Distractions are everywhere, and the opportunity to think critically is often completely handed over to LLMs.",
    "Writidian's purpose lies in helping you create a dedicated and immersive ecosystem for thinking through writing.",
  ],
  audience: {
    title: "Who is Writidian for?",
    rows: [
      {
        id: "flow-state",
        body: "Writidian is for anyone who desires to think. You could be a writer, storyteller, an author, a creator, or simply someone who takes their craft seriously.",
        image: "/images/about-flow-state.jpg",
        imageAlt: "A writer in quiet concentration at a sunlit desk",
        imageLabel: "Flow State",
        imageFirst: false,
      },
      {
        id: "subtractive",
        body: "It is for the writer who understands that the environment in which they write is as important as the words they end up writing.",
        image: "/images/about-subtractive-design.jpg",
        imageAlt: "A sparse writing desk with only essentials in soft light",
        imageLabel: "Subtractive Design",
        imageFirst: true,
      },
    ],
  },
  vision: {
    label: "Our Vision",
    body: "To preserve and sharpen every mind's ability to imagine boundlessly and think critically through writing.",
  },
  mission: {
    label: "Our Mission",
    body: "To engineer the right digital environment for every thinker's words and ideas to flourish.",
  },
  contact: {
    lead: "Want to make any inquiries? Send us an email!",
    cta: "Email us",
  },
} as const;
