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
import Faq from "@/components/sections/faq";
import Cta from "@/components/sections/cta";
import ContactForm from "@/components/sections/contact-form";
import WhatsAppFloat from "@/components/ui/whatsapp-float";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
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
      <WhatsAppFloat />
    </div>
  );
}
