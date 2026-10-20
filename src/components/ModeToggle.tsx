"use client";

import { useSyncExternalStore } from "react";

export type Mode = "light" | "dark";

/**
 * Runs in <head> before the page paints, so there's no flash of the wrong colours.
 * Uses the saved choice, otherwise the visitor's system setting.
 */
export const modeScript = `(function(){try{var m=localStorage.getItem('mode');if(m!=='light'&&m!=='dark'){m=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.mode=m}catch(e){document.documentElement.dataset.mode='light'}})()`;

const EVENT = "modechange";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}
const getMode = () => (document.documentElement.dataset.mode as Mode) ?? "light";
const getServerMode = () => null;

export function ModeToggle() {
  const mode = useSyncExternalStore(subscribe, getMode, getServerMode);
  const next: Mode = mode === "dark" ? "light" : "dark";

  const toggle = () => {
    document.documentElement.dataset.mode = next;
    try {
      localStorage.setItem("mode", next);
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  };

  return (
    <button
      type="button"
      className="mode-toggle"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      data-mode={mode ?? undefined}
    >
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" className="duotone">
        {/* Sun: shown in light mode */}
        <g className="mode-toggle__sun">
          <circle className="duotone__fill" cx="18" cy="18" r="7" />
          <circle className="duotone__line" cx="16" cy="16" r="6.5" />
          <path
            className="duotone__line"
            d="M16 2.5v3.5M16 26v3.5M2.5 16H6M26 16h3.5M6.5 6.5l2.4 2.4M23.1 23.1l2.4 2.4M6.5 25.5l2.4-2.4M23.1 8.9l2.4-2.4"
          />
        </g>
        {/* Moon: shown in dark mode */}
        <g className="mode-toggle__moon">
          <path className="duotone__fill" d="M27 20.5A11 11 0 1 1 14.5 6a8.6 8.6 0 0 0 12.5 14.5Z" />
          <path className="duotone__line" d="M25 18.5A11 11 0 1 1 12.5 4a8.6 8.6 0 0 0 12.5 14.5Z" />
          <path className="duotone__line" d="M24 5v4M22 7h4" />
        </g>
      </svg>
    </button>
  );
}
