import type { Metadata } from "next";
import { Bitter, Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { SideRail } from "@/components/Bits";
import { modeScript } from "@/components/ModeToggle";
import { ThemeFrame } from "@/components/ThemeFrame";
import { person } from "@/content/site";
import "./globals.css";

const bitter = Bitter({ variable: "--font-serif", subsets: ["latin"], weight: ["400", "700"] });
const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: `${person.fullName} | Front-end Developer`,
    template: `%s | ${person.fullName}`,
  },
  description:
    "Anjusha Khandavalli is a front-end developer in Sydney with 7+ years building React, Next.js and React Native apps.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the mode script sets data-mode on <html> before React loads.
    <html lang="en" className={`${bitter.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <ThemeFrame>
          <Header />
          <SideRail />
          {children}
        </ThemeFrame>
      </body>
    </html>
  );
}
