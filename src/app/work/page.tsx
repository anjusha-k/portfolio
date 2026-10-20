import type { Metadata } from "next";
import { Art } from "@/components/Art";
import { PageIntro, ProjectLinks, SayHello, Title } from "@/components/Bits";
import { Reveal } from "@/components/Reveal";
import { jobs, projects, skillGroups } from "@/content/site";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <>
      <PageIntro title="About my work">
        <p>
          I build <strong>fast, tested and accessible front ends</strong> with React and Next.js. Over 7+ years I&apos;ve
          shipped the IDFC FIRST Bank and BHIM apps, used by millions across India, and supply chain tools used across HelloFresh, often as the only
          front-end developer, <strong>from first commit to launch</strong>.
        </p>
      </PageIntro>

      <section className="section wrap">
        <Reveal className="narrow">
          <Title>Where I&apos;ve worked</Title>
        </Reveal>
        <ol className="timeline">
          {jobs.map((job) => (
            <Reveal as="li" key={job.company} className="job">
              <span className="eyebrow">
                {job.when} · {job.place}
              </span>
              <h3 className="job__title">
                {job.title} <em>@ {job.company}</em>
              </h3>
              <ul className="job__points">
                {job.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="section wrap">
        <Reveal className="narrow">
          <Title>Selected projects</Title>
          <p>Most of this work sits behind company logins, so instead of links, here is what each one does.</p>
        </Reveal>
        <div className="features">
          {projects.map((p) => (
            <Reveal as="article" key={p.slug} className="feature">
              <span id={p.slug} className="anchor" />
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
                {p.tech.length > 0 && (
                  <ul className="chips">
                    {p.tech.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section wrap">
        <Reveal className="narrow">
          <Title>Tools I use</Title>
        </Reveal>
        <div className="skill-grid">
          {skillGroups.map((g, i) => (
            <Reveal key={g.name} className="skill-group" delay={i * 80}>
              <h3 className="eyebrow">{g.name}</h3>
              <ul className="chips">
                {g.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <SayHello />
    </>
  );
}
