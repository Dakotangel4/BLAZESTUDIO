import { useMemo } from "react";
import { useListPublicTestimonials } from "@workspace/api-client-react";
import CompanyLogo from "@/components/ui/company-logo";

export default function TrustedByBar() {
  const { data, isLoading } = useListPublicTestimonials();

  // Dedupe by companyName + only keep entries that resolve to a logo (or have a name fallback)
  const companies = useMemo(() => {
    const seen = new Set<string>();
    const out: Array<{
      id: number;
      companyName: string;
      companyDomain: string;
      companyLogoUrl: string | null;
    }> = [];
    for (const t of data?.testimonials ?? []) {
      const key = t.companyName.trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push({
        id: t.id,
        companyName: t.companyName,
        companyDomain: t.companyDomain,
        companyLogoUrl: t.companyLogoUrl ?? null,
      });
    }
    return out;
  }, [data]);

  if (isLoading || companies.length === 0) {
    return null;
  }

  // Duplicate the list so the marquee loop is seamless
  const loop = [...companies, ...companies];

  return (
    <section
      aria-label="Trusted by"
      className="py-10 sm:py-14 bg-secondary/40 border-y border-border/60"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <p className="text-center text-[11px] sm:text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-6 sm:mb-8">
          Trusted by businesses across Nigeria and beyond
        </p>

        <div
          className="group relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="flex items-center gap-10 sm:gap-14 marquee-track">
            {loop.map((c, idx) => (
              <div
                key={`${c.id}-${idx}`}
                className="group/logo flex items-center gap-3 shrink-0"
                title={c.companyName}
              >
                <CompanyLogo
                  companyName={c.companyName}
                  companyDomain={c.companyDomain}
                  companyLogoUrl={c.companyLogoUrl}
                  variant="light"
                  size="lg"
                  greyscaleHover
                  className="group-hover/logo:!opacity-100"
                />
                <span className="text-xs sm:text-sm font-semibold text-muted-foreground/80 group-hover/logo:text-foreground transition-colors hidden sm:inline">
                  {c.companyName}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .group:hover .marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
