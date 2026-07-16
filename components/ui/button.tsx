"use client";

import { APP_URL } from "@/lib/constants";
import { motion } from "motion/react";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
};

const variants = {
  primary:
    "bg-espresso text-paper border border-espresso hover:bg-ink",
  outline:
    "bg-transparent text-gold border border-gold hover:bg-gold/10 hover:text-ink",
  ghost:
    "bg-transparent text-ink-muted border border-transparent hover:text-ink",
};

export function Button({
  children,
  href = APP_URL,
  variant = "primary",
  className = "",
}: ButtonProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:gap-2 sm:px-7 sm:py-3 ${variants[variant]} ${className}`}
    >
      <span>{children}</span>
      <span
        aria-hidden
        className="flex h-6 w-6 items-center justify-center rounded-full bg-paper/15 text-sm leading-none sm:h-7 sm:w-7 sm:text-base"
      >
        →
      </span>
    </motion.a>
  );
}
