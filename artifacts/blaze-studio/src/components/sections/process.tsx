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
    <section className="py-24 bg-secondary/30 relative" id="process">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-foreground"
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative flex flex-col md:items-center md:text-center group"
              >
                {/* Mobile connecting line */}
                {index !== steps.length - 1 && (
                  <div className="md:hidden absolute top-12 left-6 w-0.5 h-full bg-border -z-10" />
                )}
                
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white border-4 border-primary flex items-center justify-center text-xl md:text-2xl font-bold text-primary shadow-xl shadow-primary/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {step.num}
                </div>
                
                <div className="pl-20 md:pl-0 -mt-20 md:mt-0">
                  <h3 className="text-xl md:text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
