import { motion } from "framer-motion";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/hero";
import Problem from "@/components/sections/problem";
import Services from "@/components/sections/services";
import Process from "@/components/sections/process";
import Portfolio from "@/components/sections/portfolio";
import Testimonials from "@/components/sections/testimonials";
import WhyUs from "@/components/sections/why-us";
import Stats from "@/components/sections/stats";
import Brands from "@/components/sections/brands";
import Faq from "@/components/sections/faq";
import Cta from "@/components/sections/cta";
import ContactForm from "@/components/sections/contact-form";
import WhatsAppFloat from "@/components/ui/whatsapp-float";
import LiveNotifications from "@/components/ui/live-notifications";
import ExitIntentPopup from "@/components/ui/exit-intent-popup";
import StickyCTABar from "@/components/ui/sticky-cta-bar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Brands />
        <Problem />
        <Services />
        <Process />
        <Portfolio />
        <Testimonials />
        <WhyUs />
        <Faq />
        <ContactForm />
        <Cta />
      </main>
      <Footer />
      <StickyCTABar />
      <WhatsAppFloat />
      <LiveNotifications />
      <ExitIntentPopup />
    </div>
  );
}
