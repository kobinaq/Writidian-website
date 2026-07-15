import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...props }: IconProps & { children: ReactNode }) {
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
      {children}
    </svg>
  );
}

export function InstagramLogo({ size = 20, ...props }: IconProps) {
  const gid = "ig-grad";
  return (
    <Base size={size} {...props}>
      <defs>
        <radialGradient id={gid} cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill={`url(#${gid})`} />
      <rect
        x="6.5"
        y="6.5"
        width="11"
        height="11"
        rx="3.2"
        stroke="white"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="2.6" stroke="white" strokeWidth="1.8" />
      <circle cx="16.4" cy="7.6" r="1" fill="white" />
    </Base>
  );
}

export function WhatsAppLogo({ size = 20, ...props }: IconProps) {
  return (
    <Base size={size} {...props}>
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        fill="white"
        d="M17.5 14.3c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.1-.3 0-.4.1-.6l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.8-.9 2 0 1.2.9 2.4 1 2.5.1.2 1.8 2.8 4.4 3.9 1.8.7 2.2.6 2.6.5.4-.1 1.3-.5 1.5-1 .2-.5.2-.9.1-1z"
      />
      <path
        fill="white"
        fillRule="evenodd"
        d="M12 4.2c-4.3 0-7.8 3.5-7.8 7.8 0 1.4.4 2.7 1 3.8L4.4 19l3.3-.9c1.1.6 2.3.9 3.6.9 4.3 0 7.8-3.5 7.8-7.8S16.3 4.2 12 4.2zm0 14.1c-1.2 0-2.4-.3-3.4-.9l-.2-.1-2 .5.5-1.9-.1-.2c-.6-1-1-2.2-1-3.4 0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5z"
        clipRule="evenodd"
      />
    </Base>
  );
}

export function PinterestLogo({ size = 20, ...props }: IconProps) {
  return (
    <Base size={size} {...props}>
      <circle cx="12" cy="12" r="12" fill="#E60023" />
      <path
        fill="white"
        d="M12.1 6.2c-2.9 0-4.9 1.9-4.9 4.4 0 1.1.4 2.1 1.4 2.4.1 0 .3 0 .3-.2l.2-.7c0-.1 0-.2-.1-.3-.3-.4-.5-.9-.5-1.5 0-1.9 1.4-3.6 3.7-3.6 2 0 3.1 1.2 3.1 2.9 0 2.2-1 3.6-2.4 3.6-.8 0-1.3-.6-1.1-1.4.2-.9.6-1.8.6-2.4 0-.6-.3-1-1-1-.8 0-1.4.8-1.4 1.9 0 .7.2 1.1.2 1.1l-.9 3.7c-.3 1.1 0 2.5 0 2.6 0 .1.1.1.2 0 .1-.1 1.3-1.6 1.7-3 .1-.4.6-2.3.6-2.3.3.6 1.2 1.1 2.1 1.1 2.8 0 4.7-2.5 4.7-5.7 0-2.5-2.1-4.4-5.1-4.4z"
      />
    </Base>
  );
}

export function DiscordLogo({ size = 20, ...props }: IconProps) {
  return (
    <Base size={size} {...props}>
      <rect width="24" height="24" rx="6" fill="#5865F2" />
      <path
        fill="white"
        d="M18.6 7.3c-1.1-.5-2.2-.8-3.4-1l-.2.3c1.1.3 2.1.7 3 1.3-2.6-1.4-5.6-1.4-8.2 0 .9-.6 1.9-1 3-1.3l-.2-.3c-1.2.2-2.3.5-3.4 1C6.4 10.2 5.8 13 6 15.7c1.3 1 2.6 1.6 4 2l.5-.8c-.5-.2-1-.4-1.5-.7.1-.1.3-.1.4-.2 2.8 1.3 5.9 1.3 8.7 0 .1.1.3.1.4.2-.5.3-1 .5-1.5.7l.5.8c1.4-.4 2.7-1 4-2 .3-3.1-.5-5.8-2-8.4zM10.1 14.2c-.8 0-1.4-.7-1.4-1.5s.6-1.5 1.4-1.5 1.5.7 1.4 1.5-.6 1.5-1.4 1.5zm3.9 0c-.8 0-1.4-.7-1.4-1.5s.6-1.5 1.4-1.5 1.5.7 1.4 1.5-.6 1.5-1.4 1.5z"
      />
    </Base>
  );
}

export function TikTokLogo({ size = 20, ...props }: IconProps) {
  return (
    <Base size={size} {...props}>
      <rect width="24" height="24" rx="6" fill="#010101" />
      <path
        fill="#25F4EE"
        d="M16.8 8.1c-.9-.6-1.5-1.5-1.7-2.6h-2.1v9.1c0 1.2-1 2.2-2.2 2.2s-2.2-1-2.2-2.2 1-2.2 2.2-2.2c.2 0 .4 0 .6.1V10c-.2 0-.4-.1-.6-.1-2.4 0-4.3 1.9-4.3 4.3S8.4 18.5 10.8 18.5s4.3-1.9 4.3-4.3V9.7c.9.7 2 1.1 3.2 1.2V8.7c-.5 0-1-.2-1.5-.6z"
      />
      <path
        fill="#FE2C55"
        d="M17.1 8.4c-.9-.6-1.5-1.5-1.7-2.6h-1.5c.3 1.3 1.1 2.4 2.2 3.1.4.3.8.4 1.2.5V8.6c-.1 0-.2 0-.2-.2z"
      />
      <path
        fill="white"
        d="M15.1 9.9V14c0 2.4-1.9 4.3-4.3 4.3S6.5 16.4 6.5 14s1.9-4.3 4.3-4.3c.2 0 .4 0 .6.1v1.9c-.2-.1-.4-.1-.6-.1-1.2 0-2.2 1-2.2 2.2s1 2.2 2.2 2.2 2.2-1 2.2-2.2V7.2h2.1c.1.5.3 1 .6 1.4.4.5.9.9 1.5 1.1v1.8c-.9-.1-1.7-.5-2.5-1.1-.2-.1-.4-.3-.6-.5z"
      />
    </Base>
  );
}

export function SlackLogo({ size = 20, ...props }: IconProps) {
  return (
    <Base size={size} {...props}>
      <rect width="24" height="24" rx="6" fill="#FFFFFF" />
      <path fill="#E01E5A" d="M9.2 14.5a1.5 1.5 0 1 1-1.5-1.5h1.5v1.5zm.8 0a1.5 1.5 0 1 1 3 0v3.8a1.5 1.5 0 1 1-3 0v-3.8z" />
      <path fill="#36C5F0" d="M9.5 9.2a1.5 1.5 0 1 1 1.5-1.5v1.5H9.5zm0 .8a1.5 1.5 0 1 1 0 3H5.7a1.5 1.5 0 1 1 0-3h3.8z" />
      <path fill="#2EB67D" d="M14.8 9.5a1.5 1.5 0 1 1 1.5 1.5h-1.5V9.5zm-.8 0a1.5 1.5 0 1 1-3 0V5.7a1.5 1.5 0 1 1 3 0v3.8z" />
      <path fill="#ECB22E" d="M14.5 14.8a1.5 1.5 0 1 1-1.5 1.5v-1.5h1.5zm0-.8a1.5 1.5 0 1 1 0-3h3.8a1.5 1.5 0 1 1 0 3h-3.8z" />
    </Base>
  );
}

export function XLogo({ size = 20, ...props }: IconProps) {
  return (
    <Base size={size} {...props}>
      <rect width="24" height="24" rx="6" fill="#000000" />
      <path
        fill="white"
        d="M16.7 6.5h1.6l-3.5 4 4.1 5.5h-3.2l-2.5-3.3-2.9 3.3H8.7l3.7-4.3-3.9-5.2h3.3l2.3 3 2.6-3zm-.6 8.5h.9L10 7.4h-1l6.1 7.6z"
      />
    </Base>
  );
}

export function YouTubeLogo({ size = 20, ...props }: IconProps) {
  return (
    <Base size={size} {...props}>
      <rect width="24" height="24" rx="6" fill="#FF0000" />
      <path fill="white" d="M10 8.2v7.6l6.2-3.8L10 8.2z" />
    </Base>
  );
}

export function ChatGptLogo({ size = 20, ...props }: IconProps) {
  return (
    <Base size={size} {...props}>
      <rect width="24" height="24" rx="6" fill="#10A37F" />
      <path
        fill="white"
        d="M12.4 5.2c-.7-.4-1.5-.4-2.2 0L7.8 6.5c-.7.4-1.1 1.1-1.1 1.9v2.2l-1.1.6c-.7.4-1.1 1.1-1.1 1.9v2.6c0 .8.4 1.5 1.1 1.9l2.4 1.4c.7.4 1.5.4 2.2 0l.2-.1v-2.4l-.2.1c-.2.1-.5.1-.7 0L7.1 15c-.2-.1-.4-.4-.4-.6v-2.6c0-.3.1-.5.4-.6l1.1-.6v1.3c0 .8.4 1.5 1.1 1.9l2.4 1.4c.7.4 1.5.4 2.2 0l2.4-1.4c.7-.4 1.1-1.1 1.1-1.9v-2.6c0-.8-.4-1.5-1.1-1.9l-.2-.1v2.4l.2.1c.2.1.4.4.4.6v2.6c0 .3-.1.5-.4.6l-2.4 1.4c-.2.1-.5.1-.7 0l-1.1-.6v1.3l1.1.6c.7.4 1.5.4 2.2 0l2.4-1.4c.7-.4 1.1-1.1 1.1-1.9V12c0-.8-.4-1.5-1.1-1.9l-1.1-.6V7.2l.2.1c.2.1.4.4.4.6v.9h2.1V7.8c0-.8-.4-1.5-1.1-1.9l-2.4-1.4c-.7-.4-1.5-.4-2.2-.1l-.1.1zm-1.1 3.5-1.1.6v2.5l1.1.6 1.1-.6V9.3l-1.1-.6z"
      />
    </Base>
  );
}

export function CalendarLogo({ size = 20, ...props }: IconProps) {
  return (
    <Base size={size} {...props}>
      <rect width="24" height="24" rx="5" fill="#FFFFFF" />
      <path fill="#E74C3C" d="M2 5.5C2 3.6 3.6 2 5.5 2h13C20.4 2 22 3.6 22 5.5V8H2V5.5z" />
      <path
        fill="#2C2C2E"
        d="M8.8 18.2c-1.4 0-2.3-.8-2.3-2 0-.5.2-1 .5-1.4.4-.5.9-.8 1.6-.9l1.1-.2v-.5c0-.5-.2-.7-.7-.7-.5 0-.8.3-.8.8H6.8c0-1.3 1-2.1 2.5-2.1 1.5 0 2.4.8 2.4 2.1v3.7h-1.4v-.7c-.3.5-.9.9-1.5.9zm.4-1.2c.6 0 1-.4 1-.9v-.8l-.8.2c-.6.1-.9.4-.9.9 0 .4.3.6.7.6zm4.5 1.2c-1.5 0-2.4-1-2.4-2.6s.9-2.6 2.4-2.6c.6 0 1.1.2 1.5.6v-2.5h1.5v6.9h-1.4v-.6c-.4.4-.9.8-1.6.8zm.3-1.2c.7 0 1.2-.6 1.2-1.4s-.5-1.4-1.2-1.4-1.2.6-1.2 1.4.5 1.4 1.2 1.4z"
      />
    </Base>
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
