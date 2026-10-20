import { getArticles } from "@/lib/articles";

function formatDate(iso: string) {
  return new Date(iso)
    .toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

/** Article list in the reference site's style: date with a rule on the left, title and summary on the right. */
export async function ArticleList({ limit }: { limit?: number }) {
  const all = await getArticles();
  const articles = limit ? all.slice(0, limit) : all;

  if (!articles.length) {
    return <p className="muted">Articles couldn&apos;t load just now. Find them on Medium and DEV.</p>;
  }

  return (
    <ul className="articles">
      {articles.map((a) => (
        <li key={a.url} className="article">
          <div className="article__meta">
            <time dateTime={a.date}>{formatDate(a.date)}</time>
            <span className="article__source">{a.source}</span>
          </div>
          <div>
            <h3 className="article__title">
              <a href={a.url} target="_blank" rel="noreferrer">
                {a.title}
              </a>
            </h3>
            <p className="article__summary">{a.summary}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
