import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNav } from "@/hooks/use-nav";

export default function Hero() {
  const navigate = useNav();

  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-28 lg:pt-44 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_85%_10%,_var(--tw-gradient-stops))] from-primary/12 via-background to-background -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_10%_100%,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent -z-10" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.025] -z-10" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 min-w-0"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-primary/20 text-primary font-semibold text-[11px] sm:text-xs tracking-wider mb-5 sm:mb-6"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              HIGH-CONVERTING WEBSITES
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="text-[clamp(2.25rem,8vw,4.5rem)] lg:text-7xl font-extrabold tracking-[-0.02em] text-foreground leading-[1.05] mb-5 sm:mb-6 text-balance break-words hyphens-auto"
            >
              Your Website Should Be Your Best{" "}
              <span className="text-primary inline-block">Salesperson.</span>
              <br className="hidden sm:block" />
              <span className="block sm:inline"> Is It?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground mb-7 sm:mb-8 leading-relaxed max-w-xl"
            >
              We build high-converting business websites, rank you on Google, run digital
              campaigns that actually sell, and weave AI into your operations — all under one roof.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Button
                size="lg"
                className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-[1.03] active:scale-95 group"
                onClick={() => navigate("/contact", "contact-form")}
              >
                Get a Free Audit
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold border-2 hover:bg-secondary transition-all"
                onClick={() => navigate("/portfolio")}
              >
                See Our Work
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-8 sm:mt-10 flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-muted-foreground"
            >
              <div className="flex -space-x-2.5 sm:-space-x-3 shrink-0">
                <img
                  src="/src/assets/test-1.png"
                  alt="Client"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-background object-cover"
                />
                <img
                  src="/src/assets/test-2.png"
                  alt="Client"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-background object-cover"
                />
                <img
                  src="/src/assets/test-3.png"
                  alt="Client"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-background object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                  <span className="ml-1 text-foreground font-semibold">4.9</span>
                </div>
                <p className="leading-tight">Trusted by 50+ businesses in Lagos</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: -1.5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, duration: 0.8, type: "spring", stiffness: 70 }}
            className="lg:col-span-6 relative w-full aspect-[4/5] sm:aspect-[5/4] lg:aspect-auto lg:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-primary/15 border border-white/30"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-10" />
            <img
              src="/src/assets/hero-team.png"
              alt="Creative team collaborating"
              className="w-full h-full object-cover object-center"
            />

            {/* Floating stats card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl z-20 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                    Average Growth
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    in first 90 days
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl sm:text-2xl font-extrabold text-primary tabular-nums">
                  +180%
                </p>
              </div>
            </motion.div>

            {/* Floating tag — desktop only */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="hidden md:flex absolute top-6 right-6 z-20 items-center gap-2 px-3 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-lg text-xs font-bold text-foreground"
            >
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Live projects shipping
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
