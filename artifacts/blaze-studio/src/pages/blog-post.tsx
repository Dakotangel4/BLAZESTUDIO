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
  ChevronRight,
  BookmarkPlus,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/layout/site-layout";
import NotFound from "@/pages/not-found";
import {
  POSTS,
  getPostBySlug,
  getRelatedPosts,
  categoryColor,
  type Block,
  type Post,
} from "@/lib/posts";

function renderInline(text: string) {
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

function BlockRenderer({
  block,
  isFirstParagraph,
  h2Index,
}: {
  block: Block;
  isFirstParagraph?: boolean;
  h2Index?: number;
}) {
  switch (block.type) {
    case "h2":
      return (
        <div className="mt-14 sm:mt-16 mb-5 sm:mb-6">
          {typeof h2Index === "number" && (
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-primary tabular-nums">
                {String(h2Index + 1).padStart(2, "0")}
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
            </div>
          )}
          <h2
            id={block.id}
            className="scroll-mt-32 text-[1.625rem] sm:text-3xl md:text-[2.125rem] font-extrabold tracking-[-0.02em] text-foreground leading-[1.18]"
          >
            {block.text}
          </h2>
        </div>
      );
    case "h3":
      return (
        <h3 className="text-xl sm:text-[1.375rem] font-bold tracking-tight text-foreground mt-9 sm:mt-10 mb-3 leading-snug">
          {block.text}
        </h3>
      );
    case "p":
      if (isFirstParagraph) {
        return (
          <p className="text-base sm:text-[17px] leading-[1.78] text-foreground/85 mb-6 first-letter:float-left first-letter:font-serif first-letter:text-[4.25rem] sm:first-letter:text-[5rem] first-letter:leading-[0.85] first-letter:pr-3 first-letter:pt-2 first-letter:font-extrabold first-letter:text-primary">
            {renderInline(block.text)}
          </p>
        );
      }
      return (
        <p className="text-base sm:text-[17px] leading-[1.78] text-foreground/85 mb-5">
          {renderInline(block.text)}
        </p>
      );
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag
          className={`mb-7 space-y-2.5 ${
            block.ordered ? "list-decimal pl-6 marker:text-primary marker:font-bold" : "pl-1"
          }`}
        >
          {block.items.map((item, i) => (
            <li
              key={i}
              className={`text-base sm:text-[17px] leading-[1.7] text-foreground/85 ${
                block.ordered ? "pl-2" : "flex gap-3"
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
        <blockquote className="my-9 relative pl-6 sm:pl-8">
          <span
            aria-hidden
            className="absolute left-0 top-0 text-6xl sm:text-7xl font-serif text-primary/30 leading-none -translate-y-2"
          >
            “
          </span>
          <p className="text-lg sm:text-xl italic font-medium text-foreground leading-[1.55]">
            {block.text}
          </p>
          {block.author && (
            <footer className="mt-3 text-sm text-muted-foreground">
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
              <div className="font-bold text-foreground mb-1.5 text-base sm:text-lg leading-snug">
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
        <div className="my-9 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {block.items.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-gradient-to-b from-secondary/60 to-secondary/20 p-4 sm:p-5 text-center hover:border-primary/30 transition-colors"
            >
              <div className="text-xl sm:text-2xl md:text-[1.75rem] font-extrabold text-primary tracking-[-0.02em] leading-none mb-1.5">
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
      return (
        <div className="my-12 flex items-center justify-center gap-2" aria-hidden>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
        </div>
      );
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
    <div className="fixed top-20 left-0 right-0 h-[3px] bg-transparent z-40 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-primary to-primary/70 origin-left transition-[width] duration-150 shadow-[0_0_8px_rgba(234,88,12,0.5)]"
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
      <div className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-4 flex items-center gap-2">
        <ListChecks className="w-3.5 h-3.5" />
        On this page
      </div>
      <ul className="space-y-0.5 border-l border-border">
        {items.map((i, idx) => {
          const isActive = active === i.id;
          return (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                className={`flex items-start gap-3 pl-4 -ml-px border-l-2 py-2 text-sm leading-snug transition-all ${
                  isActive
                    ? "border-primary text-foreground font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <span
                  className={`text-[10px] font-bold tracking-wider tabular-nums mt-0.5 ${
                    isActive ? "text-primary" : "text-muted-foreground/60"
                  }`}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 min-w-0">{i.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function ShareBar({ title, vertical = false }: { title: string; vertical?: boolean }) {
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
  const wrap = vertical
    ? "flex flex-col items-center gap-2"
    : "flex items-center gap-2";
  const labelWrap = vertical
    ? "text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-1 flex flex-col items-center gap-1.5"
    : "text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1.5";
  return (
    <div className={wrap}>
      <span className={labelWrap}>
        <Share2 className="w-3.5 h-3.5" />
        Share
      </span>
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
        className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
      >
        <Twitter className="w-4 h-4" />
      </a>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
      >
        <Linkedin className="w-4 h-4" />
      </a>
      <button
        onClick={onCopy}
        aria-label="Copy link"
        className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
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

function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <aside className="not-prose mb-10 sm:mb-12 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] via-primary/[0.02] to-transparent p-6 sm:p-7">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
          <Sparkles className="w-4.5 h-4.5" strokeWidth={2.25} />
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-[0.22em] text-primary uppercase">
            TL;DR
          </div>
          <div className="text-base sm:text-lg font-bold text-foreground leading-tight">
            Key takeaways
          </div>
        </div>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-sm sm:text-[15px] text-foreground/85 leading-relaxed">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" strokeWidth={2.5} />
            <span className="flex-1 min-w-0">{item}</span>
          </li>
        ))}
      </ul>
    </aside>
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
        <div className="absolute inset-0" style={{ backgroundImage: post.pattern }} aria-hidden />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-15 mix-blend-overlay" />
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border backdrop-blur-sm bg-white/90 ${categoryColor[post.category]}`}
          >
            <TagIcon className="w-3 h-3" />
            {post.category.toUpperCase()}
          </span>
        </div>
        <div className="absolute bottom-3 right-4 text-white/40 text-4xl font-black tabular-nums leading-none">
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
  const articleNumber = useMemo(
    () => (post ? POSTS.findIndex((p) => p.slug === post.slug) + 1 : 0),
    [post],
  );

  // Pre-compute h2 numbering & first paragraph index for body rendering
  const renderMeta = useMemo(() => {
    if (!post) return { h2Indices: new Map<number, number>(), firstParaIndex: -1 };
    const h2Indices = new Map<number, number>();
    let h2Counter = 0;
    let firstParaIndex = -1;
    post.content.forEach((b, i) => {
      if (b.type === "h2") {
        h2Indices.set(i, h2Counter);
        h2Counter += 1;
      }
      if (b.type === "p" && firstParaIndex === -1) firstParaIndex = i;
    });
    return { h2Indices, firstParaIndex };
  }, [post]);

  if (!post) return <NotFound />;

  return (
    <SiteLayout>
      <ReadingProgress />

      <article className="pt-24">
        {/* Hero */}
        <header className="relative pt-10 pb-10 md:pt-14 md:pb-12 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          <div className="absolute inset-0 -z-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.025]" />
          <div className="container mx-auto px-4 sm:px-6">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-7"
            >
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              <Link href="/blog" className="hover:text-primary transition-colors">
                Blog
              </Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              <span className="text-foreground font-medium truncate">
                {post.category}
              </span>
            </nav>

            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-5 sm:mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-[0.18em] border bg-foreground text-background uppercase">
                  ARTICLE Nº {String(articleNumber).padStart(2, "0")}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-[0.18em] border uppercase ${categoryColor[post.category]}`}
                >
                  <TagIcon className="w-3 h-3" />
                  {post.category}
                </span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[clamp(2rem,6.5vw,3.5rem)] font-extrabold tracking-[-0.025em] text-foreground leading-[1.08] text-balance break-words mb-5 sm:mb-6"
              >
                {post.title}
              </motion.h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-7 sm:mb-8 max-w-2xl">
                {post.excerpt}
              </p>

              {/* Meta strip */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pb-1">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${post.authorColor} flex items-center justify-center text-sm font-bold ring-2 ring-background shadow-sm`}
                  >
                    {post.authorInitials}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground leading-tight text-sm sm:text-[15px]">
                      {post.author}
                    </div>
                    <div className="text-xs text-muted-foreground leading-tight">
                      {post.authorRole}
                    </div>
                  </div>
                </div>
                <span className="hidden sm:block w-px h-8 bg-border" />
                <div className="flex items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Editorial cover */}
        <div className="container mx-auto px-4 sm:px-6 mb-12 md:mb-16">
          <div
            className={`relative aspect-[16/8] sm:aspect-[16/6.5] md:aspect-[16/5.5] rounded-3xl bg-gradient-to-br ${post.gradient} overflow-hidden ring-1 ring-black/5 shadow-2xl`}
          >
            <div className="absolute inset-0" style={{ backgroundImage: post.pattern }} aria-hidden />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            {/* SVG grid pattern */}
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.18] mix-blend-overlay"
              aria-hidden
            >
              <defs>
                <pattern
                  id={`grid-${post.slug}`}
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#grid-${post.slug})`} />
            </svg>

            {/* Floating decorative blobs */}
            <div className="absolute top-1/4 -right-12 w-40 h-40 sm:w-56 sm:h-56 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-1/4 w-32 h-32 sm:w-44 sm:h-44 bg-white/5 rounded-full blur-3xl" />

            {/* Top-left issue tag */}
            <div className="absolute top-5 sm:top-6 left-5 sm:left-7 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-foreground text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase">
              <Sparkles className="w-3 h-3 text-primary" />
              Blaze Insights
            </div>

            {/* Editorial typography */}
            <div className="absolute bottom-5 sm:bottom-7 left-5 sm:left-7 right-5 sm:right-7 text-white">
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs font-bold tracking-[0.25em] opacity-80 mb-1.5 uppercase">
                    {post.category}
                  </div>
                  <div className="text-xs sm:text-sm font-medium opacity-90 leading-tight max-w-md line-clamp-2">
                    {post.tags.slice(0, 3).map((t) => `#${t}`).join("  ·  ")}
                  </div>
                </div>
                <div className="text-[5rem] sm:text-[7rem] md:text-[9rem] font-black opacity-25 leading-[0.85] tabular-nums tracking-[-0.04em] shrink-0">
                  {String(articleNumber).padStart(2, "0")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body + ToC */}
        <div className="container mx-auto px-4 sm:px-6 pb-16 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-14">
            {/* ToC sidebar */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-28 space-y-8">
                <Toc items={toc} />
                <div className="pt-6 border-t border-border">
                  <ShareBar title={post.title} vertical />
                </div>
              </div>
            </aside>

            {/* Body */}
            <div className="lg:col-span-9 max-w-3xl mx-auto lg:mx-0 w-full">
              {/* Key takeaways */}
              <KeyTakeaways items={post.keyTakeaways} />

              <div className="article-body">
                {post.content.map((block, i) => (
                  <BlockRenderer
                    key={i}
                    block={block}
                    isFirstParagraph={i === renderMeta.firstParaIndex}
                    h2Index={renderMeta.h2Indices.get(i)}
                  />
                ))}
              </div>

              {/* Tags + share */}
              <div className="mt-14 pt-8 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-secondary text-foreground/70 border border-border hover:border-primary/30 hover:text-primary transition-colors cursor-default"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <div className="lg:hidden">
                  <ShareBar title={post.title} />
                </div>
              </div>

              {/* Author card */}
              <div className="mt-10 rounded-3xl border bg-gradient-to-br from-secondary/60 to-secondary/20 p-6 sm:p-8 md:p-9 flex flex-col sm:flex-row gap-5 sm:gap-7 sm:items-center">
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl ${post.authorColor} flex items-center justify-center text-2xl sm:text-3xl font-extrabold ring-4 ring-background shadow-lg`}
                >
                  {post.authorInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase mb-1">
                    Written by
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                    {post.author}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {post.authorRole}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link href="/contact">
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group"
                      >
                        Work with our team
                        <ArrowRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </Link>
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                    >
                      <BookmarkPlus className="w-4 h-4" />
                      More articles
                    </Link>
                  </div>
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

        {/* Bottom: Back link */}
        <div className="bg-secondary/30 border-t py-10">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all articles
            </Link>
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
