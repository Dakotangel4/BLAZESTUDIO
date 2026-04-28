import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNav } from "@/hooks/use-nav";

const WHATSAPP_NUMBER = "2349130986279";

export default function Cta() {
  const navigate = useNav();
  const goToForm = () => navigate("/contact", "contact-form");

  return (
    <section className="py-16 sm:py-20 lg:py-28 relative overflow-hidden bg-foreground text-background" id="contact">
      {/* Dynamic warm glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[300px] sm:h-[400px] bg-primary rounded-full blur-[120px] sm:blur-[150px] opacity-30 pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-[clamp(2rem,7vw,4rem)] font-extrabold tracking-[-0.02em] mb-5 sm:mb-6 leading-[1.05] text-balance">
            Let's Turn Your Website Into a <br className="hidden md:block"/>
            <span className="text-primary">Revenue Machine.</span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Get a free audit — we'll tell you exactly what's costing you leads and how to fix it.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button size="lg" onClick={goToForm} className="w-full sm:w-auto h-14 sm:h-16 px-7 sm:px-10 text-base sm:text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_40px_-10px_rgba(234,88,12,0.8)] transition-all hover:scale-105 active:scale-95 group">
              Get My Free Audit
              <ArrowRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 sm:h-16 px-7 sm:px-10 text-base sm:text-lg font-bold bg-[#25D366] hover:bg-[#1ebe5d] text-white border-0 transition-all hover:scale-105 active:scale-95"
              onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Blaze Studio! I'd like to learn more about your services.")}`, "_blank")}
            >
              <MessageCircle className="mr-2 w-5 h-5 sm:w-6 sm:h-6" />
              WhatsApp Us
            </Button>
          </div>
          
          <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-white/50">No commitment required. Just pure value.</p>
        </motion.div>
      </div>
    </section>
  );
}
