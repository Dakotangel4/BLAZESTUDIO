import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useListPublicTestimonials, type PublicTestimonial } from "@workspace/api-client-react";
import CompanyLogo from "@/components/ui/company-logo";
import { Skeleton } from "@/components/ui/skeleton";

const VISIBLE = 3; // cards per page on desktop

function TestimonialCard({ test }: { test: PublicTestimonial }) {
  return (
    <div className="group flex h-full flex-col bg-white/5 hover:bg-white/[0.07] border border-white/10 hover:border-primary/30 rounded-2xl p-6 sm:p-7 lg:p-8 relative transition-all duration-300">
      <Quote className="absolute top-5 right-5 w-10 h-10 sm:w-12 sm:h-12 text-white/10 group-hover:text-primary/30 transition-colors" />

      <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={
                i < test.rating
                  ? "w-4 h-4 sm:w-5 sm:h-5 fill-primary text-primary"
                  : "w-4 h-4 sm:w-5 sm:h-5 text-white/20"
              }
            />
          ))}
        </div>
        {test.industry ? (
          <span className="text-[10px] uppercase tracking-widest font-bold text-white/60 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
            {test.industry}
          </span>
        ) : null}
      </div>

      <p className="text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 relative z-10 font-medium text-white/90">
        “{test.quote}”
      </p>

      <div className="flex items-center gap-3 sm:gap-4 mt-auto">
        {test.profileImage ? (
          <img
            src={test.profileImage}
            alt={test.clientName}
            loading="lazy"
            decoding="async"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-primary shrink-0"
          />
        ) : (
          <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-primary shrink-0 bg-white/10 flex items-center justify-center text-white font-bold">
            {test.clientName.charAt(0)}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-white text-sm sm:text-base truncate">
            {test.clientName}
          </h4>
          <p className="text-xs sm:text-sm text-white/60 truncate">
            {test.jobTitle ? `${test.jobTitle}, ` : ""}
            {test.companyName}
          </p>
        </div>
        <CompanyLogo
          companyName={test.companyName}
          companyDomain={test.companyDomain}
          companyLogoUrl={test.companyLogoUrl}
          variant="dark"
          size="md"
          className="shrink-0"
        />
      </div>

      {test.resultLabel ? (
        <div className="mt-5 sm:mt-6 pt-4 border-t border-white/10">
          <span className="text-primary font-bold text-[11px] sm:text-xs uppercase tracking-widest">
            {test.resultLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 h-[320px] flex flex-col">
      <Skeleton className="h-5 w-28 mb-6 bg-white/10" />
      <Skeleton className="h-4 w-full mb-2 bg-white/10" />
      <Skeleton className="h-4 w-11/12 mb-2 bg-white/10" />
      <Skeleton className="h-4 w-9/12 mb-auto bg-white/10" />
      <div className="flex items-center gap-3 mt-6">
        <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-2 bg-white/10" />
          <Skeleton className="h-3 w-24 bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const { data, isLoading } = useListPublicTestimonials();
  const testimonials = data?.testimonials ?? [];

  // Carousel state — only used when testimonials > VISIBLE
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const useCarousel = testimonials.length > VISIBLE;
  const totalPages = useCarousel
    ? Math.max(1, testimonials.length - VISIBLE + 1)
    : 1;

  useEffect(() => {
    if (!useCarousel || paused) return;
    const t = setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, 5000);
    return () => clearInterval(t);
  }, [useCarousel, paused, totalPages]);

  return (
    <section
      className="py-16 sm:py-20 lg:py-28 bg-foreground text-background relative overflow-hidden"
      id="testimonials"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-[11px] sm:text-xs tracking-widest uppercase mb-4 sm:mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Real Results
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[clamp(1.875rem,6vw,3.25rem)] font-extrabold tracking-[-0.02em] leading-[1.1] mb-4 text-balance"
          >
            What Our <span className="text-primary">Clients Say.</span>
          </motion.h2>
          <p className="text-base sm:text-lg text-white/60 max-w-xl mx-auto">
            Founders and operators describing what changed after we shipped.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
            <Quote className="w-10 h-10 mx-auto text-white/20 mb-4" />
            <p className="text-white/60">
              Client stories coming soon. Check back shortly.
            </p>
          </div>
        ) : !useCarousel ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TestimonialCard test={t} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Mobile: native swipe via overflow-scroll */}
            <div className="md:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory flex gap-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="snap-center shrink-0 w-[88%] first:ml-0"
                >
                  <TestimonialCard test={t} />
                </div>
              ))}
            </div>

            {/* Desktop: 3-up carousel */}
            <div className="hidden md:block">
              <div className="overflow-hidden">
                <motion.div
                  className="flex"
                  animate={{ x: `${-(page * (100 / VISIBLE))}%` }}
                  transition={{ type: "tween", ease: "easeInOut", duration: 0.6 }}
                >
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      className="shrink-0 px-3 lg:px-3.5"
                      style={{ width: `${100 / VISIBLE}%` }}
                    >
                      <TestimonialCard test={t} />
                    </div>
                  ))}
                </motion.div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)}
                  className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPage(i)}
                      aria-label={`Go to page ${i + 1}`}
                      className={
                        i === page
                          ? "h-2 w-6 rounded-full bg-primary transition-all"
                          : "h-2 w-2 rounded-full bg-white/30 hover:bg-white/60 transition-all"
                      }
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setPage((p) => (p + 1) % totalPages)}
                  className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
