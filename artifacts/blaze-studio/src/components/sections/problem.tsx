import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

const painPoints = [
  {
    id: 1,
    title: "Your website gets traffic but nobody calls, books, or buys."
  },
  {
    id: 2,
    title: "You're invisible on Google — customers can't find you."
  },
  {
    id: 3,
    title: "You're spending money on ads that don't convert."
  },
  {
    id: 4,
    title: "Your team wastes hours on tasks AI could handle in seconds."
  },
  {
    id: 5,
    title: "You have a website but it doesn't reflect how good your business actually is."
  }
];

export default function Problem() {
  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-foreground text-background relative overflow-hidden" id="problem">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-primary/20 rounded-full blur-[100px] sm:blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-50" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-[11px] sm:text-xs tracking-widest uppercase mb-4 sm:mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            The Hard Truth
          </span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-[clamp(1.875rem,6vw,3.25rem)] font-extrabold tracking-[-0.02em] mb-4 sm:mb-6 leading-[1.1] text-balance"
          >
            Your Competitors Are Winning Online. <span className="text-primary">You Shouldn't Let Them.</span>
          </motion.h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <ul className="space-y-3 sm:space-y-4">
            {painPoints.map((point, index) => (
              <motion.li 
                key={point.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
              >
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0 mt-0.5" />
                <span className="text-base sm:text-lg md:text-xl font-medium leading-snug">{point.title}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
