import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Strategy",
    desc: "We audit your current setup and define a clear roadmap to revenue."
  },
  {
    num: "02",
    title: "Design",
    desc: "We craft high-converting layouts that build trust instantly."
  },
  {
    num: "03",
    title: "Build",
    desc: "We develop fast, responsive systems integrated with AI tools."
  },
  {
    num: "04",
    title: "Launch & Grow",
    desc: "We deploy the site and drive targeted traffic to generate leads."
  }
];

export default function Process() {
  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-secondary/30 relative" id="process">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 md:mb-20">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-primary/20 text-primary font-semibold text-[11px] sm:text-xs tracking-widest uppercase mb-4 sm:mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            How We Work
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[clamp(1.875rem,6vw,3.25rem)] font-extrabold tracking-[-0.02em] text-foreground leading-[1.1] text-balance"
          >
            Simple Process. <span className="text-primary">Serious Results.</span>
          </motion.h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-border rounded-full z-0 overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-7 sm:gap-8 md:gap-4 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative flex md:flex-col md:items-center md:text-center gap-5 md:gap-0 group"
              >
                {/* Mobile connecting line */}
                {index !== steps.length - 1 && (
                  <div className="md:hidden absolute top-14 left-7 w-0.5 h-[calc(100%+1.75rem)] bg-border -z-10" />
                )}
                
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 shrink-0 rounded-full bg-white border-4 border-primary flex items-center justify-center text-base sm:text-lg md:text-2xl font-bold text-primary shadow-xl shadow-primary/20 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  {step.num}
                </div>
                
                <div className="flex-1 min-w-0 md:flex-none">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-3 tracking-tight">{step.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
