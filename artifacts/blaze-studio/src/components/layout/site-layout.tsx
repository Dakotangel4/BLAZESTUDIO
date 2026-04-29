import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import WhatsAppFloat from "@/components/ui/whatsapp-float";
import LiveNotifications from "@/components/ui/live-notifications";
import ExitIntentPopup from "@/components/ui/exit-intent-popup";
import StickyCTABar from "@/components/ui/sticky-cta-bar";

export default function SiteLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location]);

  // Suppress redundant lead-capture surfaces on the contact page itself —
  // the page IS the conversion target, so re-prompting with a sticky CTA,
  // exit-intent popup, or live notifications would feel duplicative and noisy.
  const isContactPage = location === "/contact";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      {!isContactPage && <StickyCTABar />}
      <WhatsAppFloat />
      {!isContactPage && <LiveNotifications />}
      {!isContactPage && <ExitIntentPopup />}
    </div>
  );
}
