import { motion } from "framer-motion";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import SiteLayout from "@/components/layout/site-layout";
import Problem from "@/components/sections/problem";
import ContactForm from "@/components/sections/contact-form";
import Faq from "@/components/sections/faq";

const contactChannels = [
  {
    Icon: MapPin,
    label: "Office",
    primary: "J&F Plaza, Opp Otokutu Market",
    secondary: "Otokutu, Delta, Nigeria",
    href: "https://www.google.com/maps/search/?api=1&query=J%26F+Plaza+Otokutu+Market+Otokutu+Delta+Nigeria",
    cta: "Get directions",
  },
  {
    Icon: Phone,
    label: "Phone",
    primary: "+234 913 098 6279",
    secondary: "Mon – Fri, 9am – 6pm WAT",
    href: "tel:+2349130986279",
    cta: "Call now",
  },
  {
    Icon: Mail,
    label: "Email",
    primary: "info@blazestudio.com.ng",
    secondary: "We reply within 1 business day",
    href: "mailto:info@blazestudio.com.ng",
    cta: "Send an email",
  },
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    primary: "+234 913 098 6279",
    secondary: "Fastest way to reach us",
    href: "https://wa.me/2349130986279?text=Hi%20Blaze%20Studio!%20I%27d%20like%20to%20learn%20more%20about%20your%20services.",
    cta: "Chat on WhatsApp",
  },
];

export default function ContactPage() {
  return (
    <SiteLayout>
      <div className="pt-24">
        {/* Contact Info */}
        <section className="py-16 md:py-20 border-b">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mb-12"
            >
              <div className="text-sm font-bold text-primary tracking-widest mb-3">
                GET IN TOUCH
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                Talk to a real human at Blaze Studio.
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Visit the office, send a quick email, or message us on WhatsApp —
                whichever works best for you. We respond fast.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {contactChannels.map((c, i) => (
                <motion.a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group block bg-background border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <c.Icon className="w-5 h-5 text-primary group-hover:text-white" />
                  </div>
                  <div className="text-xs font-bold text-primary tracking-wider mb-2">
                    {c.label.toUpperCase()}
                  </div>
                  <div className="font-bold text-foreground leading-snug mb-1 break-words">
                    {c.primary}
                  </div>
                  <div className="text-sm text-muted-foreground leading-snug mb-4">
                    {c.secondary}
                  </div>
                  <div className="text-sm font-semibold text-primary group-hover:underline">
                    {c.cta} →
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span>Office hours: Monday – Friday, 9am – 6pm WAT</span>
            </div>
          </div>
        </section>

        <Problem />
        <ContactForm />
        <Faq />
      </div>
    </SiteLayout>
  );
}
