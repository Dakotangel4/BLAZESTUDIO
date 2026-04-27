import { Link } from "wouter";
import { Flame, MapPin, Mail, Phone, Twitter, Linkedin, Instagram, ArrowRight } from "lucide-react";

export default function Footer() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-background border-t pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <Flame className="w-8 h-8 text-primary" fill="currentColor" />
              <span className="font-bold text-2xl tracking-tight text-foreground">Blaze Studio</span>
            </div>
            <p className="text-muted-foreground mt-4 max-w-sm">
              We build high-converting business websites, rank you on Google, run digital marketing campaigns, and integrate AI into your business systems.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Services</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <button onClick={() => scrollTo("services")} className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> Web Design
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("services")} className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> SEO & Marketing
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("services")} className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> AI Integration
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("services")} className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> Website Maintenance
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <button onClick={() => scrollTo("process")} className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> Our Process
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("portfolio")} className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> Portfolio
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("testimonials")} className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> Testimonials
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("faq")} className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> FAQ
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Contact</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span>Victoria Island,<br/>Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+2348000000000" className="hover:text-primary transition-colors">+234 (0) 800 000 0000</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:hello@blazestudio.com" className="hover:text-primary transition-colors">hello@blazestudio.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Blaze Studio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
