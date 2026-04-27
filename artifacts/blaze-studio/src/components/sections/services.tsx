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
    <section className="py-24 bg-background" id="services">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 bg-secondary text-primary font-semibold rounded-full text-sm mb-4"
          >
            What We Deliver
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
          >
            Three things that <span className="text-primary">move the needle.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {coreServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-2 border-secondary hover:border-primary/50 transition-colors shadow-lg hover:shadow-xl group">
                <CardHeader>
                  <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <service.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{service.title}</CardTitle>
                  <p className="text-muted-foreground mt-2">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.results.map((result, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">{result}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="border-t pt-16">
          <h3 className="text-center text-xl font-bold text-foreground/80 mb-10">Also Available</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {secondaryServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50"
              >
                <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-primary shrink-0">
                  <service.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{service.title}</h4>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
