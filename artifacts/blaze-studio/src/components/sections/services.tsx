import { motion } from "framer-motion";
import { MonitorSmartphone, Search, Cpu, Wrench, Briefcase, Tag, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const coreServices = [
  {
    title: "High-Converting Websites",
    icon: MonitorSmartphone,
    description: "Not just beautiful — built to turn visitors into paying clients.",
    results: [
      "Fast-loading mobile-first design",
      "Clear CTAs that drive action",
      "Built for trust & sales",
      "Custom or WordPress"
    ]
  },
  {
    title: "SEO & Digital Marketing",
    icon: Search,
    description: "Get in front of people actively searching for what you sell.",
    results: [
      "Page 1 Google rankings",
      "Paid ads (Meta, Google) that convert",
      "Sales funnels built to close",
      "Traffic that turns into real revenue"
    ]
  },
  {
    title: "AI Business Integration",
    icon: Cpu,
    description: "Plug AI into your business systems, automating repetitive work.",
    results: [
      "AI chatbots for lead capture & support",
      "Automated workflows & follow-ups",
      "Smart tools for faster operations",
      "Competitive edge through technology"
    ]
  }
];

const secondaryServices = [
  {
    title: "Website Maintenance",
    icon: Wrench,
    description: "Updates, security & support"
  },
  {
    title: "White Label Services",
    icon: Briefcase,
    description: "Build under your brand, perfect for agencies"
  },
  {
    title: "Brand Merchandise",
    icon: Tag,
    description: "Custom branded t-shirts and caps"
  }
];

export default function Services() {
  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-background" id="services">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-primary/20 text-primary font-semibold text-[11px] sm:text-xs tracking-wider mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            WHAT WE DELIVER
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[clamp(1.875rem,6vw,3.25rem)] font-extrabold tracking-[-0.02em] text-foreground leading-[1.1] text-balance"
          >
            Three things that <span className="text-primary">move the needle.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mb-12 md:mb-16">
          {coreServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border border-border hover:border-primary/40 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300 group rounded-2xl">
                <CardHeader>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-secondary rounded-xl flex items-center justify-center text-primary mb-5 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <service.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">{service.title}</CardTitle>
                  <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5 sm:space-y-3">
                    {service.results.map((result, i) => (
                      <li key={i} className="flex items-start gap-2.5 sm:gap-3">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">{result}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="border-t pt-12 md:pt-16">
          <h3 className="text-center text-base sm:text-lg font-bold text-muted-foreground tracking-widest uppercase mb-8 md:mb-10">
            Also Available
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {secondaryServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-secondary/50 border border-transparent hover:border-primary/30 hover:bg-secondary transition-all duration-300"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary shrink-0">
                  <service.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-foreground text-sm sm:text-base">{service.title}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
