import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  Clock,
  Calendar,
  Sparkles,
  Mail,
  Tag as TagIcon,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import SiteLayout from "@/components/layout/site-layout";
import {
  useListPublicBlogPosts,
  useListPublicBlogCategories,
} from "@workspace/api-client-react";
import type { PublicBlogPostSummary } from "@workspace/api-client-react";
import {
  categoryVisualFor,
  formatPostDateShort,
  absoluteUrl,
} from "@/lib/blog-helpers";
import { useSeo } from "@/lib/use-seo";

const PAGE_SIZE = 9;

function useDebounced<T>(value: T, delay = 250): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

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

function FeaturedSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">
      <Skeleton className="h-72 lg:h-[28rem] rounded-3xl" />
      <div className="space-y-4 py-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-12 w-40" />
      </div>
    </div>
  );
}

interface FeaturedHeroProps {
  post: PublicBlogPostSummary;
}

function FeaturedHero({ post }: FeaturedHeroProps) {
  const visual = categoryVisualFor(post.categorySlug);
  return (
    <article
      className="relative grid lg:grid-cols-2 gap-6 lg:gap-10 items-stretch rounded-3xl overflow-hidden border bg-card"
      data-testid="featured-post"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="relative block h-72 lg:h-auto min-h-[20rem] overflow-hidden group"
      >
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${visual.gradient}`}
            style={{ backgroundImage: visual.pattern }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-foreground font-bold text-[10px] tracking-[0.2em] uppercase">
          <Sparkles className="w-3 h-3 text-primary" />
          Featured
        </div>
      </Link>
      <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
        {post.categoryName ? (
          <Link
            href={`/blog/category/${post.categorySlug ?? ""}`}
            className={`inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-full border ${visual.chip} text-xs font-semibold mb-4`}
          >
            <TagIcon className="w-3 h-3" />
            {post.categoryName}
          </Link>
        ) : null}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-[-0.02em] text-foreground leading-[1.15] mb-4">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-6">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatPostDateShort(post.publishedAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {post.readingTime} min read
          </span>
          <span>By {post.author}</span>
        </div>
        <Button asChild size="lg" data-testid="read-featured-post">
          <Link href={`/blog/${post.slug}`}>
            Read the post
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

function PostCard({ post, index }: { post: PublicBlogPostSummary; index: number }) {
  const visual = categoryVisualFor(post.categorySlug, index);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, delay: Math.min(index, 5) * 0.04 }}
      className="group rounded-3xl border bg-card overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all flex flex-col"
      data-testid={`post-card-${post.slug}`}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="relative block h-48 overflow-hidden"
      >
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${visual.gradient}`}
            style={{ backgroundImage: visual.pattern }}
          >
            <div className="absolute bottom-3 right-4 text-white/40 font-extrabold text-5xl tracking-tighter">
              {visual.number}
            </div>
          </div>
        )}
      </Link>
      <div className="p-6 flex-1 flex flex-col">
        {post.categoryName ? (
          <Link
            href={`/blog/category/${post.categorySlug ?? ""}`}
            className={`inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-full border ${visual.chip} text-[11px] font-semibold mb-3`}
          >
            {post.categoryName}
          </Link>
        ) : null}
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

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const debouncedQuery = useDebounced(query, 300);

  // Reset to first page when filters change.
  useEffect(() => {
    setPage(0);
  }, [activeCategory, debouncedQuery]);

  const categoriesQuery = useListPublicBlogCategories({
    query: { staleTime: 60_000 } as never,
  });

  // Featured = newest published post overall (separate, unfiltered request).
  const featuredQuery = useListPublicBlogPosts(
    { limit: 1, offset: 0 },
    { query: { staleTime: 60_000 } as never },
  );
  const featured = featuredQuery.data?.posts[0];

  const listParams = useMemo(() => {
    const params: {
      limit: number;
      offset: number;
      category?: string;
      q?: string;
    } = {
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    };
    if (activeCategory !== "all") params.category = activeCategory;
    if (debouncedQuery.trim()) params.q = debouncedQuery.trim();
    return params;
  }, [activeCategory, debouncedQuery, page]);

  const postsQuery = useListPublicBlogPosts(listParams, {
    query: {
      staleTime: 30_000,
      placeholderData: (prev: unknown) => prev,
    } as never,
  });

  const allPosts = postsQuery.data?.posts ?? [];
  // Hide the featured post in the grid only when no filters are active and we're on page 0.
  const filtersActive =
    activeCategory !== "all" || debouncedQuery.trim().length > 0 || page > 0;
  const visiblePosts = filtersActive
    ? allPosts
    : allPosts.filter((p) => p.slug !== featured?.slug);

  const total = postsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useSeo({
    title: "Blog",
    description:
      "Frameworks, teardowns, and case studies on AI-first websites, lead generation, conversational AI and the future of search.",
    canonical: absoluteUrl("/blog"),
    type: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Blaze Studio Blog",
      url: absoluteUrl("/blog"),
      description:
        "AI strategy, conversational design, AI SEO and case studies from the Blaze Studio team.",
    },
    defaults: { title: "Blaze Studio" },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <SiteLayout>
      <div className="pt-24">
        {/* Hero */}
        <section className="relative isolate pt-10 pb-10 sm:pt-14 sm:pb-12 md:pt-16 md:pb-14 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/12 via-background to-background" />
          <div className="absolute inset-0 -z-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.025]" />

          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <div className="flex flex-wrap items-center gap-2.5 mb-5 sm:mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground text-background font-bold text-[10px] sm:text-[11px] tracking-[0.2em] uppercase">
                  <BookOpen className="w-3 h-3" />
                  The Blaze Journal
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.025em] text-foreground leading-[1.05] mb-5">
                Frameworks, teardowns &amp; lessons from shipping{" "}
                <span className="text-primary">AI-first websites</span>.
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Real numbers from real client projects, plus the playbooks we use
                to plan, prioritise and ship AI inside existing businesses.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured */}
        <section className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          {featuredQuery.isLoading ? (
            <FeaturedSkeleton />
          ) : featured ? (
            <FeaturedHero post={featured} />
          ) : null}
        </section>

        {/* Filters + Search */}
        <section className="container mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div
              className="flex flex-wrap gap-2 -mx-1 px-1"
              data-testid="category-tabs"
            >
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                data-testid="category-all"
                className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                  activeCategory === "all"
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card text-foreground border-border hover:border-primary/40"
                }`}
              >
                All
              </button>
              {categoriesQuery.data?.categories.map((cat) => {
                const visual = categoryVisualFor(cat.slug);
                const active = activeCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.slug)}
                    data-testid={`category-${cat.slug}`}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                      active
                        ? "bg-foreground text-background border-foreground"
                        : `${visual.chip} hover:border-primary/40`
                    }`}
                  >
                    {cat.name}
                    <span className="ml-1.5 text-[11px] opacity-70 tabular-nums">
                      {cat.postCount}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts..."
                className="pl-9"
                data-testid="search-input"
              />
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="container mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
          {postsQuery.isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          ) : visiblePosts.length === 0 ? (
            <div
              className="text-center py-16 sm:py-20 border-2 border-dashed border-border rounded-3xl"
              data-testid="empty-state"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                No posts found
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {debouncedQuery.trim() || activeCategory !== "all"
                  ? "Try a different search or category."
                  : "Nothing here yet — check back soon."}
              </p>
              {(debouncedQuery.trim() || activeCategory !== "all") && (
                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={() => {
                    setQuery("");
                    setActiveCategory("all");
                  }}
                  data-testid="clear-filters"
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                data-testid="post-grid"
              >
                <AnimatePresence mode="popLayout">
                  {visiblePosts.map((post, i) => (
                    <PostCard key={post.id} post={post} index={i} />
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
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

        {/* Newsletter */}
        <section className="container mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
          <div className="rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-background p-8 sm:p-12 text-center max-w-3xl mx-auto">
            <div className="w-12 h-12 mx-auto mb-5 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] mb-3">
              New posts, straight to your inbox
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              One concise email when we ship a new teardown or framework. No spam,
              unsubscribe in one click.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1"
                data-testid="newsletter-email"
              />
              <Button type="submit" data-testid="newsletter-submit">
                Subscribe
              </Button>
            </form>
            {subscribed && (
              <p className="mt-3 text-sm text-emerald-600 font-medium">
                Thanks — you're on the list.
              </p>
            )}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
