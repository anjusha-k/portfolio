import type { Metadata } from "next";
import { Art } from "@/components/Art";
import { PageIntro, SayHello, Title } from "@/components/Bits";
import { Reveal } from "@/components/Reveal";
import { awards, hobbies, stats } from "@/content/site";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageIntro title="About me">
        <p>
          I&apos;m a <strong>developer</strong>, an occasional <strong>designer</strong> and a <strong>maker</strong>{" "}
          who has been building for the web and mobile since 2019. I care about code that is easy to read, well tested
          and kind to the next developer.
        </p>
      </PageIntro>

      <section className="section wrap">
        <div className="story">
          <Reveal className="story__text">
            <p>
              I studied Computer Science at <strong>IIIT RGUKT RK Valley</strong>, and my first real job was an
              internship at <strong>Intel</strong> in Bangalore, chasing bugs in processor validation tools with GDB.
              That taught me patience, and how to read code I didn&apos;t write.
            </p>
            <p>
              At <strong>ThoughtWorks</strong> in Hyderabad I moved to the front end, building the{" "}
              <strong>IDFC FIRST Bank</strong> website and mobile apps, and working on the <strong>BHIM</strong> UPI
              payments app. I started on small tasks and grew into the team that designed features like two-factor
              login and UPI payments.
            </p>
            <p>
              Today I&apos;m in <strong>Sydney</strong>, building supply chain tools at <strong>HelloFresh</strong>.
              When there&apos;s no designer, I design the screens myself, and I&apos;ve been the only front-end
              developer on two systems from first commit to launch.
            </p>
          </Reveal>
          <Art name="opera" className="story__art" />
        </div>
      </section>

      <section className="section wrap">
        <Reveal className="narrow">
          <Title>A few numbers</Title>
        </Reveal>
        <div className="stats">
          {stats.map((s, i) => (
            <Reveal key={s.label} className="stat" delay={i * 80}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section wrap">
        <Reveal className="narrow">
          <Title>Away from the keyboard</Title>
          <p>When I&apos;m not coding, you&apos;ll find me doing one of these.</p>
        </Reveal>
        <div className="hobbies">
          {hobbies.map((h, i) => (
            <Reveal key={h.name} className="hobby" delay={i * 80}>
              <b>{h.name}</b>
              <span>{h.note}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section wrap">
        <Reveal className="narrow">
          <Title>Awards &amp; education</Title>
        </Reveal>
        <ul className="awards">
          {awards.map((a, i) => (
            <Reveal as="li" key={a.name} className="award" delay={i * 80}>
              <b>{a.name}</b>
              <span>{a.by}</span>
            </Reveal>
          ))}
        </ul>
      </section>

      <SayHello />
    </>
  );
}
