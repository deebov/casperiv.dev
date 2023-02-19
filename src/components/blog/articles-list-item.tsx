import Link from "next/link";
import format from "date-fns/format";
import classNames from "clsx";
import type { BlogPost, CaseStudy, CodeSnippet } from "contentlayer/generated";
import { getArticleSlug } from "lib/mdx/get-article-slug";

interface Props {
  isFeatured?: boolean;
  article: BlogPost | CodeSnippet | CaseStudy;
  type: "blog" | "snippets";
}

export function ArticleListItem({ isFeatured, article, type }: Props) {
  const publishedAt = format(new Date(article.createdAt), "dd MMMM yyyy");
  const extraAProps = isFeatured
    ? {
        style: { borderRadius: 3.5 },
        className: "z-20 block p-3 bg-gray-50 w-full h-full",
      }
    : {};

  return (
    <li
      className={classNames("my-4 first:mt-0 group", {
        "z-10 mt-0 p-1 bg-gradient-to-tr from-[#1150d4] to-[#a245fc] rounded-md hover:shadow-lg transition-shadow":
          isFeatured,
      })}
    >
      <Link href={`/${type}/${getArticleSlug(article)}`} {...extraAProps}>
        <h2 style={{ fontSize: "1.25rem" }} className="font-semibold">
          {article.title}
        </h2>
        <p className="mt-1 text-secondary">{article.description}</p>
        {isFeatured ? null : (
          <span className="block mt-1.5 font-normal text-secondary-light">{publishedAt}</span>
        )}
      </Link>
    </li>
  );
}
