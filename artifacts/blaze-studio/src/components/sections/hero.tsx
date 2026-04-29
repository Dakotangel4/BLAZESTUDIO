import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNav } from "@/hooks/use-nav";

// Hero media — imported through Vite's asset graph so each file is
// emitted with an 8-char content-hash filename in production
// (e.g. /assets/hero-bg-a3f92b1c.webm). Combined with the long-cache
// immutable headers set by the API server, browsers can cache these
// for one year and only re-download when the file content changes.
import heroWebmUrl from "@/assets/hero/hero-bg.webm?url";
import heroMp4Url from "@/assets/hero/hero-bg.mp4?url";
import heroMobileMp4Url from "@/assets/hero/hero-bg-mobile.mp4?url";
import heroPosterUrl from "@/assets/hero/hero-fallback.jpg?url";

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
  hasTrail: boolean;
  trail: { x: number; y: number; a: number }[];
};

type CodeChar = {
  x: number;
  y: number;
  vy: number;
  text: string;
  alpha: number;
  size: number;
};

const CODE_GLYPHS = ["0", "1", "0", "1", "</>", "{}", "()", "fn", "=>", "[ ]"];

export default function Hero() {
  const navigate = useNav();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Dual-layer canvas:
  //   Layer A — perspective tech grid + drifting code characters (atmosphere)
  //   Layer B — ember particles, sparks with trails, breathing heat glow
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
    let codeChars: CodeChar[] = [];
    let gridScroll = 0;
    let glowPhase = 0;
    let rafId = 0;
    let running = true;
    let resizeTimer: number | undefined;
    let lastTs = performance.now();

    const isMobile = () => window.innerWidth < 768;
    const targetCount = () => (isMobile() ? 60 : 120);
    const codeCount = () => (isMobile() ? 14 : 28);

    const setSize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawnParticle = (x?: number, y?: number, isSpark = false): Particle => {
      const sx = x ?? Math.random() * width;
      const sy = y ?? height + 8;
      const hasTrail = !isSpark && Math.random() < 1 / 8;
      return {
        x: sx,
        y: sy,
        vx: (Math.random() - 0.5) * (isSpark ? 0.7 : 0.35),
        vy: -Math.random() * (isSpark ? 2.4 : 1.0) - 0.4,
        size: isSpark ? Math.random() * 1.4 + 0.6 : Math.random() * 2.6 + 0.6,
        life: 0,
        maxLife: isSpark ? 50 + Math.random() * 40 : 200 + Math.random() * 240,
        flicker: Math.random() * Math.PI * 2,
        isSpark,
        hasTrail,
        trail: [],
      };
    };

    const spawnCodeChar = (initial = false): CodeChar => ({
      x: Math.random() * width,
      y: initial ? Math.random() * height : height + Math.random() * 40,
      vy: -(0.18 + Math.random() * 0.35),
      text: CODE_GLYPHS[Math.floor(Math.random() * CODE_GLYPHS.length)],
      alpha: 0.06 + Math.random() * 0.06,
      size: 11 + Math.random() * 5,
    });

    const init = () => {
      setSize();
      particles = Array.from({ length: targetCount() }, () => {
        const p = spawnParticle();
        p.y = Math.random() * height;
        p.life = Math.random() * p.maxLife * 0.5;
        return p;
      });
      codeChars = Array.from({ length: codeCount() }, () => spawnCodeChar(true));
    };

    // -------- Layer A: perspective tech grid --------
    const drawGrid = () => {
      const horizonY = height * 0.46; // horizon center vertical position
      const vanishX = width / 2;
      const baseY = height + 40;
      const lineColor = "rgba(255, 140, 0, 0.08)";
      const strongColor = "rgba(255, 140, 0, 0.12)";

      ctx.save();
      ctx.lineWidth = 1;

      // Horizontal lines receding to horizon (z-axis scroll)
      const rows = 18;
      for (let i = 0; i < rows; i++) {
        // t in [0,1) with continuous scroll
        const t = ((i + gridScroll) % rows) / rows;
        // perspective easing: lines bunch toward horizon
        const eased = Math.pow(t, 2.2);
        const y = horizonY + (baseY - horizonY) * eased;
        const fade = Math.min(1, eased * 1.6);
        ctx.strokeStyle = i % 4 === 0 ? strongColor : lineColor;
        ctx.globalAlpha = fade;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Radial lines from vanishing point to bottom edge
      ctx.globalAlpha = 1;
      ctx.strokeStyle = lineColor;
      const cols = 18;
      for (let i = -cols; i <= cols; i++) {
        const ratio = i / cols;
        const xBottom = vanishX + ratio * width * 1.4;
        ctx.beginPath();
        ctx.moveTo(vanishX, horizonY);
        ctx.lineTo(xBottom, baseY);
        ctx.stroke();
      }

      // Soft horizon glow band
      const horizonGrad = ctx.createLinearGradient(0, horizonY - 24, 0, horizonY + 24);
      horizonGrad.addColorStop(0, "rgba(255, 120, 40, 0)");
      horizonGrad.addColorStop(0.5, "rgba(255, 120, 40, 0.06)");
      horizonGrad.addColorStop(1, "rgba(255, 120, 40, 0)");
      ctx.fillStyle = horizonGrad;
      ctx.fillRect(0, horizonY - 24, width, 48);

      ctx.restore();
    };

    // -------- Layer A: drifting code characters --------
    const drawCodeChars = () => {
      ctx.save();
      ctx.font = "500 12px 'JetBrains Mono', 'Fira Code', ui-monospace, monospace";
      ctx.textBaseline = "middle";
      for (let i = codeChars.length - 1; i >= 0; i--) {
        const c = codeChars[i];
        c.y += c.vy;
        if (c.y < -20) {
          codeChars[i] = spawnCodeChar();
          continue;
        }
        ctx.fillStyle = `rgba(255, 160, 50, ${c.alpha})`;
        ctx.font = `500 ${c.size}px 'JetBrains Mono', 'Fira Code', ui-monospace, monospace`;
        ctx.fillText(c.text, c.x, c.y);
      }
      ctx.restore();
    };

    // -------- Layer B: breathing radial heat glow --------
    const drawHeatGlow = () => {
      // 5s breathing cycle: phase advances by (2π / 5s) each second
      const breath = 0.55 + Math.sin(glowPhase) * 0.25; // 0.30 .. 0.80
      const cx = width * 0.5;
      const cy = height + height * 0.05;
      const r = Math.max(width, height) * 0.55;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grd.addColorStop(0, `rgba(255, 100, 30, ${0.28 * breath})`);
      grd.addColorStop(0.4, `rgba(255, 70, 20, ${0.12 * breath})`);
      grd.addColorStop(1, "rgba(255, 60, 15, 0)");
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    };

    // -------- Layer B: ember particles --------
    const drawParticles = () => {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const target = targetCount();
      while (particles.length < target) particles.push(spawnParticle());

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

        // Trail recording (1-in-8 embers)
        if (p.hasTrail) {
          p.trail.push({ x: p.x, y: p.y, a: 1 - lifeRatio });
          if (p.trail.length > 8) p.trail.shift();
          // draw trail as fading line
          if (p.trail.length > 1) {
            for (let t = 1; t < p.trail.length; t++) {
              const a = p.trail[t - 1];
              const b = p.trail[t];
              const ta = b.a * (t / p.trail.length) * 0.5;
              ctx.strokeStyle = `rgba(255, 165, 0, ${ta})`;
              ctx.lineWidth = p.size * 0.7;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }

        const flickerPulse = 0.55 + Math.sin(p.flicker) * 0.3;
        const alpha = (1 - lifeRatio) * flickerPulse;
        const size = p.size * (1 + Math.sin(p.flicker * 0.7) * 0.2);
        const radius = size * 6;

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        if (p.isSpark) {
          // electric white spark core fading to amber → deep orange
          grd.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
          grd.addColorStop(0.35, `rgba(255, 165, 0, ${alpha * 0.7})`);
          grd.addColorStop(1, "rgba(255, 69, 0, 0)");
        } else {
          // amber → deep orange ember
          grd.addColorStop(0, `rgba(255, 200, 120, ${alpha})`);
          grd.addColorStop(0.5, `rgba(255, 120, 40, ${alpha * 0.55})`);
          grd.addColorStop(1, "rgba(255, 69, 0, 0)");
        }
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Rare bright white sparks
      if (Math.random() < 0.025) {
        particles.push(
          spawnParticle(Math.random() * width, height - Math.random() * 80, true),
        );
      }

      ctx.restore();
    };

    const loop = (ts: number) => {
      if (!running) return;
      const dt = Math.min(64, ts - lastTs);
      lastTs = ts;

      // advance scrolls
      gridScroll += dt / 1000 * 0.18; // slow forward scroll
      glowPhase += dt / 1000 * (Math.PI * 2 / 5); // 5s breathing

      ctx.clearRect(0, 0, width, height);
      drawGrid();
      drawCodeChars();
      drawHeatGlow();
      drawParticles();

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
        lastTs = performance.now();
        rafId = requestAnimationFrame(loop);
      }
    };

    init();
    rafId = requestAnimationFrame(loop);
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

  // Mobile (<768px): swap the heavy 1080p sources for a lighter 720p
  // mobile-optimized MP4 so cellular users aren't pulling 7MB just for
  // ambience. Runs once on mount before the browser starts decoding.
  // The mobile URL uses the same Vite-hashed filename strategy.
  useEffect(() => {
    if (reduceMotion) return;
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;

    const video = document.querySelector<HTMLVideoElement>(".hero-video");
    if (!video) return;

    const sources = video.querySelectorAll("source");
    sources.forEach((src) => {
      src.src = heroMobileMp4Url;
      src.type = "video/mp4";
    });
    video.load();
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
      className="hero-section relative isolate min-h-screen flex items-center overflow-hidden"
    >
      {/* [Fallback] CSS fire background — visible while video loads,
          if autoplay is blocked, or for reduced-motion users */}
      <div aria-hidden className="absolute inset-0 z-0 hero-fire-bg" />

      {/* [1] Video — self-hosted ember/fire clip. Zero external CDNs.
          - WebM (VP9, ~4.9MB) listed first → faster on Chrome/Firefox
          - MP4 (H.264, ~7MB) second → universal Safari/iOS fallback
          - Mobile <768px swaps to /assets/video/hero-bg-mobile.mp4 (~2.9MB)
          - Starts at opacity 0; fades in on canplaythrough to avoid flash
          - On error the element hides; .hero-fire-bg below takes over */}
      {!reduceMotion && (
        <video
          className="hero-video absolute inset-0 z-[1] w-full h-full object-cover pointer-events-none"
          style={{
            objectPosition: "center",
            backgroundColor: "#080808",
            opacity: 0,
            transition: "opacity 600ms ease",
          }}
          aria-hidden
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={heroPosterUrl}
          onCanPlayThrough={(e) => {
            (e.currentTarget as HTMLVideoElement).style.opacity = "1";
          }}
          onError={(e) => {
            (e.currentTarget as HTMLVideoElement).style.display = "none";
          }}
        >
          <source src={heroWebmUrl} type="video/webm" />
          <source src={heroMp4Url} type="video/mp4" />
        </video>
      )}

      {/* [2] Canvas — tech grid + code chars + embers + heat glow */}
      {!reduceMotion && (
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 z-[2] w-full h-full pointer-events-none"
        />
      )}

      {/* [3] Dark veil rgba(0,0,0,0.45) per spec */}
      <div
        aria-hidden
        className="absolute inset-0 z-[3] bg-black/45 pointer-events-none"
      />

      {/* Vignette to focus the eye on content */}
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
          {/* Eyebrow — delay 0.2s */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/15 font-semibold text-[11px] sm:text-xs uppercase tracking-[0.22em] mb-6"
            style={{ color: "#FFA500" }}
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
            WEB • APP • DIGITAL MARKETING
          </motion.div>

          {/* H1 — delay 0.4s, Bebas Neue 80px desktop / 44px mobile, letter-spacing 2px */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
            className="font-display text-white mb-6 text-balance leading-[0.95] uppercase"
            style={{
              fontSize: "clamp(2.75rem, 8vw, 5rem)",
              letterSpacing: "0.08em",
            }}
          >
            We Build Digital Systems That{" "}
            <span className="relative inline-block" style={{ color: "#FFA500" }}>
              Ignite Growth
              <span
                aria-hidden
                className="absolute -inset-x-2 -bottom-1 h-[3px] bg-gradient-to-r from-transparent via-[#FFA500] to-transparent opacity-80"
              />
            </span>
          </motion.h1>

          {/* Subheadline — delay 0.6s */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
            className="text-base sm:text-lg leading-relaxed max-w-[560px] mx-auto mb-9"
            style={{ color: "#CCCCCC", fontFamily: "'DM Sans', 'Inter', sans-serif" }}
          >
            Blaze Studio designs and engineers high-performance websites, apps,
            and marketing systems built to capture attention, scale fast, and
            dominate your market.
          </motion.p>

          {/* Buttons — delay 0.8s */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <button
              type="button"
              onClick={() => navigate("/contact", "contact-form")}
              className="hero-cta-blaze inline-flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-wider cursor-pointer"
              style={{ padding: "16px 36px" }}
            >
              Start a Project
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/portfolio")}
              className="hero-cta-secondary inline-flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-wider cursor-pointer"
              style={{ padding: "16px 36px" }}
            >
              View Case Studies →
            </button>
          </motion.div>

          {/* Trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="mt-7 text-xs sm:text-sm tracking-wide text-white"
          >
            Trusted by fast-growing brands and ambitious founders
          </motion.p>
        </div>
      </div>
    </section>
  );
}
