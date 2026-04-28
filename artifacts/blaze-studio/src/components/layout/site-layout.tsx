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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyCTABar />
      <WhatsAppFloat />
      <LiveNotifications />
      <ExitIntentPopup />
    </div>
  );
}
