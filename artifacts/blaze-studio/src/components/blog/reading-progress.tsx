import { useEffect, useState } from "react";

interface Props {
  /** Element ref selector to measure (default: document body). */
  targetSelector?: string;
}

export default function ReadingProgress({ targetSelector }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = targetSelector
      ? document.querySelector<HTMLElement>(targetSelector)
      : null;

    function update() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      let height = 0;
      let start = 0;
      if (target) {
        const rect = target.getBoundingClientRect();
        start = rect.top + window.scrollY;
        height = rect.height;
      } else {
        height =
          (document.documentElement.scrollHeight ||
            document.body.scrollHeight) - window.innerHeight;
      }
      const denom = target ? Math.max(height - window.innerHeight, 1) : Math.max(height, 1);
      const value = target
        ? ((scrollTop - start) / denom) * 100
        : (scrollTop / denom) * 100;
      setProgress(Math.max(0, Math.min(100, value)));
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetSelector]);

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-40 h-1 bg-transparent"
      data-testid="reading-progress"
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-rose-500 to-orange-500 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
