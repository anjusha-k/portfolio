"use client";

import { useEffect, useRef } from "react";

/**
 * Anjusha's illustrated portrait.
 *
 * The artwork is split into three alpha masks in /public/portrait
 * (made by scripts/split_portrait.py from the two-tone illustration):
 *   knock.png  everything inside her outline (so the stripes don't show through)
 *   fill.png   the soft blue shading
 *   line.png   the dark outlines
 * Each mask is painted with a colour from the theme, so the portrait follows it.
 *
 * Like the reference site, the head tilts gently with the mouse, and the
 * shading drifts a touch against the outlines (a slightly off-register print).
 */
export function Portrait() {
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const art = artRef.current;
    if (!art) return;
    const fill = art.querySelector<HTMLElement>(".portrait__fill");
    let frame = 0;
    let mx = 0;
    let my = 0;
    const draw = () => {
      frame = 0;
      art.style.transform = `rotate(${mx * 1.5}deg) translate(${mx * 6}px, ${my * 4}px)`;
      if (fill) fill.style.transform = `translate(${mx * 3}px, ${my * 2}px)`;
    };
    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / innerWidth) * 2 - 1;
      my = (e.clientY / innerHeight) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="portrait">
      <div className="portrait__band stripes" aria-hidden="true" />
      <div ref={artRef} className="portrait__art" role="img" aria-label="Illustration of Anjusha">
        <span className="portrait__layer portrait__knock" />
        <span className="portrait__layer portrait__fill" />
        <span className="portrait__layer portrait__line" />
      </div>
    </div>
  );
}
