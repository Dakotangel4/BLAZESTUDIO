import { useMemo, useState } from "react";
import { Link } from "wouter";
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
  Users,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SiteLayout from "@/components/layout/site-layout";
import { POSTS, CATEGORIES, categoryColor, type Category } from "@/lib/posts";

type Filter = "All" | Category;

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<Filter>("All");
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
        p.author.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
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
        <section className="relative pt-10 pb-10 sm:pt-14 sm:pb-12 md:pt-16 md:pb-14 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/12 via-background to-background -z-10" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.025] -z-10" />

          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              {/* Editorial kicker */}
              <div className="flex flex-wrap items-center gap-2.5 mb-5 sm:mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground text-background font-bold text-[10px] sm:text-[11px] tracking-[0.2em] uppercase">
                  <Sparkles className="w-3 h-3" />
                  Blaze Insights
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  <span className="w-6 h-px bg-border" />
                  Edition 04 · Apr 2026
                </span>
              </div>

              <h1 className="text-[clamp(2.25rem,8vw,4.5rem)] font-extrabold tracking-[-0.025em] text-foreground leading-[1.04] mb-4 sm:mb-5 text-balance break-words">
                AI-integrated websites,{" "}
                <span className="text-primary">decoded for business owners.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Practical playbooks, real numbers and honest case studies on putting
                AI to work inside your website — written by the team that ships it
                for a living.
              </p>

              {/* Meta strip */}
              <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 pt-5 border-t border-border/70">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="font-bold text-foreground tabular-nums">
                    {POSTS.length}
                  </span>
                  <span className="text-muted-foreground">articles</span>
                </div>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-muted-foreground/40" />
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-bold text-foreground tabular-nums">
                    {new Set(POSTS.map((p) => p.author)).size}
                  </span>
                  <span className="text-muted-foreground">expert contributors</span>
                </div>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-muted-foreground/40" />
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-muted-foreground">
                    Updated <span className="font-semibold text-foreground">weekly</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured */}
        <section className="pb-16 sm:pb-20">
          <div className="container mx-auto px-4 sm:px-6">
            <Link href={`/blog/${featured.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="group block rounded-3xl overflow-hidden border bg-background shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
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

                    <div className="absolute top-5 sm:top-6 left-5 sm:left-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-foreground text-[11px] sm:text-xs font-bold tracking-wider">
                      <TrendingUp className="w-3.5 h-3.5 text-primary" />
                      FEATURED
                    </div>

                    <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 text-white">
                      <div className="text-6xl sm:text-7xl md:text-8xl font-black opacity-20 leading-none mb-2">
                        01
                      </div>
                      <div className="text-[10px] sm:text-xs font-bold tracking-widest opacity-80">
                        {featured.category.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4 sm:mb-5">
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

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[-0.02em] text-foreground leading-[1.15] mb-3 sm:mb-4 text-balance group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed mb-7 sm:mb-8">
                      {featured.excerpt}
                    </p>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 shrink-0 rounded-full ${featured.authorColor} flex items-center justify-center text-sm font-bold`}
                        >
                          {featured.authorInitials}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-foreground truncate">
                            {featured.author}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {featured.authorRole}
                          </div>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all shrink-0">
                        <span className="hidden sm:inline">Read article</span>
                        <span className="sm:hidden">Read</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 sm:py-8 border-y bg-secondary/30 sticky top-20 z-30 backdrop-blur-md bg-secondary/60">
          <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-5">
            <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 pb-1 md:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border transition-all ${
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
        <section className="py-14 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimatePresence mode="popLayout">
              {visiblePosts.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20 sm:py-24"
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
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
                >
                  {visiblePosts.map((post, i) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`}>
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{
                          duration: 0.35,
                          delay: Math.min(i * 0.04, 0.2),
                        }}
                        className="group h-full flex flex-col rounded-2xl overflow-hidden border bg-background hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
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
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 sm:py-20 bg-foreground text-background relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[400px] bg-primary rounded-full blur-[120px] sm:blur-[140px] opacity-25 pointer-events-none" />
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex w-12 h-12 sm:w-14 sm:h-14 items-center justify-center rounded-2xl bg-primary/15 border border-primary/30 mb-5 sm:mb-6">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h2 className="text-[clamp(1.875rem,5.5vw,3rem)] font-extrabold tracking-[-0.02em] mb-3 sm:mb-4 leading-[1.15] text-balance">
                One sharp email, every Thursday.
              </h2>
              <p className="text-base sm:text-lg text-white/70 mb-7 sm:mb-8 leading-relaxed">
                Real takeaways from the websites and AI integrations we ship — no
                fluff, no cross-promo, easy to unsubscribe.
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

              <p className="mt-5 sm:mt-6 text-xs text-white/40">
                Joining 2,400+ founders & marketers. No spam, ever.
              </p>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
