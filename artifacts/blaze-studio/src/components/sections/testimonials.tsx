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
    <section className="py-24 bg-foreground text-background relative" id="testimonials">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            What Our <span className="text-primary">Clients Say.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, index) => (
            <motion.div
              key={test.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 relative"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-white/10" />
              
              <div className="flex items-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-lg leading-relaxed mb-8 relative z-10 font-medium">
                "{test.quote}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <img 
                  src={test.image} 
                  alt={test.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                />
                <div>
                  <h4 className="font-bold text-white">{test.name}</h4>
                  <p className="text-sm text-white/60">{test.company}</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/10">
                <span className="text-primary font-bold text-sm uppercase tracking-wider">{test.result}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
