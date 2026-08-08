import { CONTACT_EMAIL } from "@/lib/constants";
import type { ReactNode } from "react";

const URL_RE =
  /https?:\/\/[^\s<>"')\]]+|mailto:[^\s<>"')\]]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

export function linkifyText(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(URL_RE.source, "g");

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    const raw = match[0];
    const trailing = raw.match(/[.,;:]+$/)?.[0] ?? "";
    const token = trailing ? raw.slice(0, -trailing.length) : raw;

    let href = token;
    let label = token;
    if (token.includes("@") && !token.startsWith("http") && !token.startsWith("mailto:")) {
      href = `mailto:${token}`;
      label = token === "info@writidian.com" ? CONTACT_EMAIL : token;
    } else if (token.startsWith("mailto:")) {
      label = token.replace(/^mailto:/, "");
    }

    nodes.push(
      <a
        key={`${match.index}-${token}`}
        href={href}
        className="text-gold underline-offset-2 hover:underline"
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {label}
      </a>,
    );
    if (trailing) nodes.push(trailing);
    last = match.index + raw.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
