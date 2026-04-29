import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNav } from "@/hooks/use-nav";
import heroFallback from "@/assets/hero-team.png";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  flicker: number;
  isSpark: boolean;
};

export default function Hero() {
  const navigate = useNav();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Canvas ember particle system — paused on tab hidden, resize debounced,
  // mobile particle count reduced, mouse-direction drift.
  useEffect(() => {
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let rafId = 0;
    let running = true;
    let resizeTimer: number | undefined;

    const isMobile = () => window.innerWidth < 768;
    const targetCount = () => (isMobile() ? 60 : 130);

    const setSize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x?: number, y?: number, isSpark = false): Particle => {
      const sx = x ?? Math.random() * width;
      const sy = y ?? height + 8;
      return {
        x: sx,
        y: sy,
        vx: (Math.random() - 0.5) * (isSpark ? 0.7 : 0.35),
        vy: -Math.random() * (isSpark ? 2.2 : 1.0) - 0.4,
        size: isSpark ? Math.random() * 1.4 + 0.6 : Math.random() * 2.2 + 0.5,
        life: 0,
        maxLife: isSpark ? 50 + Math.random() * 40 : 200 + Math.random() * 240,
        flicker: Math.random() * Math.PI * 2,
        isSpark,
      };
    };

    const init = () => {
      setSize();
      particles = Array.from({ length: targetCount() }, () => {
        const p = spawn();
        p.y = Math.random() * height;
        p.life = Math.random() * p.maxLife * 0.5;
        return p;
      });
    };

    const loop = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const target = targetCount();
      while (particles.length < target) particles.push(spawn());

      const mx = mouseRef.current.x;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx + mx * 0.5;
        p.y += p.vy;
        p.flicker += 0.18;

        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio >= 1 || p.y < -10) {
          particles.splice(i, 1);
          continue;
        }

        // Flicker: randomized opacity pulse
        const flickerPulse = 0.55 + Math.sin(p.flicker) * 0.3;
        const alpha = (1 - lifeRatio) * flickerPulse;
        const size = p.size * (1 + Math.sin(p.flicker * 0.7) * 0.2);
        const radius = size * 6;

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        if (p.isSpark) {
          grd.addColorStop(0, `rgba(255, 250, 235, ${alpha})`);
          grd.addColorStop(0.4, `rgba(255, 200, 110, ${alpha * 0.6})`);
          grd.addColorStop(1, "rgba(255, 90, 20, 0)");
        } else {
          grd.addColorStop(0, `rgba(255, 200, 120, ${alpha})`);
          grd.addColorStop(0.5, `rgba(255, 120, 40, ${alpha * 0.5})`);
          grd.addColorStop(1, "rgba(180, 40, 10, 0)");
        }
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Rare brighter white sparks with short lifespan
      if (Math.random() < 0.025) {
        particles.push(
          spawn(Math.random() * width, height - Math.random() * 80, true),
        );
      }

      ctx.globalCompositeOperation = "source-over";
      rafId = requestAnimationFrame(loop);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(init, 150);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else if (!running) {
        running = true;
        loop();
      }
    };

    init();
    loop();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(resizeTimer);
    };
  }, [reduceMotion]);

  // Subtle parallax: content drifts max 5px on mouse move (desktop only)
  useEffect(() => {
    if (reduceMotion) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current = { x: nx, y: ny };

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const tx = nx * 5;
        const ty = ny * 5;
        content.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
    };

    section.addEventListener("mousemove", onMove);
    return () => {
      section.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      className="hero-section relative isolate min-h-[92vh] flex items-center overflow-hidden"
    >
      {/* [1] Video / fire background layer (CSS-driven for reliability;
          swap the .hero-fire-bg div for a <video> tag if an embers clip is added) */}
      {!reduceMotion ? (
        <div aria-hidden className="absolute inset-0 z-0 hero-fire-bg" />
      ) : (
        <img
          src={heroFallback}
          alt=""
          aria-hidden
          className="absolute inset-0 z-0 w-full h-full object-cover opacity-30"
        />
      )}

      {/* [2] Canvas ember particle animation */}
      {!reduceMotion && (
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 z-[1] w-full h-full pointer-events-none"
        />
      )}

      {/* Technical credibility layers — very low opacity */}
      <div
        aria-hidden
        className="absolute inset-0 z-[2] pointer-events-none hero-grid-overlay"
      />
      <div
        aria-hidden
        className="absolute inset-0 z-[2] pointer-events-none hero-scanlines"
      />

      {/* [3] Dark overlay rgba(0,0,0,0.45) */}
      <div aria-hidden className="absolute inset-0 z-[3] bg-black/45 pointer-events-none" />

      {/* Vignette to focus the eye on the content */}
      <div
        aria-hidden
        className="absolute inset-0 z-[3] pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_45%,_rgba(0,0,0,0.55)_100%)]"
      />

      {/* [4] Hero content */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 py-24 sm:py-28 md:py-32">
        <div
          ref={contentRef}
          className="max-w-3xl mx-auto text-center will-change-transform"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/15 text-white/85 font-semibold text-[11px] sm:text-xs tracking-[0.2em] mb-6"
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
            WEB • APP • DIGITAL MARKETING
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="text-[clamp(2.4rem,7vw,5rem)] font-extrabold tracking-[-0.02em] leading-[1.04] text-white mb-6 text-balance"
          >
            We Build Digital Systems That{" "}
            <span className="relative inline-block text-primary">
              Ignite Growth
              <span
                aria-hidden
                className="absolute -inset-x-2 -bottom-1 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-base sm:text-lg md:text-xl text-white/75 leading-relaxed max-w-2xl mx-auto mb-9"
          >
            Blaze Studio designs and engineers high-performance websites, apps,
            and marketing systems built to capture attention, scale fast, and
            dominate your market.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Button
              size="lg"
              className="cta-glow h-12 sm:h-14 px-7 sm:px-9 text-sm sm:text-base font-bold bg-primary text-primary-foreground transition-transform active:scale-[0.98] cursor-pointer group"
              onClick={() => navigate("/contact", "contact-form")}
            >
              Start a Project
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 sm:h-14 px-7 sm:px-9 text-sm sm:text-base font-bold bg-white/5 hover:bg-white/10 text-white border-white/25 hover:border-white/50 backdrop-blur-sm transition-colors active:scale-[0.98] cursor-pointer"
              onClick={() => navigate("/portfolio")}
            >
              View Case Studies →
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-7 text-xs sm:text-sm tracking-wide text-white/60"
          >
            Trusted by fast-growing brands and ambitious founders
          </motion.p>
        </div>
      </div>
    </section>
  );
}
