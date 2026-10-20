"use client";

import { usePathname } from "next/navigation";
import { themeFor } from "@/content/site";

/** Gives each page its own colour palette, chosen from the URL. */
export function ThemeFrame({ children }: { children: React.ReactNode }) {
  const theme = themeFor(usePathname());
  return (
    <div className="frame" data-theme={theme}>
      {children}
    </div>
  );
}
