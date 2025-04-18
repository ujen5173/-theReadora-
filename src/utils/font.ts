import { Prompt, Outfit } from "next/font/google";

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
