import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Brand {
  name: string;
  industry: string;
  symbol: string;
}

const BRANDS: Brand[] = [
  { name: "NovaTech", industry: "SaaS & Tech", symbol: "◈" },
  { name: "Konga Pro", industry: "E-Commerce", symbol: "◆" },
  { name: "LagosMart", industry: "Retail", symbol: "◉" },
  { name: "PrimeEdge", industry: "Consulting", symbol: "▲" },
  { name: "Zenith Realty", industry: "Real Estate", symbol: "⬡" },
  { name: "SwiftCourier", industry: "Logistics", symbol: "◎" },
  { name: "HealthBridge", industry: "Healthcare", symbol: "✦" },
  { name: "AgroLink", industry: "AgriTech", symbol: "◇" },
  { name: "EduSpark", industry: "EdTech", symbol: "◈" },
  { name: "VaultFinance", industry: "Fintech", symbol: "▪" },
  { name: "LuxeStudio", industry: "Fashion", symbol: "◆" },
  { name: "BuildRight", industry: "Construction", symbol: "▲" },
  { name: "SolarRise", industry: "Energy", symbol: "◉" },
  { name: "MediCore", industry: "Med-Tech", symbol: "✦" },
  { name: "EventHub", industry: "Events", symbol: "⬡" },
  { name: "CargoPilot", industry: "Freight", symbol: "◎" },
];

const COLORS = [
  "from-orange-500/5 to-orange-500/10 border-orange-500/15 hover:border-orange-500/30",
  "from-violet-500/5 to-violet-500/10 border-violet-500/15 hover:border-violet-500/30",
  "from-sky-500/5 to-sky-500/10 border-sky-500/15 hover:border-sky-500/30",
  "from-emerald-500/5 to-emerald-500/10 border-emerald-500/15 hover:border-emerald-500/30",
  "from-amber-500/5 to-amber-500/10 border-amber-500/15 hover:border-amber-500/30",
  "from-rose-500/5 to-rose-500/10 border-rose-500/15 hover:border-rose-500/30",
  "from-teal-500/5 to-teal-500/10 border-teal-500/15 hover:border-teal-500/30",
  "from-indigo-500/5 to-indigo-500/10 border-indigo-500/15 hover:border-indigo-500/30",
];

const SYMBOL_COLORS = [
  "text-orange-400", "text-violet-400", "text-sky-400", "text-emerald-400",
  "text-amber-400", "text-rose-400", "text-teal-400", "text-indigo-400",
];

function BrandCard({ brand, index }: { brand: Brand; index: number }) {
  const color = COLORS[index % COLORS.length];
  const symColor = SYMBOL_COLORS[index % SYMBOL_COLORS.length];

  return (
    <div
      className={`
        group flex-shrink-0 flex items-center gap-3 px-6 py-4 mx-3
        rounded-xl border bg-gradient-to-br ${color}
        backdrop-blur-sm transition-all duration-300 cursor-default
        hover:scale-105 hover:shadow-lg
      `}
    >
      <span className={`text-lg font-bold ${symColor} opacity-70 group-hover:opacity-100 transition-opacity`}>
        {brand.symbol}
      </span>
      <div>
        <p className="text-sm font-bold text-foreground/80 group-hover:text-foreground whitespace-nowrap transition-colors leading-none mb-0.5">
          {brand.name}
        </p>
        <p className="text-[10px] font-medium text-muted-foreground/60 whitespace-nowrap tracking-wide uppercase">
          {brand.industry}
        </p>
      </div>
    </div>
  );
}

function MarqueeRow({ brands, reverse = false }: { brands: Brand[]; reverse?: boolean }) {
  const doubled = [...brands, ...brands];

  return (
    <div className="relative flex overflow-hidden w-full">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      <motion.div
        className="flex items-center"
        animate={{ x: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 28,
            ease: "linear",
          },
        }}
      >
        {doubled.map((brand, i) => (
          <BrandCard key={`${brand.name}-${i}`} brand={brand} index={i % brands.length} />
        ))}
      </motion.div>
    </div>
  );
}

export default function Brands() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const row1 = BRANDS.slice(0, 8);
  const row2 = BRANDS.slice(8);

  return (
    <section className="py-20 bg-background overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4 md:px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground font-semibold text-xs tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Trusted by Businesses Across Nigeria
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Brands That Choose <span className="text-primary">Blaze Studio</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-base max-w-md mx-auto">
            From startups to established names — we've helped businesses across every industry grow online.
          </p>
        </motion.div>
      </div>

      {/* Marquee rows */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="space-y-4"
      >
        <MarqueeRow brands={row1} reverse={false} />
        <MarqueeRow brands={row2} reverse={true} />
      </motion.div>

      {/* Bottom CTA nudge */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-14 text-center"
      >
        <p className="text-sm text-muted-foreground">
          Ready to add your brand to this list?{" "}
          <button
            onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
            className="text-primary font-semibold hover:underline underline-offset-4 transition-all"
          >
            Get your free audit →
          </button>
        </p>
      </motion.div>
    </section>
  );
}
