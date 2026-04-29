import { useEffect, useMemo } from "react";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Sparkles,
  ChevronRight,
  Tag as TagIcon,
  BookOpen,
  Users,
} from "lucide-react";
import SiteLayout from "@/components/layout/site-layout";
import NotFound from "@/pages/not-found";
import { Button } from "@/components/ui/button";
import {
  POSTS,
  categoryFromSlug,
  categoryMeta,
  categorySlug,
  categoryColor,
  getPostsByCategory,
  type Category,
  type Post,
} from "@/lib/posts";

function ArticleCard({ post, index }: { post: Post; index: number }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
        className="group h-full flex flex-col rounded-2xl overflow-hidden border bg-background hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      >
        <div
          className={`relative aspect-[16/10] bg-gradient-to-br ${post.gradient} overflow-hidden`}
        >
          <div className="absolute inset-0" style={{ backgroundImage: post.pattern }} aria-hidden />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-15 mix-blend-overlay" />
          <div className="absolute top-4 left-4">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border backdrop-blur-sm bg-white/90 ${categoryColor[post.category]}`}
            >
              <TagIcon className="w-3 h-3" />
              {post.category.toUpperCase()}
            </span>
          </div>
          <div className="absolute bottom-4 right-4 text-white/30 text-5xl font-black tabular-nums leading-none">
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {post.date}
            </span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
          </div>

          <h3 className="text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-5">
            {post.excerpt}
          </p>

          <div className="mt-auto pt-4 border-t flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-8 h-8 shrink-0 rounded-full ${post.authorColor} flex items-center justify-center text-xs font-bold`}
              >
                {post.authorInitials}
              </div>
              <span className="text-xs font-semibold text-foreground/80 truncate">
                {post.author}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function OtherTopicCard({ category }: { category: Category }) {
  const meta = categoryMeta[category];
  const slug = categorySlug[category];
  const count = getPostsByCategory(category).length;
  return (
    <Link
      href={`/blog/category/${slug}`}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${meta.gradient} text-white p-5 sm:p-6 min-h-[160px] flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="absolute inset-0" style={{ backgroundImage: meta.pattern }} aria-hidden />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-15 mix-blend-overlay" />
      <div className="absolute -right-2 -bottom-3 text-[6rem] font-black opacity-15 leading-[0.85] tabular-nums tracking-[-0.04em] pointer-events-none">
        {meta.number}
      </div>
      <div className="relative">
        <div className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-80 mb-1.5">
          {meta.tagline}
        </div>
        <div className="text-lg sm:text-xl font-extrabold tracking-tight leading-tight">
          {category}
        </div>
      </div>
      <div className="relative flex items-center justify-between text-xs font-semibold">
        <span className="opacity-80">
          {count} article{count === 1 ? "" : "s"}
        </span>
        <span className="inline-flex items-center gap-1 group-hover:gap-2 transition-all">
          Browse
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

export default function BlogCategoryPage() {
  const [, params] = useRoute("/blog/category/:slug");
  const slug = params?.slug ?? "";
  const category: Category | undefined = categoryFromSlug[slug];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  const posts = useMemo(
    () => (category ? getPostsByCategory(category) : []),
    [category],
  );
  const otherCategories = useMemo<Category[]>(
    () =>
      (Object.keys(categoryMeta) as Category[]).filter((c) => c !== category),
    [category],
  );
  const contributors = useMemo(
    () => (category ? new Set(posts.map((p) => p.author)).size : 0),
    [category, posts],
  );

  if (!category) return <NotFound />;

  const meta = categoryMeta[category];

  return (
    <SiteLayout>
      <div className="pt-24">
        {/* Editorial hero band */}
        <section
          className={`relative overflow-hidden bg-gradient-to-br ${meta.gradient} text-white`}
        >
          <div className="absolute inset-0" style={{ backgroundImage: meta.pattern }} aria-hidden />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.18] mix-blend-overlay"
            aria-hidden
          >
            <defs>
              <pattern
                id={`cat-grid-${slug}`}
                width="48"
                height="48"
                patternUnits="userSpaceOnUse"
              >
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#cat-grid-${slug})`} />
          </svg>
          <div className="absolute -top-24 -right-12 w-[28rem] h-[28rem] bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-20 w-[24rem] h-[24rem] bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs sm:text-sm text-white/80 mb-7 sm:mb-8"
            >
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <Link href="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <span className="text-white font-medium">Topics</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <span className="text-white font-medium truncate">{category}</span>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-end">
              <div className="md:col-span-8">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-wrap items-center gap-2.5 mb-5">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 text-foreground font-bold text-[10px] sm:text-[11px] tracking-[0.2em] uppercase">
                      <Sparkles className="w-3 h-3 text-primary" />
                      Topic Nº {meta.number}
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-white/85 uppercase">
                      <span className="w-6 h-px bg-white/40" />
                      {meta.tagline}
                    </span>
                  </div>

                  <h1 className="text-[clamp(2.25rem,7.5vw,4.5rem)] font-extrabold tracking-[-0.025em] leading-[1.04] mb-5 text-balance break-words">
                    {category}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-white/85 leading-relaxed max-w-2xl">
                    {meta.description}
                  </p>

                  {/* Meta strip */}
                  <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 pt-5 border-t border-white/20">
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="w-4 h-4" />
                      <span className="font-bold tabular-nums">{posts.length}</span>
                      <span className="text-white/80">
                        article{posts.length === 1 ? "" : "s"} in this topic
                      </span>
                    </div>
                    {contributors > 0 && (
                      <>
                        <span className="hidden sm:inline w-1 h-1 rounded-full bg-white/40" />
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4" />
                          <span className="font-bold tabular-nums">
                            {contributors}
                          </span>
                          <span className="text-white/80">
                            contributor{contributors === 1 ? "" : "s"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Giant editorial number */}
              <div className="hidden md:flex md:col-span-4 justify-end items-end">
                <div className="text-[14rem] lg:text-[16rem] font-black opacity-25 leading-[0.85] tabular-nums tracking-[-0.05em]">
                  {meta.number}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Articles in this topic */}
        <section className="py-14 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-primary/20 text-primary font-semibold text-[11px] sm:text-xs tracking-widest uppercase mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  In this topic
                </span>
                <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-extrabold tracking-[-0.02em] text-foreground leading-tight">
                  All {category} articles
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all articles
              </Link>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-16 sm:py-20 rounded-3xl border border-dashed bg-secondary/30">
                <div className="inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-background border mb-4">
                  <BookOpen className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  No articles in this topic yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Subscribe to be the first to read what we publish here.
                </p>
                <Link href="/blog">
                  <Button variant="outline">Browse all articles</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {posts.map((post, i) => (
                  <ArticleCard key={post.slug} post={post} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Other topics */}
        <section className="py-14 sm:py-20 bg-secondary/30 border-y">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-primary/20 text-primary font-semibold text-[11px] sm:text-xs tracking-widest uppercase mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Other topics
                </span>
                <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-extrabold tracking-[-0.02em] text-foreground leading-tight">
                  Explore the rest of Blaze Insights
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {otherCategories.map((c) => (
                <OtherTopicCard key={c} category={c} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-foreground text-background py-16 sm:py-20 lg:py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary rounded-full blur-[140px] opacity-25 pointer-events-none" />
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary font-semibold text-[11px] sm:text-xs tracking-widest uppercase mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Free Audit
              </span>
              <h2 className="text-[clamp(1.875rem,5vw,2.75rem)] font-extrabold tracking-[-0.02em] leading-[1.15] mb-4">
                Want this working on your site?
              </h2>
              <p className="text-base sm:text-lg text-white/70 mb-8 leading-relaxed">
                Book a free 30-minute audit. We'll look at your site, your funnel,
                and tell you which two or three integrations would pay back fastest.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-12 sm:h-14 px-7 sm:px-8 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 group"
                  >
                    Get My Free Audit
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-12 sm:h-14 px-7 sm:px-8 text-base font-bold bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
                  >
                    See our services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
