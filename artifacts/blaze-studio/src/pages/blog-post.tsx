import { useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  ChevronRight,
  Tag as TagIcon,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SiteLayout from "@/components/layout/site-layout";
import NotFound from "@/pages/not-found";
import {
  useGetPublicBlogPost,
} from "@workspace/api-client-react";
import {
  categoryVisualFor,
  formatPostDate,
  formatPostDateShort,
  absoluteUrl,
} from "@/lib/blog-helpers";
import { useSeo } from "@/lib/use-seo";
import ReadingProgress from "@/components/blog/reading-progress";
import ShareButtons from "@/components/blog/share-buttons";

interface TocEntry {
  id: string;
  text: string;
  level: number;
}

/**
 * Parse the rendered article HTML to build a table of contents from h2/h3
 * headings, slugifying any heading without an explicit id so anchor links
 * keep working.
 */
function buildTocFromHtml(html: string): {
  html: string;
  entries: TocEntry[];
} {
  if (typeof window === "undefined") return { html, entries: [] };
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  const entries: TocEntry[] = [];
  const used = new Set<string>();
  const headings = wrapper.querySelectorAll("h2, h3");
  headings.forEach((node) => {
    const text = (node.textContent ?? "").trim();
    if (!text) return;
    let id = node.getAttribute("id") || slugify(text);
    let suffix = 2;
    while (used.has(id)) {
      id = `${slugify(text)}-${suffix++}`;
    }
    used.add(id);
    node.setAttribute("id", id);
    entries.push({
      id,
      text,
      level: node.tagName === "H2" ? 2 : 3,
    });
  });
  return { html: wrapper.innerHTML, entries };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80) || "section";
}

function ArticleSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-3xl pt-32 pb-20">
      <Skeleton className="h-5 w-32 mb-6" />
      <Skeleton className="h-12 w-full mb-3" />
      <Skeleton className="h-12 w-3/4 mb-6" />
      <Skeleton className="h-5 w-64 mb-10" />
      <Skeleton className="h-72 w-full mb-10 rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  const [match, params] = useRoute<{ slug: string }>("/blog/:slug");
  const slug = match ? params.slug : "";
  const [activeSection, setActiveSection] = useState<string>("");

  const { data, isLoading, isError, error } = useGetPublicBlogPost(slug, {
    query: {
      enabled: Boolean(slug),
      staleTime: 60_000,
    } as never,
  });

  const post = data?.post;
  const previous = data?.previous ?? null;
  const next = data?.next ?? null;
  const related = data?.related ?? [];

  const visual = categoryVisualFor(post?.categorySlug);
  const articleUrl = useMemo(
    () => (post ? absoluteUrl(`/blog/${post.slug}`) : ""),
    [post],
  );

  const { html: processedHtml, entries: tocEntries } = useMemo(
    () => buildTocFromHtml(post?.content ?? ""),
    [post?.content],
  );

  // Scroll-spy: track which section is currently in view to highlight in ToC.
  useEffect(() => {
    if (tocEntries.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 1] },
    );
    tocEntries.forEach((entry) => {
      const el = document.getElementById(entry.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [tocEntries]);

  // SEO + JSON-LD
  useSeo({
    title: post ? post.metaTitle : "Loading post...",
    description: post?.metaDescription,
    canonical: articleUrl || undefined,
    image: post?.featuredImage ?? null,
    type: "article",
    publishedTime: post?.publishedAt,
    modifiedTime: post?.updatedAt,
    author: post?.author,
    section: post?.categoryName,
    tags: post?.tags,
    jsonLd: post
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.metaDescription || post.excerpt,
          image: post.featuredImage ? [post.featuredImage] : undefined,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: {
            "@type": "Person",
            name: post.author,
          },
          publisher: {
            "@type": "Organization",
            name: "Blaze Studio",
            url: absoluteUrl("/"),
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": articleUrl,
          },
          articleSection: post.categoryName ?? undefined,
          keywords: post.tags?.length ? post.tags.join(", ") : undefined,
        }
      : undefined,
    defaults: { title: "Blaze Studio" },
  });

  if (isLoading) {
    return (
      <SiteLayout>
        <ArticleSkeleton />
      </SiteLayout>
    );
  }

  if (isError) {
    // Treat 404s explicitly as not-found, surface other errors as 404 too
    // so private/unpublished posts cannot be probed.
    const status = (error as { response?: { status?: number } } | null | undefined)
      ?.response?.status;
    if (status === 404 || !post) {
      return <NotFound />;
    }
  }

  if (!post) {
    return <NotFound />;
  }

  return (
    <SiteLayout>
      <ReadingProgress targetSelector="article#post-body" />

      {/* Hero */}
      <header className="pt-28 sm:pt-32 pb-10 sm:pb-12 relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6"
            data-testid="breadcrumb"
          >
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
            {post.categoryName && post.categorySlug && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link
                  href={`/blog/category/${post.categorySlug}`}
                  className="hover:text-foreground"
                >
                  {post.categoryName}
                </Link>
              </>
            )}
          </nav>

          {post.categoryName && post.categorySlug ? (
            <Link
              href={`/blog/category/${post.categorySlug}`}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${visual.chip} text-xs font-semibold mb-5`}
            >
              <TagIcon className="w-3 h-3" />
              {post.categoryName}
            </Link>
          ) : null}

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.025em] text-foreground leading-[1.08] mb-5"
            data-testid="post-title"
          >
            {post.title}
          </motion.h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-7 max-w-3xl">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{post.author}</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatPostDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readingTime} min read
            </span>
          </div>
        </div>
      </header>

      {/* Featured image */}
      {post.featuredImage ? (
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl mb-10 sm:mb-14">
          <div className="rounded-3xl overflow-hidden border bg-secondary">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-auto object-cover"
              data-testid="post-hero-image"
            />
          </div>
        </div>
      ) : null}

      {/* Body + ToC */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl pb-16 sm:pb-20">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_16rem] gap-10 lg:gap-14">
          <article
            id="post-body"
            className="prose prose-zinc max-w-none prose-headings:scroll-mt-32 prose-headings:tracking-[-0.02em] prose-h2:text-3xl prose-h2:font-extrabold prose-h2:mt-14 prose-h2:mb-5 prose-h3:text-xl prose-h3:font-bold prose-h3:mt-9 prose-h3:mb-3 prose-p:text-foreground/85 prose-p:leading-[1.78] prose-p:text-[17px] prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-strong:font-bold prose-blockquote:border-l-primary prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:text-foreground prose-img:rounded-2xl prose-img:border prose-li:text-foreground/85 prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none prose-pre:bg-foreground prose-pre:text-background"
            data-testid="post-content"
            dangerouslySetInnerHTML={{ __html: processedHtml }}
          />

          {tocEntries.length > 0 && (
            <aside
              className="hidden lg:block"
              aria-label="On this page"
              data-testid="toc"
            >
              <div className="sticky top-28">
                <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-3 flex items-center gap-2">
                  <ListChecks className="w-3.5 h-3.5" />
                  On this page
                </div>
                <ul className="space-y-1.5 border-l border-border">
                  {tocEntries.map((entry) => (
                    <li key={entry.id} className={entry.level === 3 ? "ml-3" : ""}>
                      <a
                        href={`#${entry.id}`}
                        className={`block pl-4 -ml-px border-l text-sm leading-snug py-1 transition-colors ${
                          activeSection === entry.id
                            ? "border-primary text-primary font-medium"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {entry.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>

        {/* Tags + Share */}
        <div className="mt-14 pt-8 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          {post.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2" data-testid="post-tags">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-foreground/80 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : (
            <div />
          )}
          <ShareButtons url={articleUrl} title={post.title} excerpt={post.excerpt} />
        </div>

        {/* Prev / Next */}
        {(previous || next) && (
          <nav
            className="mt-14 grid sm:grid-cols-2 gap-4"
            aria-label="Adjacent posts"
            data-testid="prev-next-nav"
          >
            {previous ? (
              <Link
                href={`/blog/${previous.slug}`}
                className="group rounded-2xl border bg-card p-5 hover:border-primary/40 transition-colors"
                data-testid="prev-post"
              >
                <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  <ArrowLeft className="w-3.5 h-3.5" /> Previous
                </span>
                <span className="block font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="group rounded-2xl border bg-card p-5 hover:border-primary/40 transition-colors text-right sm:ml-auto sm:w-full"
                data-testid="next-post"
              >
                <span className="flex items-center justify-end gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="block font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {next.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.02em]">
                Keep reading
              </h2>
              <Link
                href="/blog"
                className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
              >
                All posts <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-testid="related-posts"
            >
              {related.map((rel, i) => {
                const relVisual = categoryVisualFor(rel.categorySlug, i);
                return (
                  <Link
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    className="group rounded-3xl border bg-card overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all"
                    data-testid={`related-${rel.slug}`}
                  >
                    <div className="relative h-40 overflow-hidden">
                      {rel.featuredImage ? (
                        <img
                          src={rel.featuredImage}
                          alt={rel.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${relVisual.gradient}`}
                          style={{ backgroundImage: relVisual.pattern }}
                        />
                      )}
                    </div>
                    <div className="p-5">
                      {rel.categoryName ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${relVisual.chip} text-[10px] font-semibold mb-2`}
                        >
                          {rel.categoryName}
                        </span>
                      ) : null}
                      <h3 className="font-bold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {rel.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatPostDateShort(rel.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {rel.readingTime} min
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
