import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden overflow-x-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] -z-10" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-primary/20 text-primary font-semibold text-xs tracking-wider mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              HIGH-CONVERTING WEBSITES
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6"
            >
              Your Website Should Be Your Best <span className="text-primary">Salesperson.</span><br /> Is It?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl"
            >
              We build high-converting business websites, rank you on Google, run digital marketing campaigns that actually sell, and integrate AI into your business systems — all under one roof.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="h-14 px-8 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 group" onClick={() => scrollTo("contact")}>
                Get a Free Audit
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base font-bold border-2 hover:bg-secondary transition-all" onClick={() => scrollTo("portfolio")}>
                See Our Work
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-10 flex items-center gap-4 text-sm font-medium text-muted-foreground"
            >
              <div className="flex -space-x-3">
                <img src="/src/assets/test-1.png" alt="Client" className="w-10 h-10 rounded-full border-2 border-background object-cover" />
                <img src="/src/assets/test-2.png" alt="Client" className="w-10 h-10 rounded-full border-2 border-background object-cover" />
                <img src="/src/assets/test-3.png" alt="Client" className="w-10 h-10 rounded-full border-2 border-background object-cover" />
              </div>
              <p>Trusted by 50+ businesses in Lagos</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
            className="relative lg:ml-auto w-full max-w-lg aspect-square lg:aspect-auto lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
            <img
              src="/src/assets/hero-team.png"
              alt="Creative team collaborating"
              className="w-full h-full object-cover object-center"
            />
            
            {/* Floating stats card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl z-20 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Average Growth</p>
                  <p className="text-xs text-muted-foreground">in first 90 days</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-primary">+180%</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
