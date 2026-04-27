import { motion } from "framer-motion";
import { Target, Zap, Cpu, Users } from "lucide-react";

const points = [
  {
    title: "Results, not deliverables",
    desc: "We don't just hand over a website. We hand over a system designed to generate revenue.",
    icon: Target
  },
  {
    title: "Speed without sacrificing quality",
    desc: "We move fast because we have a proven framework. Your new site can be live in weeks, not months.",
    icon: Zap
  },
  {
    title: "AI-forward thinking",
    desc: "We integrate the latest AI tools to make your business run leaner, faster, and smarter.",
    icon: Cpu
  },
  {
    title: "One full-stack team",
    desc: "Design, development, SEO, and marketing all under one roof. No miscommunication.",
    icon: Users
  }
];

export default function WhyUs() {
  return (
    <section className="py-24 bg-background" id="about">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-12"
            >
              We Don't Just Build Sites.<br/>
              <span className="text-primary">We Build Businesses.</span>
            </motion.h2>

            <div className="space-y-8">
              {points.map((point, index) => (
                <motion.div 
                  key={point.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary shrink-0">
                    <point.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{point.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{point.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-secondary rounded-3xl p-10 md:p-16 relative"
          >
            <div className="text-primary text-6xl font-serif leading-none absolute top-8 left-8 opacity-20">"</div>
            <h3 className="text-3xl md:text-4xl font-bold leading-tight relative z-10 mt-4 text-foreground/90">
              Most businesses have a website. <br/><br/>
              Very few have one that <span className="text-primary">works</span>. <br/><br/>
              That gap is exactly where we operate.
            </h3>
            <div className="mt-12 flex items-center gap-4">
              <div className="w-16 h-1 bg-primary rounded-full" />
              <span className="font-bold text-foreground tracking-wider uppercase">The Blaze Standard</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
