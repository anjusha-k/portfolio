import Link from "next/link";
import { socials, type pages as Pages } from "@/content/site";
import { SocialIcon } from "./Icons";

type Props = {
  open: boolean;
  pages: typeof Pages;
  current: string;
};

/** Full-screen menu: a row of social icons, then big page links with a one-line note each. */
export function MenuOverlay({ open, pages, current }: Props) {
  return (
    <nav
      id="site-menu"
      className={`menu ${open ? "is-open" : ""}`}
      aria-label="Main"
      aria-hidden={!open}
      inert={!open}
    >
      <div className="menu__inner">
        <ul className="menu__socials">
          <li className="menu__rule" aria-hidden="true" />
          {socials.map((s, i) => (
            <li key={s.key} style={{ "--i": i } as React.CSSProperties}>
              <a href={s.href} aria-label={s.label} target={s.key === "email" ? undefined : "_blank"} rel="noreferrer">
                <SocialIcon name={s.key} />
              </a>
            </li>
          ))}
        </ul>
        <ul className="menu__pages">
          {pages.map((p, i) => (
            <li key={p.href} style={{ "--i": i } as React.CSSProperties}>
              <Link
                href={p.href}
                className="menu__link"
                aria-current={current === p.href ? "page" : undefined}
              >
                {p.label}
              </Link>
              <span className="menu__blurb">{p.blurb}</span>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
