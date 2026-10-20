import type { ThemeKey } from "@/content/site";

/**
 * The logo changes shape with the page, like the reference site:
 * an "A" peak on most pages and a pen nib on Writing.
 * Each shape is drawn twice — a solid fill offset down-right, then the outline.
 */
const shapes: Record<ThemeKey, { fill: string; line: string }> = {
  home: {
    fill: "M38 6 L68 54 H8 Z",
    line: "M32 2 L62 50 H2 Z M20 31 H44 M32 2 L47 26",
  },
  work: {
    fill: "M38 6 L68 54 H8 Z",
    line: "M32 2 L62 50 H2 Z M20 31 H44 M26 40 L20 31 L26 22 M38 40 L44 31 L38 22",
  },
  about: {
    fill: "M38 6 L68 54 H8 Z",
    line: "M32 2 L62 50 H2 Z M20 31 H44 M10 50 L26 26 L36 40 L44 31 L56 50",
  },
  writing: {
    fill: "M38 6 L58 30 L38 54 L18 30 Z",
    line: "M32 2 L52 26 L32 50 L12 26 Z M32 2 V34 M32 40 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0",
  },
};

export function Logo({ theme }: { theme: ThemeKey }) {
  const s = shapes[theme];
  return (
    <svg className="logo duotone" viewBox="0 0 70 56" width="70" height="56" aria-hidden="true">
      <path className="duotone__fill logo__fill" d={s.fill} />
      <path className="duotone__line" d={s.line} />
    </svg>
  );
}
