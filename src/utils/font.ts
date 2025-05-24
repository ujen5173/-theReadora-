import {
  Manrope,
  Merriweather,
  Noto_Sans_Georgian,
  Prompt,
} from "next/font/google";

export const outfit = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
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

export const contentFont = Noto_Sans_Georgian({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-georgia",
  preload: true,
});
