import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, ArrowRight, Sparkles } from "lucide-react";
import { useNav } from "@/hooks/use-nav";

const SESSION_KEY = "blaze_sticky_dismissed";

export default function StickyCTABar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNav();

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      setDismissed(true);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 600 && !sessionStorage.getItem(SESSION_KEY)) {
        setVisible(true);
      } else if (window.scrollY <= 600) {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(SESSION_KEY, "1");
  };

  const handleCTA = () => {
    navigate("/contact", "contact-form");
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent("Hi Blaze Studio! I'd like to book a free strategy call.");
    window.open(`https://wa.me/2349130986279?text=${msg}`, "_blank");
  };

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="fixed top-0 left-0 right-0 z-[60]"
        >
          {/* Glowing top accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />

          <div className="bg-[#0d0d0d]/95 backdrop-blur-md border-b border-white/[0.07] shadow-[0_4px_32px_rgba(0,0,0,0.4)]">
            <div className="container mx-auto px-4 md:px-6 py-2.5 flex items-center justify-between gap-4">

              {/* Left — spark label */}
              <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-[11px] font-bold text-white/40 tracking-widest uppercase">
                  Limited Slots This Month
                </span>
              </div>

              {/* Centre — message */}
              <p className="text-sm font-semibold text-white/90 text-center flex-1">
                <span className="text-primary">🔥 Free Audit Available</span>
                <span className="hidden md:inline text-white/50 mx-2">—</span>
                <span className="hidden md:inline">
                  Book a free strategy call & get a full website audit at no cost.
                </span>
              </p>

              {/* Right — CTAs */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleWhatsApp}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-xs font-bold hover:bg-[#25D366]/20 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  WhatsApp
                </button>

                <button
                  onClick={handleCTA}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95 group"
                >
                  Book Free Call
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={handleDismiss}
                  aria-label="Dismiss"
                  className="ml-1 p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
