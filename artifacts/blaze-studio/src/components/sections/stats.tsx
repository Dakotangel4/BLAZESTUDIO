import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { TrendingUp, Users, Briefcase, Star } from "lucide-react";

interface Stat {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  description: string;
  icon: React.ElementType;
  color: string;
}

const STATS: Stat[] = [
  {
    label: "Clients Served",
    value: 50,
    suffix: "+",
    description: "Businesses across Lagos & Nigeria",
    icon: Users,
    color: "from-orange-500/20 to-orange-500/5",
  },
  {
    label: "Projects Delivered",
    value: 120,
    suffix: "+",
    description: "Websites, campaigns & AI integrations",
    icon: Briefcase,
    color: "from-violet-500/20 to-violet-500/5",
  },
  {
    label: "Average ROI",
    value: 180,
    suffix: "%",
    prefix: "+",
    description: "Growth reported in first 90 days",
    icon: TrendingUp,
    color: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    label: "Client Rating",
    value: 4.9,
    suffix: "/5",
    decimals: 1,
    description: "Average satisfaction score",
    icon: Star,
    color: "from-amber-500/20 to-amber-500/5",
  },
];

function AnimatedNumber({
  value,
  suffix,
  prefix = "",
  decimals = 0,
  inView,
}: {
  value: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  inView: boolean;
}) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.floor(v).toString()
  );
  const [display, setDisplay] = useState(decimals > 0 ? (0).toFixed(decimals) : "0");

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return unsub;
  }, [rounded]);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [inView, motionVal, value]);

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden bg-[#0d0d0d]" ref={ref}>
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(234,88,12,0.15),transparent)]" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.04]" />

      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      {/* Bottom border glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-[11px] sm:text-xs tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Proven Track Record
          </span>
          <h2 className="text-[clamp(1.875rem,6vw,3.25rem)] font-extrabold text-white tracking-[-0.02em] leading-[1.1] text-balance">
            Numbers That <span className="text-primary">Speak for Themselves</span>
          </h2>
          <p className="mt-4 text-white/50 text-base sm:text-lg max-w-xl mx-auto">
            Real results from real businesses we've partnered with across Nigeria.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6 md:p-7 lg:p-8 overflow-hidden hover:border-primary/30 transition-colors duration-300"
            >
              {/* Card glow on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Icon */}
              <div className="relative z-10 mb-5">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors duration-300">
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>

              {/* Number */}
              <div className="relative z-10 mb-1">
                <span className="text-[clamp(2rem,7vw,3rem)] font-extrabold text-white tracking-[-0.02em] tabular-nums">
                  <AnimatedNumber
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                    decimals={stat.decimals}
                    inView={inView}
                  />
                </span>
              </div>

              {/* Label */}
              <div className="relative z-10">
                <p className="text-sm font-bold text-white/80 mb-1">{stat.label}</p>
                <p className="text-xs text-white/40 leading-relaxed">{stat.description}</p>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Bottom trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-3 text-center"
        >
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-white/60 text-sm font-medium">4.9 out of 5 stars</span>
          </div>
          <span className="hidden sm:block text-white/20">·</span>
          <span className="text-white/40 text-sm">Based on reviews from businesses across Lagos, Abuja & beyond</span>
        </motion.div>

      </div>
    </section>
  );
}
