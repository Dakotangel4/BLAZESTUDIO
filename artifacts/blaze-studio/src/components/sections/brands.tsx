import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Cpu, ShoppingBag, Store, BarChart3, Building2, Truck,
  Heart, Leaf, BookOpen, Wallet, Sparkles, Hammer,
  Sun, Activity, CalendarDays, Package,
} from "lucide-react";
import { useNav } from "@/hooks/use-nav";

interface Brand {
  name: string;
  industry: string;
  Icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  borderColor: string;
  hoverBorder: string;
  nameSuffix?: string;
}

const BRANDS: Brand[] = [
  {
    name: "Nova", nameSuffix: "Tech",
    industry: "SaaS & Technology",
    Icon: Cpu,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
    borderColor: "border-violet-500/15",
    hoverBorder: "hover:border-violet-400/40",
  },
  {
    name: "Konga", nameSuffix: " Pro",
    industry: "E-Commerce",
    Icon: ShoppingBag,
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/10",
    borderColor: "border-orange-500/15",
    hoverBorder: "hover:border-orange-400/40",
  },
  {
    name: "Lagos", nameSuffix: "Mart",
    industry: "Retail",
    Icon: Store,
    iconColor: "text-sky-400",
    iconBg: "bg-sky-500/10",
    borderColor: "border-sky-500/15",
    hoverBorder: "hover:border-sky-400/40",
  },
  {
    name: "Prime", nameSuffix: "Edge",
    industry: "Consulting",
    Icon: BarChart3,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    borderColor: "border-emerald-500/15",
    hoverBorder: "hover:border-emerald-400/40",
  },
  {
    name: "Zenith", nameSuffix: " Realty",
    industry: "Real Estate",
    Icon: Building2,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    borderColor: "border-amber-500/15",
    hoverBorder: "hover:border-amber-400/40",
  },
  {
    name: "Swift", nameSuffix: "Courier",
    industry: "Logistics",
    Icon: Truck,
    iconColor: "text-rose-400",
    iconBg: "bg-rose-500/10",
    borderColor: "border-rose-500/15",
    hoverBorder: "hover:border-rose-400/40",
  },
  {
    name: "Health", nameSuffix: "Bridge",
    industry: "Healthcare",
    Icon: Heart,
    iconColor: "text-pink-400",
    iconBg: "bg-pink-500/10",
    borderColor: "border-pink-500/15",
    hoverBorder: "hover:border-pink-400/40",
  },
  {
    name: "Agro", nameSuffix: "Link",
    industry: "AgriTech",
    Icon: Leaf,
    iconColor: "text-green-400",
    iconBg: "bg-green-500/10",
    borderColor: "border-green-500/15",
    hoverBorder: "hover:border-green-400/40",
  },
  {
    name: "Edu", nameSuffix: "Spark",
    industry: "Education Tech",
    Icon: BookOpen,
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/10",
    borderColor: "border-indigo-500/15",
    hoverBorder: "hover:border-indigo-400/40",
  },
  {
    name: "Vault", nameSuffix: "Finance",
    industry: "Fintech",
    Icon: Wallet,
    iconColor: "text-teal-400",
    iconBg: "bg-teal-500/10",
    borderColor: "border-teal-500/15",
    hoverBorder: "hover:border-teal-400/40",
  },
  {
    name: "Luxe", nameSuffix: "Studio",
    industry: "Fashion & Lifestyle",
    Icon: Sparkles,
    iconColor: "text-fuchsia-400",
    iconBg: "bg-fuchsia-500/10",
    borderColor: "border-fuchsia-500/15",
    hoverBorder: "hover:border-fuchsia-400/40",
  },
  {
    name: "Build", nameSuffix: "Right",
    industry: "Construction",
    Icon: Hammer,
    iconColor: "text-yellow-400",
    iconBg: "bg-yellow-500/10",
    borderColor: "border-yellow-500/15",
    hoverBorder: "hover:border-yellow-400/40",
  },
  {
    name: "Solar", nameSuffix: "Rise",
    industry: "Clean Energy",
    Icon: Sun,
    iconColor: "text-orange-300",
    iconBg: "bg-orange-400/10",
    borderColor: "border-orange-400/15",
    hoverBorder: "hover:border-orange-300/40",
  },
  {
    name: "Medi", nameSuffix: "Core",
    industry: "Medical Tech",
    Icon: Activity,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10",
    borderColor: "border-red-500/15",
    hoverBorder: "hover:border-red-400/40",
  },
  {
    name: "Event", nameSuffix: "Hub",
    industry: "Events & Experiences",
    Icon: CalendarDays,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    borderColor: "border-cyan-500/15",
    hoverBorder: "hover:border-cyan-400/40",
  },
  {
    name: "Cargo", nameSuffix: "Pilot",
    industry: "Freight & Shipping",
    Icon: Package,
    iconColor: "text-lime-400",
    iconBg: "bg-lime-500/10",
    borderColor: "border-lime-500/15",
    hoverBorder: "hover:border-lime-400/40",
  },
];

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <div
      className={`
        group flex-shrink-0 flex items-center gap-3 sm:gap-3.5 px-4 sm:px-5 py-3 sm:py-3.5 mx-2 sm:mx-3
        rounded-2xl border bg-white/[0.03] backdrop-blur-sm
        ${brand.borderColor} ${brand.hoverBorder}
        shadow-sm hover:shadow-md
        transition-all duration-300 cursor-default hover:scale-[1.04] hover:bg-white/[0.06]
      `}
    >
      {/* Icon logo mark */}
      <div className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${brand.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
        <brand.Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${brand.iconColor}`} strokeWidth={1.75} />
      </div>

      {/* Brand name + industry */}
      <div className="min-w-0">
        <p className="text-sm font-black text-foreground/75 group-hover:text-foreground whitespace-nowrap transition-colors leading-none tracking-tight">
          <span>{brand.name}</span>
          <span className={`${brand.iconColor} opacity-80`}>{brand.nameSuffix}</span>
        </p>
        <p className="text-[10px] font-semibold text-muted-foreground/50 whitespace-nowrap tracking-widest uppercase mt-1">
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
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 lg:w-28 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 lg:w-28 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      <motion.div
        className="flex items-center"
        animate={{ x: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{
          x: { repeat: Infinity, repeatType: "loop", duration: 32, ease: "linear" },
        }}
      >
        {doubled.map((brand, i) => (
          <BrandCard key={`${brand.name}-${i}`} brand={brand} />
        ))}
      </motion.div>
    </div>
  );
}

export default function Brands() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const navigate = useNav();

  const row1 = BRANDS.slice(0, 8);
  const row2 = BRANDS.slice(8);

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-background overflow-hidden" ref={ref}>
      {/* Heading */}
      <div className="container mx-auto px-4 sm:px-6 mb-10 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground font-semibold text-[11px] sm:text-xs tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="hidden sm:inline">Trusted by Businesses Across Nigeria</span>
            <span className="sm:hidden">Trusted Across Nigeria</span>
          </span>
          <h2 className="text-[clamp(1.625rem,5.5vw,2.5rem)] font-extrabold text-foreground tracking-[-0.02em] leading-[1.15] text-balance">
            Brands That Choose <span className="text-primary">Blaze Studio</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto px-4 sm:px-0">
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
            onClick={() => navigate("/contact", "contact-form")}
            className="text-primary font-semibold hover:underline underline-offset-4 transition-all"
          >
            Get your free audit →
          </button>
        </p>
      </motion.div>
    </section>
  );
}
