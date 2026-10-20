import { Suspense } from "react";
import { Art } from "@/components/Art";
import { Button, ProjectLinks, SayHello, ScrollHint, Title } from "@/components/Bits";
import { Portrait } from "@/components/Portrait";
import { Reveal } from "@/components/Reveal";
import { person, projects } from "@/content/site";
import { ArticleList } from "@/components/Articles";

export default function Home() {
  return (
    <>
      <section className="hero wrap">
        <div className="hero__text">
          <h1 className="hero__title">
            Hi, my
            <br />
            <span className="nowrap">
              name is <strong>{person.firstName}</strong>
              <span className="title__dot">.</span>
            </span>
          </h1>
          <p className="hero__lead">
            I&apos;m a <strong>{person.role}</strong> from {person.city}.
          </p>
        </div>
        <Portrait />
        <ScrollHint />
      </section>

      <section className="section wrap">
        <Reveal className="narrow">
          <Title>Let&apos;s work together</Title>
          <p>
            From internal tools used across a global company to the IDFC FIRST Bank and BHIM apps used by millions, I turn rough sketches
            into fast, tested, accessible products. I like owning the whole thing: the repo, the screens, the tests
            and the launch, <strong>start to finish</strong>.
          </p>
          <Button href="/work">About my work</Button>
        </Reveal>
      </section>

      <section className="section wrap">
        <div className="split">
          <Reveal className="narrow">
            <Title>Things I&apos;ve built</Title>
            <p>Most of my work lives behind company logins, so here is what it does instead of a link.</p>
          </Reveal>
          <div className="pattern-block dots" aria-hidden="true" />
        </div>

        <div className="features">
          {projects.map((p) => (
            <Reveal as="article" key={p.slug} className="feature">
              <Art name={p.art} className="feature__art" />
              <div>
                <span className="eyebrow">{p.tag}</span>
                <Title as="h3" rule={false}>
                  {p.name}
                </Title>
                {p.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                <ProjectLinks links={p.links} name={p.name} />
                <Button href={`/work#${p.slug}`}>Read more</Button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section wrap">
        <Reveal className="narrow">
          <Title>Latest writing</Title>
          <p>I write short, practical notes on React, CSS and Git.</p>
        </Reveal>
        <Suspense fallback={<p className="muted">Loading articles…</p>}>
          <ArticleList limit={3} />
        </Suspense>
        <Reveal>
          <Button href="/writing">All my writing</Button>
        </Reveal>
      </section>

      <SayHello />
    </>
  );
}
