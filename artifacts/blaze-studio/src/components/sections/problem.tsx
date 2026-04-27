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
    <section className="py-24 bg-foreground text-background relative overflow-hidden" id="problem">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-50" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Your Competitors Are Winning Online. <span className="text-primary">You Shouldn't Let Them.</span>
          </motion.h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <ul className="space-y-4">
            {painPoints.map((point, index) => (
              <motion.li 
                key={point.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <XCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <span className="text-lg md:text-xl font-medium">{point.title}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
