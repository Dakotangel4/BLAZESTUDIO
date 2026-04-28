import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, MessageCircle, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "2349130986279";
const SESSION_KEY = "blaze_exit_shown";

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(true);
  }, []);

  useEffect(() => {
    let triggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      if (triggered) return;
      if (e.clientY <= 20) {
        triggered = true;
        show();
      }
    };

    // Mobile: trigger on scroll-up after spending time on page
    let lastScrollY = window.scrollY;
    let scrollTimer: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const isScrollingUp = currentY < lastScrollY;
      const isDeepEnough = currentY > 400;

      if (isScrollingUp && isDeepEnough && !triggered) {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          if (!triggered) {
            triggered = true;
            show();
          }
        }, 300);
      }
      lastScrollY = currentY;
    };

    // Wait 10s before enabling exit intent
    const enableTimer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
      window.addEventListener("scroll", handleScroll, { passive: true });
    }, 10000);

    return () => {
      clearTimeout(enableTimer);
      clearTimeout(scrollTimer);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [show]);

  const close = () => setVisible(false);

  const scrollToForm = () => {
    close();
    setTimeout(() => {
      document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const openWhatsApp = () => {
    close();
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Blaze Studio! I saw your free audit offer and I'd like to claim it.")}`,
      "_blank"
    );
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={close}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

              {/* Top accent bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-primary to-orange-600" />

              <div className="p-8">
                {/* Close */}
                <button
                  onClick={close}
                  className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-5">
                  <Gift className="w-3.5 h-3.5" />
                  Wait — before you go
                </div>

                {/* Headline */}
                <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight mb-3">
                  Get a Free Website Audit{" "}
                  <span className="text-primary">Before You Leave.</span>
                </h2>

                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  In 5 minutes, we'll show you exactly what's stopping your website from generating leads — 
                  your competitors, your speed, your SEO gaps. No cost, no commitment.
                </p>

                {/* Value points */}
                <ul className="space-y-2 mb-7">
                  {[
                    "What's killing your Google rankings",
                    "Why visitors leave without contacting you",
                    "Your #1 quick win to get more leads",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-foreground">
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="flex flex-col gap-3">
                  <Button
                    size="lg"
                    onClick={scrollToForm}
                    className="w-full h-13 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-95 group"
                  >
                    Yes, Audit My Website Free
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    onClick={openWhatsApp}
                    className="w-full h-13 text-base font-bold bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <MessageCircle className="mr-2 w-5 h-5" />
                    Chat on WhatsApp Instead
                  </Button>
                  <button
                    onClick={close}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center pt-1"
                  >
                    No thanks, I'll pass on the free audit
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
