import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  Clock,
  Calendar,
  TrendingUp,
  Sparkles,
  Mail,
  Tag as TagIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SiteLayout from "@/components/layout/site-layout";

type Category =
  | "All"
  | "Web Design"
  | "SEO"
  | "Marketing"
  | "AI"
  | "Case Study";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: Exclude<Category, "All">;
  author: string;
  authorInitials: string;
  authorColor: string;
  date: string;
  readTime: string;
  gradient: string;
  pattern: string;
  featured?: boolean;
}

const POSTS: Post[] = [
  {
    slug: "website-converts-2026",
    title: "Why your website isn't converting in 2026 (and the 7 fixes that work)",
    excerpt:
      "Most business sites quietly leak 60% of their leads to slow load times, weak CTAs, and trust gaps. Here's the audit framework we run on every new client.",
    category: "Web Design",
    author: "Adaeze O.",
    authorInitials: "AO",
    authorColor: "bg-primary/15 text-primary",
    date: "Apr 22, 2026",
    readTime: "8 min read",
    gradient: "from-orange-500 via-rose-500 to-fuchsia-600",
    pattern: "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.25) 0, transparent 50%)",
    featured: true,
  },
  {
    slug: "seo-nigeria-rank",
    title: "How a Lagos law firm went from page 9 to page 1 in 90 days",
    excerpt:
      "A practical breakdown of the on-page, technical, and link work that moved the needle — with screenshots and a realistic timeline.",
    category: "Case Study",
    author: "Zara M.",
    authorInitials: "ZM",
    authorColor: "bg-purple-500/15 text-purple-600",
    date: "Apr 14, 2026",
    readTime: "11 min read",
    gradient: "from-violet-500 via-purple-600 to-indigo-700",
    pattern: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.18) 0, transparent 55%)",
  },
  {
    slug: "ai-customer-support",
    title: "Plugging an AI assistant into your customer support: the honest playbook",
    excerpt:
      "Where AI actually helps, where it backfires, and the four-step rollout we use so customers feel served — not stonewalled.",
    category: "AI",
    author: "Ifeanyi K.",
    authorInitials: "IK",
    authorColor: "bg-emerald-500/15 text-emerald-600",
    date: "Apr 06, 2026",
    readTime: "9 min read",
    gradient: "from-emerald-500 via-teal-500 to-sky-600",
    pattern: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.2) 0, transparent 50%)",
  },
  {
    slug: "google-ads-roas",
    title: "The Google Ads structure that finally made our client's ROAS predictable",
    excerpt:
      "After two account rebuilds and a lot of wasted budget, here's the campaign + audience setup that got us a steady 6.2x return.",
    category: "Marketing",
    author: "Zara M.",
    authorInitials: "ZM",
    authorColor: "bg-purple-500/15 text-purple-600",
    date: "Mar 28, 2026",
    readTime: "7 min read",
    gradient: "from-amber-500 via-orange-600 to-red-600",
    pattern: "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.22) 0, transparent 55%)",
  },
  {
    slug: "headless-cms-tradeoffs",
    title: "Headless CMS vs. WordPress in 2026: an honest tradeoff guide",
    excerpt:
      "When the extra complexity of a headless setup actually pays off — and when WordPress is still the smarter call for your team.",
    category: "Web Design",
    author: "Tunde A.",
    authorInitials: "TA",
    authorColor: "bg-blue-500/15 text-blue-600",
    date: "Mar 19, 2026",
    readTime: "10 min read",
    gradient: "from-sky-500 via-blue-600 to-indigo-700",
    pattern: "radial-gradient(circle at 80% 60%, rgba(255,255,255,0.2) 0, transparent 50%)",
  },
  {
    slug: "core-web-vitals",
    title: "Fixing Core Web Vitals without rebuilding your whole site",
    excerpt:
      "The five highest-leverage changes you can ship in a week to push LCP, INP, and CLS into the green — measured, not guessed.",
    category: "SEO",
    author: "Ifeanyi K.",
    authorInitials: "IK",
    authorColor: "bg-emerald-500/15 text-emerald-600",
    date: "Mar 11, 2026",
    readTime: "6 min read",
    gradient: "from-lime-500 via-emerald-600 to-teal-700",
    pattern: "radial-gradient(circle at 40% 70%, rgba(255,255,255,0.22) 0, transparent 55%)",
  },
  {
    slug: "saas-rebrand",
    title: "How a 40-page rebrand led to a 3x demo-request lift for a Nigerian SaaS",
    excerpt:
      "Brand, copy, and conversion architecture working together. A walkthrough of the design decisions and the numbers that followed.",
    category: "Case Study",
    author: "Tunde A.",
    authorInitials: "TA",
    authorColor: "bg-blue-500/15 text-blue-600",
    date: "Feb 28, 2026",
    readTime: "12 min read",
    gradient: "from-pink-500 via-rose-600 to-red-600",
    pattern: "radial-gradient(circle at 60% 40%, rgba(255,255,255,0.2) 0, transparent 55%)",
  },
];

const CATEGORIES: Category[] = [
  "All",
  "Web Design",
  "SEO",
  "Marketing",
  "AI",
  "Case Study",
];

const categoryColor: Record<Exclude<Category, "All">, string> = {
  "Web Design": "bg-sky-500/10 text-sky-700 border-sky-500/20",
  SEO: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  Marketing: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  AI: "bg-violet-500/10 text-violet-700 border-violet-500/20",
  "Case Study": "bg-rose-500/10 text-rose-700 border-rose-500/20",
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const featured = POSTS.find((p) => p.featured)!;
  const otherPosts = POSTS.filter((p) => !p.featured);

  const visiblePosts = useMemo(() => {
    return otherPosts.filter((p) => {
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query, otherPosts]);

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
        <section className="relative pt-16 pb-14 md:pt-20 md:pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/12 via-background to-background -z-10" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.025] -z-10" />

          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-primary/20 text-primary font-semibold text-xs tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                BLAZE INSIGHTS
              </div>
              <h1 className="text-[clamp(2.25rem,8vw,4.5rem)] lg:text-7xl font-extrabold tracking-[-0.02em] text-foreground leading-[1.05] mb-5 text-balance break-words">
                Notes from the <span className="text-primary">build floor.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Real playbooks, case studies and honest opinions from the team that designs,
                ships and ranks websites for a living.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured */}
        <section className="pb-20">
          <div className="container mx-auto px-4 md:px-6">
            <motion.a
              href={`#${featured.slug}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group block rounded-3xl overflow-hidden border bg-background shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Visual */}
                <div
                  className={`relative aspect-[4/3] lg:aspect-auto bg-gradient-to-br ${featured.gradient} overflow-hidden`}
                >
                  <div
                    className="absolute inset-0"
                    style={{ backgroundImage: featured.pattern }}
                    aria-hidden
                  />
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />

                  <div className="absolute top-6 left-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-foreground text-xs font-bold tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" />
                    FEATURED
                  </div>

                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <div className="text-7xl md:text-8xl font-black opacity-20 leading-none mb-2">
                      01
                    </div>
                    <div className="text-xs font-bold tracking-widest opacity-80">
                      {featured.category.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-5">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {featured.date}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {featured.readTime}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight mb-4 group-hover:text-primary transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
                    {featured.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${featured.authorColor} flex items-center justify-center text-sm font-bold`}
                      >
                        {featured.authorInitials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          {featured.author}
                        </div>
                        <div className="text-xs text-muted-foreground">Author</div>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
                      Read article
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.a>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-y bg-secondary/30 sticky top-20 z-30 backdrop-blur-md bg-secondary/60">
          <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 pb-1 md:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    activeCategory === cat
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground/70 border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                className="pl-9 h-10 bg-background border-border"
              />
            </div>
          </div>
        </section>

        {/* Article grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <AnimatePresence mode="popLayout">
              {visiblePosts.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-24"
                >
                  <div className="inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-secondary mb-4">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No articles found</h3>
                  <p className="text-muted-foreground">
                    Try a different keyword or category.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
                >
                  {visiblePosts.map((post, i) => (
                    <motion.a
                      key={post.slug}
                      href={`#${post.slug}`}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.2) }}
                      className="group flex flex-col rounded-2xl overflow-hidden border bg-background hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
                    >
                      {/* Visual */}
                      <div
                        className={`relative aspect-[16/10] bg-gradient-to-br ${post.gradient} overflow-hidden`}
                      >
                        <div
                          className="absolute inset-0"
                          style={{ backgroundImage: post.pattern }}
                          aria-hidden
                        />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-15 mix-blend-overlay" />

                        <div className="absolute top-4 left-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border backdrop-blur-sm bg-white/90 ${
                              categoryColor[post.category]
                            }`}
                          >
                            <TagIcon className="w-3 h-3" />
                            {post.category.toUpperCase()}
                          </span>
                        </div>

                        <div className="absolute bottom-4 right-4 text-white/30 text-5xl font-black tabular-nums leading-none">
                          {String(i + 2).padStart(2, "0")}
                        </div>
                      </div>

                      {/* Body */}
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

                        <div className="mt-auto pt-4 border-t flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-full ${post.authorColor} flex items-center justify-center text-xs font-bold`}
                            >
                              {post.authorInitials}
                            </div>
                            <span className="text-xs font-semibold text-foreground/80">
                              {post.author}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 bg-foreground text-background relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary rounded-full blur-[140px] opacity-25 pointer-events-none" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-primary/15 border border-primary/30 mb-6">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                One sharp email, every Thursday.
              </h2>
              <p className="text-lg text-white/70 mb-8">
                Real takeaways from the websites and campaigns we ship — no fluff, no
                cross-promo, easy to unsubscribe.
              </p>

              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourcompany.com"
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-primary"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 px-6 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 group whitespace-nowrap"
                >
                  Subscribe
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>

              <AnimatePresence>
                {subscribed && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="mt-4 text-sm text-emerald-400 font-medium"
                  >
                    You're in. Check your inbox to confirm.
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="mt-6 text-xs text-white/40">
                Joining 2,400+ founders & marketers. No spam, ever.
              </p>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
