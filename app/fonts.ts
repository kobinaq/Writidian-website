import { Fraunces, Handlee, Lora, Source_Sans_3 } from "next/font/google";

export const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

export const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

export const handlee = Handlee({
  variable: "--font-handlee",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
