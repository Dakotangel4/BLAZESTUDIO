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
    <section className="py-24 bg-background" id="portfolio">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
            >
              Work That <span className="text-primary">Converts.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-lg text-muted-foreground"
            >
              We don't just build pretty sites. We build revenue-generating assets.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-secondary">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white transform scale-50 group-hover:scale-100 transition-transform duration-500">
                    <ArrowUpRight className="w-8 h-8" />
                  </div>
                </div>
                
                {/* Result Stat Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur shadow-lg px-4 py-2 rounded-full font-bold text-sm text-foreground">
                  {project.stat}
                </div>
              </div>
              
              <div>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${project.color} mb-3`}>
                  {project.tag}
                </div>
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
