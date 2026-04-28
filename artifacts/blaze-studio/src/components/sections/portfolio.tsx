import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Lagos Real Estate Hub",
    tag: "Web Design & SEO",
    stat: "+180% leads",
    image: "/src/assets/portfolio-1.png",
    color: "bg-blue-500/10 text-blue-600 border-blue-200"
  },
  {
    title: "Nova Retail E-commerce",
    tag: "E-commerce",
    stat: "3x conversions",
    image: "/src/assets/portfolio-2.png",
    color: "bg-green-500/10 text-green-600 border-green-200"
  },
  {
    title: "FinTech Automations",
    tag: "AI Integration",
    stat: "Page 1 Google",
    image: "/src/assets/portfolio-3.png",
    color: "bg-purple-500/10 text-purple-600 border-purple-200"
  }
];

export default function Portfolio() {
  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-background" id="portfolio">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[clamp(1.875rem,6vw,3.25rem)] font-extrabold tracking-[-0.02em] text-foreground leading-[1.1] text-balance"
            >
              Work That <span className="text-primary">Converts.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              We don't just build pretty sites. We build revenue-generating assets.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-secondary">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center text-white transform scale-50 group-hover:scale-100 transition-transform duration-500 shadow-2xl shadow-primary/40">
                    <ArrowUpRight className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                </div>
                
                {/* Result Stat Badge */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/95 backdrop-blur shadow-lg px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm text-foreground">
                  {project.stat}
                </div>
              </div>
              
              <div>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold border ${project.color} mb-2.5 sm:mb-3 tracking-wider uppercase`}>
                  {project.tag}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight group-hover:text-primary transition-colors leading-snug">{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
