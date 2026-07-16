/**
 * Regenerates components/brand-logos.tsx from Simple Icons glyph paths.
 * Run: npm i -D simple-icons && node scripts/generate-brand-logos.mjs
 */
import * as si from "simple-icons";
import fs from "node:fs";

const brands = {
  instagram: {
    key: "siInstagram",
    bg: "#FF0069",
    shape: "rounded",
    glyph: "white",
    name: "InstagramLogo",
  },
  whatsapp: {
    key: "siWhatsapp",
    bg: "#25D366",
    shape: "circle",
    glyph: "white",
    name: "WhatsAppLogo",
  },
  pinterest: {
    key: "siPinterest",
    bg: "#E60023",
    shape: "circle",
    glyph: "white",
    name: "PinterestLogo",
  },
  discord: {
    key: "siDiscord",
    bg: "#5865F2",
    shape: "rounded",
    glyph: "white",
    name: "DiscordLogo",
  },
  tiktok: {
    key: "siTiktok",
    bg: "#010101",
    shape: "rounded",
    glyph: "white",
    name: "TikTokLogo",
  },
  x: {
    key: "siX",
    bg: "#000000",
    shape: "rounded",
    glyph: "white",
    name: "XLogo",
  },
  youtube: {
    key: "siYoutube",
    bg: "#FF0000",
    shape: "rounded",
    glyph: "white",
    name: "YouTubeLogo",
  },
  googlecalendar: {
    key: "siGooglecalendar",
    bg: "#FFFFFF",
    shape: "rounded",
    glyph: "#4285F4",
    ring: true,
    name: "CalendarLogo",
  },
};

/** Slack hashtag mark, normalized to a 24×24 grid */
const slackPaths = [
  {
    d: "M5.15 15.15c0 1.38-1.12 2.5-2.5 2.5S.15 16.53.15 15.15s1.12-2.5 2.5-2.5h2.5v2.5zm1.25 0c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v6.25c0 1.38-1.12 2.5-2.5 2.5s-2.5-1.12-2.5-2.5v-6.25z",
    fill: "#E01E5A",
  },
  {
    d: "M8.9 5.15c-1.38 0-2.5-1.12-2.5-2.5S7.52.15 8.9.15s2.5 1.12 2.5 2.5v2.5H8.9zm0 1.25c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5H2.65c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5H8.9z",
    fill: "#36C5F0",
  },
  {
    d: "M18.85 8.9c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5h-2.5V8.9zm-1.25 0c0 1.38-1.12 2.5-2.5 2.5s-2.5-1.12-2.5-2.5V2.65c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5V8.9z",
    fill: "#2EB67D",
  },
  {
    d: "M15.1 18.85c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5v-2.5h2.5zm0-1.25c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5h6.25c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5H15.1z",
    fill: "#ECB22E",
  },
];

/** OpenAI blossom mark (24×24) */
const openaiPath =
  "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0807 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1666a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1253a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9723V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1681a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0807L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z";

let out = `import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

/** App-icon shell with an inset brand glyph (Simple Icons paths). */
function AppIcon({
  size = 20,
  bg,
  shape = "rounded",
  ring = false,
  children,
  ...props
}: IconProps & {
  bg: string;
  shape?: "rounded" | "circle";
  ring?: boolean;
  children: ReactNode;
}) {
  const r = shape === "circle" ? 12 : 5.5;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      {shape === "circle" ? (
        <circle cx="12" cy="12" r="12" fill={bg} />
      ) : (
        <rect width="24" height="24" rx={r} fill={bg} />
      )}
      {ring ? (
        <rect
          x="0.5"
          y="0.5"
          width="23"
          height="23"
          rx={r - 0.5}
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="1"
          fill="none"
        />
      ) : null}
      <g transform="translate(4.25 4.25) scale(0.6458)">{children}</g>
    </svg>
  );
}

`;

for (const cfg of Object.values(brands)) {
  const icon = si[cfg.key];
  if (!icon) throw new Error(`Missing icon ${cfg.key}`);
  out += `export function ${cfg.name}({ size = 20, ...props }: IconProps) {
  return (
    <AppIcon size={size} bg="${cfg.bg}" shape="${cfg.shape}"${cfg.ring ? " ring" : ""} {...props}>
      <path fill="${cfg.glyph}" d="${icon.path}" />
    </AppIcon>
  );
}

`;
}

out += `export function SlackLogo({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <rect width="24" height="24" rx="5.5" fill="#FFFFFF" />
      <rect
        x="0.5"
        y="0.5"
        width="23"
        height="23"
        rx="5"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1"
        fill="none"
      />
      <g transform="translate(1.5 1.5) scale(0.875)">
${slackPaths.map((p) => `        <path fill="${p.fill}" d="${p.d}" />`).join("\n")}
      </g>
    </svg>
  );
}

export function ChatGptLogo({ size = 20, ...props }: IconProps) {
  return (
    <AppIcon size={size} bg="#10A37F" {...props}>
      <path fill="white" d="${openaiPath}" />
    </AppIcon>
  );
}

export type BrandKey =
  | "instagram"
  | "whatsapp"
  | "pinterest"
  | "discord"
  | "tiktok"
  | "slack"
  | "x"
  | "youtube"
  | "chatgpt"
  | "calendar";

export function BrandLogo({
  brand,
  size = 20,
}: {
  brand: BrandKey;
  size?: number;
}) {
  switch (brand) {
    case "instagram":
      return <InstagramLogo size={size} />;
    case "whatsapp":
      return <WhatsAppLogo size={size} />;
    case "pinterest":
      return <PinterestLogo size={size} />;
    case "discord":
      return <DiscordLogo size={size} />;
    case "tiktok":
      return <TikTokLogo size={size} />;
    case "slack":
      return <SlackLogo size={size} />;
    case "x":
      return <XLogo size={size} />;
    case "youtube":
      return <YouTubeLogo size={size} />;
    case "chatgpt":
      return <ChatGptLogo size={size} />;
    case "calendar":
      return <CalendarLogo size={size} />;
    default:
      return null;
  }
}
`;

fs.writeFileSync("components/brand-logos.tsx", out);
console.log("Wrote components/brand-logos.tsx");
