import { cacheLife } from "next/cache";

export type Article = {
  title: string;
  url: string;
  date: string; // ISO
  summary: string;
  source: "Medium" | "DEV";
};

const DEVTO = "https://dev.to/api/articles?username=anjushakhandavalli&per_page=30";
const MEDIUM = "https://medium.com/feed/@anjusha.khandavalli";

function decode(text: string) {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstSentences(text: string, max = 160) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

async function fromDevto(): Promise<Article[]> {
  const res = await fetch(DEVTO);
  if (!res.ok) return [];
  const items: { title: string; url: string; published_at: string; description: string }[] = await res.json();
  return items.map((a) => ({
    title: a.title,
    url: a.url,
    date: a.published_at,
    summary: firstSentences(a.description ?? ""),
    source: "DEV",
  }));
}

async function fromMedium(): Promise<Article[]> {
  const res = await fetch(MEDIUM);
  if (!res.ok) return [];
  const xml = await res.text();
  const pick = (block: string, tag: string) =>
    block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1] ?? "";
  // Medium sends either the full post (content:encoded) or a short card
  // (description) with a "medium-feed-snippet" paragraph. Use the first paragraph of either.
  const summaryOf = (item: string) => {
    const html = (pick(item, "content:encoded") || pick(item, "description")).replace(/<!\[CDATA\[|\]\]>/g, "");
    const para =
      html.match(/class="medium-feed-snippet">([\s\S]*?)<\/p>/)?.[1] ?? html.match(/<p>([\s\S]*?)<\/p>/)?.[1] ?? "";
    return firstSentences(decode(para));
  };
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => ({
    title: decode(pick(item, "title")),
    url: decode(pick(item, "link")).split("?")[0],
    date: new Date(decode(pick(item, "pubDate"))).toISOString(),
    summary: summaryOf(item),
    source: "Medium" as const,
  }));
}

export async function getArticles(): Promise<Article[]> {
  "use cache";
  cacheLife("days");
  const results = await Promise.allSettled([fromMedium(), fromDevto()]);
  return results
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .sort((a, b) => b.date.localeCompare(a.date));
}
