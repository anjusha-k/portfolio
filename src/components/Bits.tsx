import Link from "next/link";
import { person, type ProjectLink } from "@/content/site";
import { Reveal } from "./Reveal";

/** Heading with the coloured full stop and short rule underneath. */
export function Title({
  children,
  as: Tag = "h2",
  rule = true,
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  rule?: boolean;
}) {
  return (
    <Tag className={`title title--${Tag} ${rule ? "title--rule" : ""}`}>
      {children}
      <span className="title__dot">.</span>
    </Tag>
  );
}

/** Outlined button with the striped shadow. */
export function Button({ href, children }: { href: string; children: React.ReactNode }) {
  const external = /^(https?:|mailto:)/.test(href);
  if (external) {
    return (
      <a className="button" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        <span>{children}</span>
      </a>
    );
  }
  return (
    <Link className="button" href={href}>
      <span>{children}</span>
    </Link>
  );
}

/** "SCROLL" with a long line falling from it. */
export function ScrollHint() {
  return (
    <div className="scroll-hint" aria-hidden="true">
      <span>Scroll</span>
    </div>
  );
}

/** Thin vertical copyright line on the left edge. */
export function SideRail() {
  return (
    <div className="side-rail" aria-hidden="true">
      <span>{person.rail}</span>
    </div>
  );
}

/** Opening block for the inner pages. */
export function PageIntro({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="page-intro wrap">
      <Title as="h1">{title}</Title>
      <div className="lead">{children}</div>
      <ScrollHint />
    </section>
  );
}

/** "Say hello." block that closes every page. */
export function SayHello() {
  return (
    <section className="say-hello wrap">
      <Reveal>
        <Title>Say hello</Title>
        <p className="lead">
          Looking for a front-end developer, or just want to talk React? My inbox is always open.
        </p>
        <Button href={`mailto:${person.email}?subject=${encodeURIComponent(person.hireSubject)}`}>
          {person.email}
        </Button>
      </Reveal>
    </section>
  );
}

/** Where to see a live project: store pages and website, each opening in a new tab. */
export function ProjectLinks({ links, name }: { links?: ProjectLink[]; name: string }) {
  if (!links?.length) return null;
  return (
    <ul className="project-links">
      {links.map((l) => (
        <li key={l.href}>
          <a href={l.href} target="_blank" rel="noreferrer" aria-label={`${name} on ${l.label} (opens in a new tab)`}>
            {l.label}
            <span aria-hidden="true"> ↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
