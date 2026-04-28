import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How long does a website take to build?",
    a: "A standard high-converting business website typically takes 2-4 weeks from strategy to launch. More complex custom applications or e-commerce platforms may take 6-8 weeks."
  },
  {
    q: "Do you work with small businesses?",
    a: "Absolutely. We specialize in helping small to medium-sized businesses scale. Our solutions are designed to provide maximum ROI, making them an investment rather than just an expense."
  },
  {
    q: "What makes you different from other agencies?",
    a: "We are results-obsessed. Most agencies focus purely on aesthetics; we focus on conversions. A beautiful site is useless if it doesn't generate leads. We combine design, SEO, and AI to build systems that sell."
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes. We typically structure payments in milestones: 50% deposit to begin, 25% upon design approval, and 25% before launch. For larger projects, we can discuss custom payment schedules."
  },
  {
    q: "Can you help with existing websites?",
    a: "Yes. We often start with an audit of your current site. If it has a solid foundation, we can optimize and redesign it. If it's fundamentally broken or slow, we'll recommend a rebuild for better results."
  },
  {
    q: "What is a free audit?",
    a: "Our free audit is a comprehensive review of your current online presence. We analyze your website's speed, conversion rate, SEO ranking, and identify exactly what's costing you leads and how we can fix it."
  },
  {
    q: "How do we get started?",
    a: "Simply click 'Get a Free Audit' or contact us via WhatsApp. We'll schedule a brief discovery call to understand your business goals and determine if we're a good fit."
  }
];

export default function Faq() {
  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-secondary/30" id="faq">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-primary/20 text-primary font-semibold text-[11px] sm:text-xs tracking-widest uppercase mb-4 sm:mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            FAQ
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[clamp(1.875rem,6vw,3.25rem)] font-extrabold tracking-[-0.02em] text-foreground mb-3 sm:mb-4 leading-[1.1] text-balance"
          >
            Frequently Asked <span className="text-primary">Questions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg text-muted-foreground"
          >
            Everything you need to know about working with us.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-background border rounded-2xl px-5 sm:px-6 data-[state=open]:border-primary data-[state=open]:shadow-md transition-all">
                <AccordionTrigger className="text-left text-base sm:text-lg font-bold hover:no-underline hover:text-primary py-5 sm:py-6 [&>svg]:text-primary [&>svg]:shrink-0">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm sm:text-base leading-relaxed pb-5 sm:pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
