import { useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Share2,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  Info,
  Sparkles,
  Tag as TagIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/layout/site-layout";
import NotFound from "@/pages/not-found";
import {
  getPostBySlug,
  getRelatedPosts,
  categoryColor,
  type Block,
  type Post,
} from "@/lib/posts";

function renderInline(text: string) {
  // Supports **bold** within a paragraph / list item.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

const calloutStyles = {
  info: {
    border: "border-sky-500/30",
    bg: "bg-sky-500/5",
    iconBg: "bg-sky-500/15 text-sky-600",
    Icon: Info,
  },
  warning: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    iconBg: "bg-amber-500/15 text-amber-600",
    Icon: AlertTriangle,
  },
  success: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    iconBg: "bg-emerald-500/15 text-emerald-600",
    Icon: CheckCircle2,
  },
  tip: {
    border: "border-primary/30",
    bg: "bg-primary/5",
    iconBg: "bg-primary/15 text-primary",
    Icon: Lightbulb,
  },
} as const;

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          id={block.id}
          className="scroll-mt-32 text-2xl sm:text-3xl md:text-[2rem] font-extrabold tracking-[-0.02em] text-foreground mt-12 sm:mt-14 mb-4 sm:mb-5 leading-[1.2]"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-8 sm:mt-10 mb-3 leading-snug">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p className="text-base sm:text-[17px] leading-[1.75] text-foreground/85 mb-5">
          {renderInline(block.text)}
        </p>
      );
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag
          className={`mb-6 space-y-2.5 pl-1 ${
            block.ordered ? "list-decimal pl-5" : ""
          }`}
        >
          {block.items.map((item, i) => (
            <li
              key={i}
              className={`text-base sm:text-[17px] leading-[1.7] text-foreground/85 ${
                block.ordered ? "pl-1" : "flex gap-3"
              }`}
            >
              {!block.ordered && (
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              )}
              <span className={block.ordered ? "" : "flex-1 min-w-0"}>
                {renderInline(item)}
              </span>
            </li>
          ))}
        </Tag>
      );
    }
    case "quote":
      return (
        <blockquote className="my-8 border-l-4 border-primary pl-5 sm:pl-6 py-1">
          <p className="text-lg sm:text-xl italic font-medium text-foreground leading-snug">
            "{block.text}"
          </p>
          {block.author && (
            <footer className="mt-2 text-sm text-muted-foreground">
              — {block.author}
            </footer>
          )}
        </blockquote>
      );
    case "callout": {
      const style = calloutStyles[block.variant];
      const Icon = style.Icon;
      return (
        <aside
          className={`my-8 rounded-2xl border ${style.border} ${style.bg} p-5 sm:p-6 flex gap-4`}
        >
          <div
            className={`shrink-0 w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center`}
          >
            <Icon className="w-5 h-5" strokeWidth={2.25} />
          </div>
          <div className="min-w-0 flex-1">
            {block.title && (
              <div className="font-bold text-foreground mb-1.5 text-base sm:text-lg">
                {block.title}
              </div>
            )}
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
              {renderInline(block.text)}
            </p>
          </div>
        </aside>
      );
    }
    case "stats":
      return (
        <div className="my-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {block.items.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-secondary/40 p-4 sm:p-5 text-center"
            >
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary tracking-tight leading-none mb-1.5">
                {s.value}
              </div>
              <div className="text-[11px] sm:text-xs text-muted-foreground leading-snug">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      );
    case "divider":
      return <hr className="my-12 border-border" />;
  }
}

function buildToc(content: Block[]) {
  return content
    .filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2")
    .map((b) => ({ id: b.id, text: b.text }));
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-20 left-0 right-0 h-1 bg-transparent z-40 pointer-events-none">
      <div
        className="h-full bg-primary origin-left transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function Toc({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-130px 0px -65% 0px", threshold: 0 },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="text-sm">
      <div className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-3">
        On this page
      </div>
      <ul className="space-y-1.5 border-l border-border">
        {items.map((i) => {
          const isActive = active === i.id;
          return (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                className={`block pl-4 -ml-px border-l-2 py-1.5 text-sm leading-snug transition-colors ${
                  isActive
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {i.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function ShareBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1.5">
        <Share2 className="w-3.5 h-3.5" />
        Share
      </span>
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
        className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary/40 transition-colors"
      >
        <Twitter className="w-4 h-4" />
      </a>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary/40 transition-colors"
      >
        <Linkedin className="w-4 h-4" />
      </a>
      <button
        onClick={onCopy}
        aria-label="Copy link"
        className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary/40 transition-colors"
      >
        {copied ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        ) : (
          <LinkIcon className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

function RelatedCard({ post, index }: { post: Post; index: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden border bg-background hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
    >
      <div
        className={`relative aspect-[16/10] bg-gradient-to-br ${post.gradient} overflow-hidden`}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundImage: post.pattern }}
          aria-hidden
        />
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border backdrop-blur-sm bg-white/90 ${categoryColor[post.category]}`}
          >
            <TagIcon className="w-3 h-3" />
            {post.category.toUpperCase()}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 text-white/40 text-4xl font-black tabular-nums leading-none">
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-base sm:text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
          {post.title}
        </h3>
        <div className="mt-auto pt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {post.readTime}
        </div>
      </div>
    </Link>
  );
}

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug ?? "";
  const post = getPostBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  const toc = useMemo(() => (post ? buildToc(post.content) : []), [post]);
  const related = useMemo(() => (post ? getRelatedPosts(post.slug, 3) : []), [post]);

  if (!post) return <NotFound />;

  return (
    <SiteLayout>
      <ReadingProgress />

      <article className="pt-24">
        {/* Hero */}
        <header className="relative pt-12 pb-10 md:pt-16 md:pb-14 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          <div className="container mx-auto px-4 sm:px-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-7"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all articles
            </Link>

            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider border ${categoryColor[post.category]}`}
                >
                  <TagIcon className="w-3 h-3" />
                  {post.category.toUpperCase()}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider border border-border text-muted-foreground bg-background">
                  <Sparkles className="w-3 h-3" />
                  BLAZE INSIGHTS
                </span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[clamp(2rem,6.5vw,3.5rem)] font-extrabold tracking-[-0.02em] text-foreground leading-[1.1] text-balance break-words mb-5"
              >
                {post.title}
              </motion.h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-7 max-w-2xl">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-full ${post.authorColor} flex items-center justify-center text-xs font-bold`}
                  >
                    {post.authorInitials}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground leading-tight">
                      {post.author}
                    </div>
                    <div className="text-xs text-muted-foreground leading-tight">
                      {post.authorRole}
                    </div>
                  </div>
                </div>
                <span className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground/40" />
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Cover image (gradient) */}
        <div className="container mx-auto px-4 sm:px-6 mb-10 md:mb-14">
          <div
            className={`relative aspect-[16/7] sm:aspect-[16/6] rounded-3xl bg-gradient-to-br ${post.gradient} overflow-hidden border`}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundImage: post.pattern }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-15 mix-blend-overlay" />
            <div className="absolute bottom-6 right-6 text-white/40 text-6xl sm:text-7xl md:text-8xl font-black leading-none">
              {String(post.title.length % 9 + 1).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Body + ToC */}
        <div className="container mx-auto px-4 sm:px-6 pb-16 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* ToC sidebar */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-28">
                <Toc items={toc} />
              </div>
            </aside>

            {/* Body */}
            <div className="lg:col-span-9 max-w-3xl mx-auto lg:mx-0 w-full">
              <div className="article-body">
                {post.content.map((block, i) => (
                  <BlockRenderer key={i} block={block} />
                ))}
              </div>

              {/* Tags + share */}
              <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-secondary text-foreground/70 border border-border"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <ShareBar title={post.title} />
              </div>

              {/* Author card */}
              <div className="mt-10 rounded-2xl border bg-secondary/40 p-6 sm:p-7 flex flex-col sm:flex-row gap-5 sm:items-center">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl ${post.authorColor} flex items-center justify-center text-2xl font-extrabold`}
                >
                  {post.authorInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-1">
                    Written by
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-foreground">
                    {post.author}
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    {post.authorRole}
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                  >
                    Work with our team
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                Ready to put AI to work on your website?
              </h2>
              <p className="text-base sm:text-lg text-white/70 mb-8 leading-relaxed">
                Book a free 30-minute audit. We'll look at your site, your funnel, and tell you which two or three integrations would pay back fastest.
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
                <Link href="/blog">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-12 sm:h-14 px-7 sm:px-8 text-base font-bold bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
                  >
                    Read more articles
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="py-16 sm:py-20 bg-background">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-primary/20 text-primary font-semibold text-[11px] sm:text-xs tracking-widest uppercase mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Keep Reading
                  </span>
                  <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-extrabold tracking-[-0.02em] text-foreground leading-tight">
                    More from Blaze Insights
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                >
                  View all articles
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((p, i) => (
                  <RelatedCard key={p.slug} post={p} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </SiteLayout>
  );
}
