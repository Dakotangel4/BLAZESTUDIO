import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users } from "lucide-react";

interface Notification {
  id: number;
  name: string;
  city: string;
  action: string;
  detail: string;
  ago: string;
  avatar: string;
}

const POOL: Omit<Notification, "id">[] = [
  { name: "Chukwuemeka O.", city: "Lagos", action: "just requested", detail: "a Free Website Audit", ago: "Just now", avatar: "CO" },
  { name: "Ngozi A.", city: "Abuja", action: "just booked", detail: "an SEO Consultation", ago: "2 min ago", avatar: "NA" },
  { name: "Tunde B.", city: "Port Harcourt", action: "just sent", detail: "a WhatsApp message", ago: "4 min ago", avatar: "TB" },
  { name: "Amaka E.", city: "Enugu", action: "just viewed", detail: "the AI Integration package", ago: "6 min ago", avatar: "AE" },
  { name: "Sola K.", city: "Ibadan", action: "just requested", detail: "Website Maintenance", ago: "9 min ago", avatar: "SK" },
  { name: "Emeka F.", city: "Lagos", action: "just enquired about", detail: "White Label Services", ago: "11 min ago", avatar: "EF" },
  { name: "Chioma U.", city: "Benin City", action: "just requested", detail: "a Free Website Audit", ago: "14 min ago", avatar: "CU" },
  { name: "Bola D.", city: "Kano", action: "just viewed", detail: "the SEO & Marketing package", ago: "16 min ago", avatar: "BD" },
  { name: "Funmi S.", city: "Lagos Island", action: "just booked", detail: "a Strategy Session", ago: "20 min ago", avatar: "FS" },
  { name: "Rotimi A.", city: "Lekki, Lagos", action: "just requested", detail: "a Free Website Audit", ago: "22 min ago", avatar: "RA" },
];

const AVATAR_COLORS = [
  "bg-orange-500", "bg-rose-500", "bg-violet-500",
  "bg-teal-500", "bg-sky-500", "bg-amber-500",
  "bg-emerald-500", "bg-pink-500", "bg-indigo-500", "bg-red-500",
];

let counter = 0;

export default function LiveNotifications() {
  const [current, setCurrent] = useState<Notification | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [poolIndex, setPoolIndex] = useState(0);

  const showNext = useCallback((idx: number) => {
    const entry = POOL[idx % POOL.length];
    setCurrent({ ...entry, id: ++counter });
    setDismissed(false);
  }, []);

  useEffect(() => {
    // Initial delay before first notification
    const initialTimer = setTimeout(() => {
      showNext(0);
      setPoolIndex(1);
    }, 4000);
    return () => clearTimeout(initialTimer);
  }, [showNext]);

  useEffect(() => {
    if (current === null) return;

    // Auto-dismiss after 6 seconds
    const dismissTimer = setTimeout(() => {
      setDismissed(true);
    }, 6000);

    return () => clearTimeout(dismissTimer);
  }, [current]);

  useEffect(() => {
    if (!dismissed || current === null) return;

    // Wait 2s after dismiss, then show next
    const nextTimer = setTimeout(() => {
      setPoolIndex((prev) => {
        const next = prev % POOL.length;
        showNext(next);
        return next + 1;
      });
    }, 8000);

    return () => clearTimeout(nextTimer);
  }, [dismissed, current, showNext]);

  const handleDismiss = () => setDismissed(true);

  const colorIndex = current ? current.id % AVATAR_COLORS.length : 0;

  return (
    <div className="fixed bottom-24 left-4 md:left-6 z-50 max-w-[320px] w-full pointer-events-none">
      <AnimatePresence>
        {current && !dismissed && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="pointer-events-auto bg-white border border-border rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden"
          >
            {/* Progress bar */}
            <motion.div
              className="h-0.5 bg-primary origin-left"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 6, ease: "linear" }}
            />

            <div className="flex items-start gap-3 px-4 py-3.5">
              {/* Avatar */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full ${AVATAR_COLORS[colorIndex]} flex items-center justify-center text-white text-xs font-bold tracking-wide`}>
                {current.avatar}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-foreground leading-snug">
                    <span className="font-bold">{current.name}</span>
                    {" "}
                    <span className="text-muted-foreground">from {current.city}</span>
                    {" "}
                    <span className="text-foreground">{current.action}</span>
                    {" "}
                    <span className="font-semibold text-primary">{current.detail}</span>
                  </p>
                  <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
                    aria-label="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground">{current.ago}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" /> Blaze Studio
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
