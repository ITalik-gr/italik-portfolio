import { SITE } from "./site";

export const PRIVACY = {
  meta: {
    title: `Privacy · ${SITE.name}`,
    description:
      "What italik.dev collects: cookieless Umami analytics, AI chat questions sent to Anthropic to answer them, and nothing sold or shared for ads.",
  },
  updated: "2026-10-03",
  sub: "A personal site, so the short version: no cookies, no ads, no tracking across sites. Here is everything it does collect.",
  sections: [
    {
      title: "Analytics",
      body: [
        "I use Umami Cloud to see how the site is used. It sets no cookies and does not identify you. It counts page views, the referring site, country, browser and device type, which links and buttons are clicked, how far a page is scrolled and how long a visit lasts.",
      ],
    },
    {
      title: "AI chat",
      body: [
        "Questions you type into the chat are sent to Anthropic's API to write the answer. This site does not save the conversation; it lives in your browser tab and is gone when you close it. My server logs only token counts, never the text, and analytics get only the length of a question.",
        "To stop abuse, your IP address is used as a rate-limit key (20 questions per 10 minutes) in Upstash Redis and expires with that window.",
      ],
      link: { label: "Anthropic's privacy policy", href: "https://www.anthropic.com/legal/privacy" },
    },
    {
      title: "Hosting",
      body: [
        "The site runs on Vercel, which keeps standard request logs (IP address, browser, time) to serve and protect it.",
      ],
    },
    {
      title: "Your browser",
      body: [
        "The site remembers in local storage which home page you came from, so the menu and the CV stay the same across pages. Clearing site data removes it.",
      ],
    },
    {
      title: "Email",
      body: [
        "If you write to me, I keep the thread to reply and nothing more. Nothing on this site is sold or shared for advertising.",
      ],
    },
    {
      title: "Questions",
      body: [`Ask what I have about you or ask me to delete it: ${SITE.email}.`],
    },
  ],
} as const;
