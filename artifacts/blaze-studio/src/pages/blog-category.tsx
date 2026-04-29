import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SiteLayout from "@/components/layout/site-layout";
import NotFound from "@/pages/not-found";
import {
  useListPublicBlogPosts,
  useListPublicBlogCategories,
} from "@workspace/api-client-react";
import type { PublicBlogPostSummary } from "@workspace/api-client-react";
import {
  categoryVisualFor,
  formatPostDateShort,
  absoluteUrl,
  gradientCssFor,
} from "@/lib/blog-helpers";
import { useSeo } from "@/lib/use-seo";

const PAGE_SIZE = 9;

function PostCardSkeleton() {
  return (
    <div className="rounded-3xl border bg-card overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

function PostCard({ post, index }: { post: PublicBlogPostSummary; index: number }) {
  const visual = categoryVisualFor(post.categorySlug, index);
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 5) * 0.04 }}
      className="group rounded-3xl border bg-card overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all flex flex-col"
      data-testid={`post-card-${post.slug}`}
    >
      <Link href={`/blog/${post.slug}`} className="relative block h-48 overflow-hidden">
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `${visual.pattern}, ${gradientCssFor(post.categorySlug)}`,
            }}
          >
            <div className="absolute bottom-3 right-4 text-white/40 font-extrabold text-5xl tracking-tighter">
              {visual.number}
            </div>
          </div>
        )}
      </Link>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug mb-2.5 line-clamp-2">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formatPostDateShort(post.publishedAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {post.readingTime} min
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default function BlogCategoryPage() {
  const [match, params] = useRoute<{ slug: string }>("/blog/category/:slug");
  const slug = match ? params.slug : "";
  const [page, setPage] = useState(0);

  useEffect(() => setPage(0), [slug]);

  const categoriesQuery = useListPublicBlogCategories({
    query: { staleTime: 60_000 } as never,
  });

  const postsQuery = useListPublicBlogPosts(
    { category: slug, limit: PAGE_SIZE, offset: page * PAGE_SIZE },
    {
      query: {
        enabled: Boolean(slug),
        staleTime: 30_000,
        placeholderData: (prev: unknown) => prev,
      } as never,
    },
  );

  const category = categoriesQuery.data?.categories.find((c) => c.slug === slug);
  const visual = categoryVisualFor(slug);
  const posts = postsQuery.data?.posts ?? [];
  const total = postsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // The category may exist in the DB but have no published posts yet — still
  // show the page header rather than a 404 in that case.
  const categoryName = category?.name ?? null;

  useSeo({
    title: categoryName ? `${categoryName} — Blog` : "Blog category",
    description:
      category?.description ??
      `Posts on ${categoryName ?? slug} from the Blaze Studio team.`,
    canonical: absoluteUrl(`/blog/category/${slug}`),
    type: "website",
    jsonLd: categoryName
      ? {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${categoryName} — Blaze Studio`,
          url: absoluteUrl(`/blog/category/${slug}`),
          description:
            category?.description ??
            `Posts on ${categoryName} from the Blaze Studio team.`,
        }
      : undefined,
    defaults: { title: "Blaze Studio" },
  });

  // If categories list has loaded and our slug isn't in it AND we have no
  // posts under it, the category genuinely doesn't exist.
  const categoryConfirmedMissing =
    !categoriesQuery.isLoading &&
    !category &&
    !postsQuery.isLoading &&
    posts.length === 0 &&
    total === 0;

  if (categoryConfirmedMissing) {
    return <NotFound />;
  }

  return (
    <SiteLayout>
      <div className="pt-24">
        {/* Hero */}
        <section className="relative isolate overflow-hidden">
          <div
            className="absolute inset-0 -z-10 opacity-95"
            style={{
              backgroundImage: `${visual.pattern}, ${gradientCssFor(slug)}`,
            }}
          />
          <div className="absolute inset-0 -z-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.04]" />

          <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 text-white">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-sm text-white/80 mb-6"
              data-testid="breadcrumb"
            >
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white">{categoryName ?? slug}</span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="font-extrabold text-white/70 tracking-[-0.02em] text-3xl tabular-nums">
                  {visual.number}
                </span>
                <span className="h-px flex-1 bg-white/30 max-w-[8rem]" />
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/80">
                  {visual.tagline}
                </span>
              </div>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.025em] leading-[1.05] mb-5"
                data-testid="category-title"
              >
                {categoryName ?? slug}
              </h1>
              <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl">
                {category?.description ?? visual.description}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button asChild variant="secondary" size="lg" data-testid="back-to-blog">
                  <Link href="/blog">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    All posts
                  </Link>
                </Button>
                <span className="text-sm text-white/80">
                  {total} {total === 1 ? "post" : "posts"}
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Grid */}
        <section className="container mx-auto px-4 sm:px-6 py-14 sm:py-16">
          {postsQuery.isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div
              className="text-center py-16 sm:py-20 border-2 border-dashed border-border rounded-3xl"
              data-testid="empty-state"
            >
              <h3 className="text-xl font-bold text-foreground mb-2">
                No posts in this category yet
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're working on it — meanwhile, browse the rest of the blog.
              </p>
              <Button asChild className="mt-5">
                <Link href="/blog">
                  Browse all posts
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                data-testid="post-grid"
              >
                {posts.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </div>

              {totalPages > 1 && (
                <div
                  className="mt-12 flex items-center justify-center gap-2"
                  data-testid="pagination"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => {
                      setPage((p) => Math.max(0, p - 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    data-testid="page-prev"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setPage(i);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        data-testid={`page-${i + 1}`}
                        className={`min-w-[2.25rem] h-9 px-2 rounded-md text-sm font-semibold border transition-colors ${
                          page === i
                            ? "bg-foreground text-background border-foreground"
                            : "bg-card text-foreground border-border hover:border-primary/40"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages - 1}
                    onClick={() => {
                      setPage((p) => Math.min(totalPages - 1, p + 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    data-testid="page-next"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </SiteLayout>
  );
}
