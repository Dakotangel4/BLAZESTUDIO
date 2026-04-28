import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Tunde Adebayo",
    company: "Adebayo Logistics",
    image: "/src/assets/test-1.png",
    quote: "Our old website was just an online brochure. Blaze Studio turned it into a lead generation machine. We saw a 200% increase in inbound inquiries within the first two months.",
    result: "200% increase in leads"
  },
  {
    name: "Ngozi Okafor",
    company: "Nova Beauty Retail",
    image: "/src/assets/test-2.png",
    quote: "The SEO strategy they implemented put us on page 1 of Google for our main keywords. The traffic we're getting now is incredible, and sales have tripled.",
    result: "Tripled online sales"
  },
  {
    name: "Emeka Chidi",
    company: "Chidi Consulting",
    image: "/src/assets/test-3.png",
    quote: "Integrating the AI chatbot saved my team so much time. It handles 80% of basic inquiries automatically so we can focus on closing deals.",
    result: "Automated 80% of support"
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-foreground text-background relative overflow-hidden" id="testimonials">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-[11px] sm:text-xs tracking-widest uppercase mb-4 sm:mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Real Results
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[clamp(1.875rem,6vw,3.25rem)] font-extrabold tracking-[-0.02em] leading-[1.1] mb-4 text-balance"
          >
            What Our <span className="text-primary">Clients Say.</span>
          </motion.h2>
          <p className="text-base sm:text-lg text-white/60 max-w-xl mx-auto">
            Founders and operators describing what changed after we shipped.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
          {testimonials.map((test, index) => (
            <motion.div
              key={test.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col bg-white/5 hover:bg-white/[0.07] border border-white/10 hover:border-primary/30 rounded-2xl p-6 sm:p-7 lg:p-8 relative transition-all duration-300"
            >
              <Quote className="absolute top-5 right-5 w-10 h-10 sm:w-12 sm:h-12 text-white/10 group-hover:text-primary/30 transition-colors" />
              
              <div className="flex items-center gap-1 mb-5 sm:mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 sm:w-5 sm:h-5 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 relative z-10 font-medium text-white/90">
                "{test.quote}"
              </p>
              
              <div className="flex items-center gap-3 sm:gap-4 mt-auto">
                <img 
                  src={test.image} 
                  alt={test.name} 
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-primary shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-sm sm:text-base truncate">{test.name}</h4>
                  <p className="text-xs sm:text-sm text-white/60 truncate">{test.company}</p>
                </div>
              </div>
              
              <div className="mt-5 sm:mt-6 pt-4 border-t border-white/10">
                <span className="text-primary font-bold text-[11px] sm:text-xs uppercase tracking-widest">{test.result}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
