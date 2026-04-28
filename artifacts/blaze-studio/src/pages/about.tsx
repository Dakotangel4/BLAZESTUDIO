import { motion } from "framer-motion";
import { Flame, Target, Heart, Sparkles, ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/layout/site-layout";
import Cta from "@/components/sections/cta";
import { useNav } from "@/hooks/use-nav";

const values = [
  {
    Icon: Target,
    title: "Results over fluff",
    body: "We don't ship pretty pages — we ship pages that print revenue. Every pixel is justified by a metric.",
  },
  {
    Icon: Heart,
    title: "Partner, not vendor",
    body: "We treat your business like our own. Honest opinions, fast replies, real strategy — not just file deliveries.",
  },
  {
    Icon: Sparkles,
    title: "Craft you can feel",
    body: "Sharp design, smooth motion, fast load times. The difference between forgettable and unforgettable.",
  },
  {
    Icon: Rocket,
    title: "Move fast, stay sharp",
    body: "Two-week sprints, weekly demos, no agency drama. You see progress every Friday.",
  },
];

const milestones = [
  { year: "2021", text: "Founded in Lagos with one laptop and a stubborn idea." },
  { year: "2022", text: "Shipped our first 10 client websites — every one ranked page-one." },
  { year: "2023", text: "Grew the team, opened a SEO + ads division." },
  { year: "2024", text: "Began folding AI workflows into client operations." },
  { year: "Today", text: "60+ businesses scaled. Still answering every email ourselves." },
];

const team = [
  {
    name: "Adaeze O.",
    role: "Founder & Strategy",
    initials: "AO",
    color: "bg-primary/15 text-primary",
  },
  {
    name: "Tunde A.",
    role: "Lead Designer",
    initials: "TA",
    color: "bg-blue-500/15 text-blue-600",
  },
  {
    name: "Ifeanyi K.",
    role: "Engineering Lead",
    initials: "IK",
    color: "bg-emerald-500/15 text-emerald-600",
  },
  {
    name: "Zara M.",
    role: "SEO & Growth",
    initials: "ZM",
    color: "bg-purple-500/15 text-purple-600",
  },
];

const stats = [
  { value: "60+", label: "Businesses scaled" },
  { value: "5yr", label: "In the trenches" },
  { value: "92%", label: "Client retention" },
  { value: "4.9★", label: "Average rating" },
];

export default function AboutPage() {
  const navigate = useNav();

  return (
    <SiteLayout>
      <div className="pt-24">
        {/* Hero */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-primary/20 text-primary font-semibold text-xs tracking-wider mb-6">
                <Flame className="w-3.5 h-3.5" />
                ABOUT BLAZE STUDIO
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05] mb-6">
                We build the websites that <span className="text-primary">make the phone ring.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Blaze Studio is a small, sharp team of designers, engineers and growth marketers
                obsessed with turning websites from digital brochures into real revenue engines.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="border-y bg-secondary/40">
          <div className="container mx-auto px-4 md:px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="text-center md:text-left"
                >
                  <div className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-sm font-bold text-primary tracking-widest mb-3">OUR STORY</div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
                Started by builders. Still run by builders.
              </h2>
              <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
                <p>
                  We started Blaze Studio after watching too many great Nigerian businesses lose
                  customers to ugly, slow, badly-built websites. The internet should be a level
                  playing field — but only if your site can actually compete.
                </p>
                <p>
                  So we got to work. No fluff agencies, no offshore handoffs, no months of
                  waiting. Just real builders working directly with founders to turn their
                  websites into the hardest-working salesperson on the team.
                </p>
                <p>
                  Five years in, we're still small on purpose. Every project gets a senior
                  designer and a senior engineer. No juniors swapping in halfway through.
                </p>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute left-4 top-2 bottom-2 w-px bg-border" aria-hidden />
              <ul className="space-y-8">
                {milestones.map((m) => (
                  <li key={m.year} className="relative pl-12">
                    <div className="absolute left-0 top-0 w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    </div>
                    <div className="text-sm font-bold text-primary tracking-wider mb-1">
                      {m.year}
                    </div>
                    <p className="text-foreground/80 leading-relaxed">{m.text}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mb-14"
            >
              <div className="text-sm font-bold text-primary tracking-widest mb-3">
                WHAT WE STAND FOR
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Four rules we never break.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group bg-background border rounded-2xl p-7 hover:border-primary/40 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <v.Icon className="w-6 h-6 text-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{v.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{v.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mb-14"
            >
              <div className="text-sm font-bold text-primary tracking-widest mb-3">THE TEAM</div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Small team. Senior people. No handoffs.
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {team.map((person, i) => (
                <motion.div
                  key={person.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="text-center"
                >
                  <div className={`mx-auto w-24 h-24 md:w-28 md:h-28 rounded-2xl ${person.color} flex items-center justify-center text-2xl font-extrabold mb-4`}>
                    {person.initials}
                  </div>
                  <div className="font-bold text-foreground">{person.name}</div>
                  <div className="text-sm text-muted-foreground">{person.role}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/contact", "contact-form")}
                className="h-14 px-8 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 group"
              >
                Work With Us
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/portfolio")}
                className="h-14 px-8 text-base font-bold border-2 hover:bg-secondary transition-all"
              >
                See Our Work
              </Button>
            </div>
          </div>
        </section>

        {/* Closing CTA reuses brand CTA */}
        <Cta />
      </div>
    </SiteLayout>
  );
}
