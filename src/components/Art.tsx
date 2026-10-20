"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Line drawings in the duotone style. The outline draws itself in when the
 * drawing scrolls into view, then the offset colour fill fades in behind it.
 */
type Drawing = { fill: string[]; line: string[]; dots?: string };

const drawings: Record<string, Drawing> = {
  // Clipboard with a big tick
  claims: {
    fill: ["M68 34 H172 V186 H68 Z", "M150 118 m-34 0 a34 34 0 1 0 68 0 a34 34 0 1 0 -68 0"],
    line: [
      "M60 28 H164 V180 H60 Z",
      "M92 18 H132 V40 H92 Z",
      "M80 66 H144 M80 86 H144 M80 106 H118",
      "M144 112 m-30 0 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0",
      "M130 112 L141 123 L160 102",
    ],
    dots: "M76 128 H112 V164 H76 Z",
  },
  // Bell with alert lines and a ticket
  incident: {
    fill: ["M90 140 C90 90 100 60 128 56 C156 60 166 90 166 140 L178 154 H78 Z", "M152 30 H210 V70 H152 Z"],
    line: [
      "M82 134 C82 84 92 54 120 50 C148 54 158 84 158 134 L170 148 H70 Z",
      "M108 148 a12 12 0 0 0 24 0",
      "M120 50 V38",
      "M52 70 L36 60 M48 104 H30 M188 104 H206",
      "M146 24 H204 V64 H146 Z M158 38 H192 M158 50 H180",
    ],
    dots: "M40 160 H200 V176 H40 Z",
  },
  // Phone with a shield and lock
  banking: {
    fill: ["M88 22 H164 V190 H88 Z", "M126 70 L162 82 V112 C162 136 146 150 126 158 C106 150 90 136 90 112 V82 Z"],
    line: [
      "M80 16 H156 Q164 16 164 24 V176 Q164 184 156 184 H80 Q72 184 72 176 V24 Q72 16 80 16 Z",
      "M106 28 H130",
      "M118 64 L154 76 V106 C154 130 138 144 118 152 C98 144 82 130 82 106 V76 Z",
      "M104 104 H132 V128 H104 Z M110 104 V94 a8 8 0 0 1 16 0 V104",
      "M190 150 m-16 0 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0 M190 142 V158",
    ],
    dots: "M24 60 H56 V120 H24 Z",
  },
  // Phone showing a QR code, with a "money sent" arrow bubble
  payments: {
    fill: ["M88 22 H164 V190 H88 Z", "M198 50 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0"],
    line: [
      "M80 16 H156 Q164 16 164 24 V176 Q164 184 156 184 H80 Q72 184 72 176 V24 Q72 16 80 16 Z",
      "M106 28 H130",
      "M92 60 H116 V84 H92 Z M120 60 H144 V84 H120 Z M92 88 H116 V112 H92 Z",
      "M100 68 H108 V76 H100 Z M128 68 H136 V76 H128 Z M100 96 H108 V104 H100 Z",
      "M122 90 H130 M136 90 H144 M122 100 V112 M130 104 H144 M138 104 V112",
      "M92 138 H144 M92 152 H128",
      "M192 44 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0",
      "M180 44 H204 M196 36 L204 44 L196 52",
    ],
    dots: "M24 60 H56 V120 H24 Z",
  },
  // Folded map, dashed route and a pin
  delivery: {
    fill: ["M36 60 L92 44 L148 60 L204 44 V164 L148 180 L92 164 L36 180 Z", "M160 40 a28 28 0 0 1 56 0 C216 70 188 92 188 92 C188 92 160 70 160 40 Z"],
    line: [
      "M28 54 L84 38 L140 54 L196 38 V158 L140 174 L84 158 L28 174 Z",
      "M84 38 V158 M140 54 V174",
      "M48 146 C70 120 96 136 112 110 S150 90 166 74",
      "M152 34 a28 28 0 0 1 56 0 C208 64 180 86 180 86 C180 86 152 64 152 34 Z",
      "M180 34 m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0",
    ],
  },
  // Sydney Opera House over the harbour
  opera: {
    fill: ["M44 150 C60 96 96 70 120 66 C112 100 112 128 118 150 Z", "M112 150 C124 100 156 80 182 76 C172 104 172 130 178 150 Z", "M170 150 C180 118 200 104 222 102 C214 120 214 136 218 150 Z"],
    line: [
      "M36 144 C52 90 88 64 112 60 C104 94 104 122 110 144",
      "M104 144 C116 94 148 74 174 70 C164 98 164 124 170 144",
      "M162 144 C172 112 192 98 214 96 C206 114 206 130 210 144",
      "M22 144 H236 M30 158 H226",
      "M20 176 q12 -8 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0",
      "M60 194 q12 -8 24 0 t24 0 t24 0 t24 0 t24 0 t24 0",
    ],
    dots: "M140 10 m-34 0 a34 34 0 1 0 68 0 a34 34 0 1 0 -68 0",
  },
};

export type ArtName = keyof typeof drawings;

export function Art({ name, className = "" }: { name: ArtName; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);
  const d = drawings[name];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 240 200"
      className={`art ${drawn ? "is-drawn" : ""} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <pattern id={`dots-${name}`} width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" className="art__dot" />
        </pattern>
      </defs>
      {d.dots && <path d={d.dots} fill={`url(#dots-${name})`} className="art__dots" />}
      {d.fill.map((p, i) => (
        <path key={`f${i}`} d={p} className="art__fill" />
      ))}
      {d.line.map((p, i) => (
        <path
          key={`l${i}`}
          d={p}
          pathLength={1}
          className="art__line"
          style={{ "--i": i } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}
