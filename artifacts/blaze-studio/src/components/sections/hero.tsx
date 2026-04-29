import { useEffect, useRef } from "react";
import { useNav } from "@/hooks/use-nav";
import heroFallback from "@/assets/hero-blaze-fallback.png";
import heroVideo from "@/assets/hero-blaze-embers.mp4";

type Particle = {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  alpha: number;
  alphaDelta: number;
  color: string;
};

const COLORS = ["#FF4500", "#FFA500", "#FF4500", "#FFA500", "#FFFFFF"];

export default function Hero() {
  const navigate = useNav();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const ctas = document.querySelector(".hero-blaze__ctas") as HTMLElement | null;
      const sub = document.querySelector(".hero-blaze__sub") as HTMLElement | null;
      const section = document.querySelector(".hero-blaze") as HTMLElement | null;
      console.log("[hero-debug] innerHeight:", window.innerHeight, "innerWidth:", window.innerWidth);
      const rect = (el: Element | null) => {
        if (!el) return "null";
        const r = el.getBoundingClientRect();
        return `top=${r.top.toFixed(0)} bottom=${r.bottom.toFixed(0)} h=${r.height.toFixed(0)}`;
      };
      console.log("[hero-debug] section:", rect(section));
      console.log("[hero-debug] sub:", rect(sub));
      console.log("[hero-debug] ctas:", rect(ctas));
      console.log("[hero-debug] ctas opacity:", ctas && getComputedStyle(ctas).opacity);
    }, 1500);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let rafId = 0;
    let glowPhase = 0;

    const targetCount = () => (window.innerWidth < 768 ? 60 : 120);

    const spawn = (initial = false): Particle => {
      const r = 1 + Math.random() * 3;
      return {
        x: Math.random() * width,
        y: initial ? Math.random() * height : height + Math.random() * 40,
        r,
        vy: 0.2 + Math.random() * 0.7,
        vx: (Math.random() - 0.5) * 0.4,
        alpha: 0,
        alphaDelta: 0.005 + Math.random() * 0.01,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = targetCount();
      if (particles.length === 0) {
        particles = Array.from({ length: target }, () => spawn(true));
      } else if (particles.length !== target) {
        if (particles.length < target) {
          while (particles.length < target) particles.push(spawn(true));
        } else {
          particles.length = target;
        }
      }
    };

    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        resize();
      }, 150);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Pulsing radial heat glow from lower-center (4–6s breath)
      glowPhase += 0.004;
      const pulse = (Math.sin(glowPhase) + 1) / 2; // 0..1
      const glowRadius = Math.max(width, height) * (0.55 + pulse * 0.15);
      const glow = ctx.createRadialGradient(
        width / 2,
        height * 0.95,
        0,
        width / 2,
        height * 0.95,
        glowRadius,
      );
      const inner = 0.18 + pulse * 0.12;
      glow.addColorStop(0, `rgba(255, 90, 0, ${inner})`);
      glow.addColorStop(0.4, `rgba(255, 140, 0, ${inner * 0.45})`);
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Ember particles
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        p.y -= p.vy;
        p.x += p.vx;
        if (p.alpha < 1) p.alpha = Math.min(1, p.alpha + p.alphaDelta);

        // Fade as they rise
        const lifeRatio = 1 - (height - p.y) / height;
        const drawAlpha = Math.max(0, Math.min(1, p.alpha * lifeRatio));

        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = drawAlpha;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // Soft glow halo
        ctx.globalAlpha = drawAlpha * 0.35;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fill();

        if (p.y < -10 || p.x < -10 || p.x > width + 10) {
          Object.assign(p, spawn());
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      rafId = requestAnimationFrame(draw);
    };

    const start = () => {
      resize();
      rafId = requestAnimationFrame(draw);
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
      start();
    }

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <section className="hero-blaze">
      {/* [1] Background video */}
      <video
        ref={videoRef}
        className="hero-blaze__video"
        autoPlay
        loop
        muted
        playsInline
        poster={heroFallback}
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* [2] Ember particle canvas */}
      <canvas ref={canvasRef} className="hero-blaze__canvas" aria-hidden="true" />

      {/* [3] Dark overlay */}
      <div className="hero-blaze__overlay" aria-hidden="true" />

      {/* [4] Hero content */}
      <div className="hero-blaze__content">
        <span className="hero-blaze__eyebrow">WEB • APP • DIGITAL MARKETING</span>
        <h1 className="hero-blaze__headline">
          We Build Things That <span className="hero-blaze__headline-accent">Burn Bright</span>
        </h1>
        <p className="hero-blaze__sub">
          Blaze Studio crafts high-performance websites, apps, and marketing
          systems for brands that refuse to be ignored.
        </p>
        <div
          className="hero-blaze__ctas"
          style={{
            display: "flex",
            gap: 24,
            background: "yellow",
            padding: 8,
            border: "4px solid magenta",
            zIndex: 999,
            position: "relative",
            width: "100%",
            minHeight: 100,
          }}
        >
          <button
            type="button"
            className="hero-blaze__cta-primary"
            onClick={() => navigate("/contact", "contact-form")}
          >
            Start a Project
          </button>
          <button
            type="button"
            className="hero-blaze__cta-secondary"
            onClick={() => navigate("/portfolio")}
          >
            See Our Work <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
