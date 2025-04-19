import { Prompt, Outfit, Merriweather } from "next/font/google";

export const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const kanit = Prompt({
  subsets: ["latin"],
  variable: "--font-kanit",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const merriweatherFont = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  preload: true,
});
