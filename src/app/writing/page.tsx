import type { Metadata } from "next";
import { Suspense } from "react";
import { ArticleList } from "@/components/Articles";
import { PageIntro, SayHello } from "@/components/Bits";
import { socials } from "@/content/site";

export const metadata: Metadata = { title: "Writing" };

const medium = socials.find((s) => s.key === "medium")!.href;
const devto = socials.find((s) => s.key === "devto")!.href;

export default function WritingPage() {
  return (
    <>
      <PageIntro title="My writing">
        <p>
          Short, practical notes on React, CSS, Git and the web, from things I learned the hard way at work. I post on{" "}
          <a href={medium} target="_blank" rel="noreferrer">
            Medium
          </a>{" "}
          and{" "}
          <a href={devto} target="_blank" rel="noreferrer">
            DEV
          </a>
          , and this list updates by itself.
        </p>
      </PageIntro>

      <section className="section wrap">
        <Suspense fallback={<p className="muted">Loading articles…</p>}>
          <ArticleList />
        </Suspense>
      </section>

      <SayHello />
    </>
  );
}
