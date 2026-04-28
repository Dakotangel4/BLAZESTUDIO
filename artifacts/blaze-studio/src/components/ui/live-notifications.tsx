import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users } from "lucide-react";

interface NotificationEntry {
  name: string;
  city: string;
  action: string;
  detail: string;
  avatar: string;
}

const POOL: NotificationEntry[] = [
  { name: "Chukwuemeka O.", city: "Lagos Island", action: "just requested", detail: "a Free Website Audit", avatar: "CO" },
  { name: "Ngozi A.", city: "Abuja", action: "just booked", detail: "an SEO Consultation", avatar: "NA" },
  { name: "Tunde B.", city: "Port Harcourt", action: "just sent", detail: "a WhatsApp enquiry", avatar: "TB" },
  { name: "Amaka E.", city: "Enugu", action: "just viewed", detail: "the AI Integration package", avatar: "AE" },
  { name: "Sola K.", city: "Ibadan", action: "just requested", detail: "Website Maintenance", avatar: "SK" },
  { name: "Emeka F.", city: "Lekki, Lagos", action: "just enquired about", detail: "White Label Services", avatar: "EF" },
  { name: "Chioma U.", city: "Benin City", action: "just requested", detail: "a Free Website Audit", avatar: "CU" },
  { name: "Bola D.", city: "Kano", action: "just viewed", detail: "the SEO & Marketing package", avatar: "BD" },
  { name: "Funmi S.", city: "Victoria Island", action: "just booked", detail: "a Strategy Session", avatar: "FS" },
  { name: "Rotimi A.", city: "Ikeja, Lagos", action: "just requested", detail: "a Free Website Audit", avatar: "RA" },
  { name: "Adaeze N.", city: "Onitsha", action: "just enquired about", detail: "Google Ads Management", avatar: "AN" },
  { name: "Kunle M.", city: "Abeokuta", action: "just viewed", detail: "the High-Converting Website package", avatar: "KM" },
  { name: "Yetunde P.", city: "Ikorodu, Lagos", action: "just requested", detail: "a Brand Merchandise quote", avatar: "YP" },
  { name: "Ifeanyi C.", city: "Owerri", action: "just booked", detail: "an AI Chatbot consultation", avatar: "IC" },
  { name: "Blessing T.", city: "Calabar", action: "just sent", detail: "a WhatsApp enquiry", avatar: "BT" },
  { name: "Segun R.", city: "Surulere, Lagos", action: "just requested", detail: "a Free Website Audit", avatar: "SR" },
  { name: "Chiamaka B.", city: "Asaba", action: "just viewed", detail: "the AI Business Integration page", avatar: "CB" },
  { name: "Dapo W.", city: "Jos", action: "just enquired about", detail: "Meta & Google Ads", avatar: "DW" },
  { name: "Oluchi H.", city: "Uyo", action: "just requested", detail: "a Sales Funnel build", avatar: "OH" },
  { name: "Rasheed I.", city: "Ilorin", action: "just booked", detail: "an SEO Strategy call", avatar: "RI" },
  { name: "Adunola K.", city: "Ajah, Lagos", action: "just requested", detail: "a Free Website Audit", avatar: "AK" },
  { name: "Obinna V.", city: "Aba", action: "just enquired about", detail: "E-commerce Website Design", avatar: "OV" },
  { name: "Titilola F.", city: "Gbagada, Lagos", action: "just viewed", detail: "the Portfolio page", avatar: "TF" },
  { name: "Eze G.", city: "Awka", action: "just requested", detail: "a Website Redesign quote", avatar: "EG" },
  { name: "Maryam L.", city: "Kaduna", action: "just sent", detail: "a WhatsApp enquiry", avatar: "ML" },
  { name: "Chidi Q.", city: "Warri", action: "just booked", detail: "a Digital Marketing consultation", avatar: "CQ" },
  { name: "Folake J.", city: "Yaba, Lagos", action: "just requested", detail: "a Free Website Audit", avatar: "FJ" },
  { name: "Nnamdi S.", city: "Abakaliki", action: "just viewed", detail: "the White Label Services page", avatar: "NS" },
  { name: "Shade O.", city: "Magodo, Lagos", action: "just enquired about", detail: "AI Workflow Automation", avatar: "SO" },
  { name: "Uche P.", city: "Makurdi", action: "just requested", detail: "a Free Website Audit", avatar: "UP" },
];

const AVATAR_COLORS = [
  "bg-orange-500", "bg-rose-500", "bg-violet-500", "bg-teal-500",
  "bg-sky-500", "bg-amber-500", "bg-emerald-500", "bg-pink-500",
  "bg-indigo-500", "bg-red-500", "bg-cyan-500", "bg-lime-600",
  "bg-fuchsia-500", "bg-yellow-600", "bg-green-600",
];

const TIME_LABELS = [
  "Just now", "1 min ago", "2 min ago", "3 min ago", "4 min ago",
  "5 min ago", "7 min ago", "9 min ago", "11 min ago", "13 min ago",
  "15 min ago", "18 min ago", "20 min ago", "23 min ago", "25 min ago",
  "28 min ago", "30 min ago", "33 min ago", "36 min ago", "40 min ago",
  "44 min ago", "48 min ago", "52 min ago", "57 min ago", "1 hr ago",
  "1 hr ago", "1 hr ago", "2 hrs ago", "2 hrs ago", "2 hrs ago",
];

const STORAGE_KEY = "blaze_notif_order";
const DATE_KEY = "blaze_notif_date";

function getDailyShuffledOrder(): number[] {
  const today = new Date().toISOString().slice(0, 10);
  const storedDate = localStorage.getItem(DATE_KEY);
  const storedOrder = localStorage.getItem(STORAGE_KEY);

  if (storedDate === today && storedOrder) {
    try {
      return JSON.parse(storedOrder) as number[];
    } catch {
      // fall through to regenerate
    }
  }

  // Generate a new shuffle seeded by date string
  const indices = Array.from({ length: POOL.length }, (_, i) => i);
  // Use date string to create a deterministic-ish shuffle via sort with hash
  const seed = today.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  let s = seed;
  for (let i = indices.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  localStorage.setItem(DATE_KEY, today);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(indices));
  return indices;
}

let globalCounter = 0;

export default function LiveNotifications() {
  const orderRef = useRef<number[]>([]);
  const posRef = useRef(0);

  const [current, setCurrent] = useState<(NotificationEntry & { id: number; ago: string; colorIdx: number }) | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const showNext = useCallback(() => {
    if (orderRef.current.length === 0) return;
    const pos = posRef.current % orderRef.current.length;
    const entryIdx = orderRef.current[pos];
    const entry = POOL[entryIdx];
    const agoLabel = TIME_LABELS[pos % TIME_LABELS.length];
    const colorIdx = entryIdx % AVATAR_COLORS.length;
    posRef.current = pos + 1;
    setCurrent({ ...entry, id: ++globalCounter, ago: agoLabel, colorIdx });
    setDismissed(false);
  }, []);

  useEffect(() => {
    orderRef.current = getDailyShuffledOrder();

    const initialTimer = setTimeout(() => {
      showNext();
    }, 4000);

    return () => clearTimeout(initialTimer);
  }, [showNext]);

  // Auto-dismiss after 6s
  useEffect(() => {
    if (!current) return;
    const t = setTimeout(() => setDismissed(true), 6000);
    return () => clearTimeout(t);
  }, [current]);

  // Show next after 8s gap post-dismiss
  useEffect(() => {
    if (!dismissed || !current) return;
    const t = setTimeout(() => showNext(), 8000);
    return () => clearTimeout(t);
  }, [dismissed, current, showNext]);

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
            {/* Draining progress bar */}
            <motion.div
              className="h-0.5 bg-primary origin-left"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 6, ease: "linear" }}
            />

            <div className="flex items-start gap-3 px-4 py-3.5">
              {/* Avatar */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full ${AVATAR_COLORS[current.colorIdx]} flex items-center justify-center text-white text-xs font-bold tracking-wide`}>
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
                    onClick={() => setDismissed(true)}
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
