"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { pages, person, themeFor } from "@/content/site";
import { BubbleIcon } from "./Icons";
import { Logo } from "./Logo";
import { MenuOverlay } from "./MenuOverlay";
import { ModeToggle } from "./ModeToggle";

export function Header() {
  const pathname = usePathname();
  const theme = themeFor(pathname);
  const [open, setOpen] = useState(false);

  // Close the menu whenever the page changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="site-header">
        <div className="site-header__left">
          <Link href="/" className="site-header__logo" aria-label="Back to the home page">
            <Logo theme={theme} />
          </Link>
          <button
            type="button"
            className="menu-trigger"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="menu-trigger__label">{open ? "Close" : "Menu"}</span>
            <span className="u-vhide"> menu</span>
          </button>
        </div>
        <div className="site-header__right">
          <ModeToggle />
          <a
            className="hire-me"
            href={`mailto:${person.email}?subject=${encodeURIComponent(person.hireSubject)}`}
          >
            <BubbleIcon />
            <span>Hire me</span>
          </a>
        </div>
      </header>
      <MenuOverlay open={open} pages={pages} current={pathname} />
    </>
  );
}
