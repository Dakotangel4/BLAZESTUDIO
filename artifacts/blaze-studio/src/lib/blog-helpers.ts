/**
 * Visual + presentation helpers for the public blog.
 *
 * Categories now come from the database (admin-managed), but the marketing
 * site has a strong visual identity tied to the original seven categories.
 * We keep the well-known palettes/gradients for those names, and fall back
 * to a deterministic mapping for any new categories the admin creates so
 * the site never looks broken.
 */

export interface CategoryVisual {
  /** Tailwind classes for a small badge / chip (background + text + border). */
  chip: string;
  /** Tailwind class fragment for a from-X via-Y to-Z gradient. */
  gradient: string;
  /** Decorative radial pattern overlay used on hero cards. */
  pattern: string;
  /** Two-digit number used in the section pickers, e.g. "01". */
  number: string;
  /** Short marketing tagline shown under the category title. */
  tagline: string;
  /** Slightly longer description shown on the category landing page. */
  description: string;
}

const KNOWN_CATEGORIES: Record<string, CategoryVisual> = {
  "ai-strategy": {
    chip: "bg-primary/10 text-primary border-primary/20",
    gradient: "from-pink-500 via-rose-600 to-red-600",
    pattern:
      "radial-gradient(circle at 60% 40%, rgba(255,255,255,0.22) 0, transparent 55%)",
    number: "01",
    tagline: "Frameworks & roadmaps",
    description:
      "How to plan, prioritise and ship AI inside an existing business — without burning budget on the wrong integrations or chasing trends.",
  },
  "ai-chatbots": {
    chip: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    gradient: "from-emerald-500 via-teal-600 to-cyan-700",
    pattern:
      "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.22) 0, transparent 50%)",
    number: "02",
    tagline: "Conversational AI",
    description:
      "When chatbots help, when they hurt, and how to build ones your customers actually want to use — not the kind they'll ragequit.",
  },
  personalization: {
    chip: "bg-violet-500/10 text-violet-700 border-violet-500/20",
    gradient: "from-violet-500 via-purple-600 to-indigo-700",
    pattern:
      "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.22) 0, transparent 50%)",
    number: "03",
    tagline: "Tailored experiences",
    description:
      "Behaviour-driven content, recommendations and offers that lift average order value — without crossing into creepy.",
  },
  "ai-seo": {
    chip: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    gradient: "from-amber-500 via-orange-600 to-red-600",
    pattern:
      "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.22) 0, transparent 55%)",
    number: "04",
    tagline: "Content & search visibility",
    description:
      "Ranking in the age of AI Overviews, ChatGPT search and Google's helpful-content updates — without writing slop.",
  },
  "lead-generation": {
    chip: "bg-sky-500/10 text-sky-700 border-sky-500/20",
    gradient: "from-sky-500 via-blue-600 to-indigo-700",
    pattern:
      "radial-gradient(circle at 80% 60%, rgba(255,255,255,0.22) 0, transparent 50%)",
    number: "05",
    tagline: "Pipeline & prediction",
    description:
      "Score, route and follow up on leads with AI so the best ones get called first — and nothing falls through the cracks again.",
  },
  "ai-search": {
    chip: "bg-lime-600/10 text-lime-700 border-lime-600/20",
    gradient: "from-lime-500 via-emerald-600 to-teal-700",
    pattern:
      "radial-gradient(circle at 40% 70%, rgba(255,255,255,0.22) 0, transparent 55%)",
    number: "06",
    tagline: "On-site discovery",
    description:
      "Vector search, semantic relevance, and turning your site's search bar into a real conversion engine.",
  },
  "case-study": {
    chip: "bg-rose-500/10 text-rose-700 border-rose-500/20",
    gradient: "from-rose-500 via-fuchsia-600 to-purple-700",
    pattern:
      "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.22) 0, transparent 50%)",
    number: "07",
    tagline: "Real numbers, real shops",
    description:
      "Before/after teardowns of the websites we ship — what we changed, what it moved, and what it cost.",
  },
};

const FALLBACK_PALETTES: Array<Pick<CategoryVisual, "chip" | "gradient" | "pattern">> = [
  {
    chip: "bg-primary/10 text-primary border-primary/20",
    gradient: "from-pink-500 via-rose-600 to-red-600",
    pattern: "radial-gradient(circle at 60% 40%, rgba(255,255,255,0.22) 0, transparent 55%)",
  },
  {
    chip: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    gradient: "from-emerald-500 via-teal-600 to-cyan-700",
    pattern: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.22) 0, transparent 50%)",
  },
  {
    chip: "bg-violet-500/10 text-violet-700 border-violet-500/20",
    gradient: "from-violet-500 via-purple-600 to-indigo-700",
    pattern: "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.22) 0, transparent 50%)",
  },
  {
    chip: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    gradient: "from-amber-500 via-orange-600 to-red-600",
    pattern: "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.22) 0, transparent 55%)",
  },
  {
    chip: "bg-sky-500/10 text-sky-700 border-sky-500/20",
    gradient: "from-sky-500 via-blue-600 to-indigo-700",
    pattern: "radial-gradient(circle at 80% 60%, rgba(255,255,255,0.22) 0, transparent 50%)",
  },
  {
    chip: "bg-lime-600/10 text-lime-700 border-lime-600/20",
    gradient: "from-lime-500 via-emerald-600 to-teal-700",
    pattern: "radial-gradient(circle at 40% 70%, rgba(255,255,255,0.22) 0, transparent 55%)",
  },
  {
    chip: "bg-rose-500/10 text-rose-700 border-rose-500/20",
    gradient: "from-rose-500 via-fuchsia-600 to-purple-700",
    pattern: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.22) 0, transparent 50%)",
  },
];

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function categoryVisualFor(
  slug: string | null | undefined,
  index?: number,
): CategoryVisual {
  const key = (slug ?? "").toLowerCase();
  const known = KNOWN_CATEGORIES[key];
  if (known) return known;

  const palette = FALLBACK_PALETTES[hashSlug(key || "uncategorized") % FALLBACK_PALETTES.length];
  const num = String((index ?? hashSlug(key)) % 99 + 1).padStart(2, "0");
  return {
    ...palette,
    number: num,
    tagline: "Explore",
    description: "Posts, teardowns and frameworks from the Blaze Studio team.",
  };
}

export function categoryChipFor(slug: string | null | undefined): string {
  return categoryVisualFor(slug).chip;
}

/**
 * Tailwind v4's compiler can be flaky about detecting Tailwind classes that are
 * built from data (e.g. `from-${color}` strings stored in a Record). For the
 * category gradient — which is large and visually critical — we render it via
 * inline `style.background` so it always shows up regardless of what the JIT
 * scanner saw at build time. This map mirrors Tailwind v4's default palette
 * (oklch values).
 */
const TW_COLOR: Record<string, string> = {
  "pink-500": "oklch(65.6% 0.241 354.308)",
  "pink-600": "oklch(59.2% 0.249 0.584)",
  "pink-700": "oklch(52.5% 0.223 3.958)",
  "rose-500": "oklch(64.5% 0.246 16.439)",
  "rose-600": "oklch(58.6% 0.253 17.585)",
  "rose-700": "oklch(51.4% 0.222 16.935)",
  "red-500": "oklch(63.7% 0.237 25.331)",
  "red-600": "oklch(57.7% 0.245 27.325)",
  "red-700": "oklch(50.5% 0.213 27.518)",
  "orange-500": "oklch(70.5% 0.213 47.604)",
  "orange-600": "oklch(64.6% 0.222 41.116)",
  "orange-700": "oklch(55.3% 0.195 38.402)",
  "amber-500": "oklch(76.9% 0.188 70.08)",
  "amber-600": "oklch(66.6% 0.179 58.318)",
  "amber-700": "oklch(55.5% 0.163 48.998)",
  "lime-500": "oklch(76.8% 0.233 130.85)",
  "lime-600": "oklch(64.8% 0.2 131.684)",
  "lime-700": "oklch(53.2% 0.157 131.589)",
  "emerald-500": "oklch(69.6% 0.17 162.48)",
  "emerald-600": "oklch(59.6% 0.145 163.225)",
  "emerald-700": "oklch(50.8% 0.118 165.612)",
  "teal-500": "oklch(70.4% 0.14 182.503)",
  "teal-600": "oklch(60% 0.118 184.704)",
  "teal-700": "oklch(51.1% 0.096 186.391)",
  "cyan-500": "oklch(71.5% 0.143 215.221)",
  "cyan-600": "oklch(60.9% 0.126 221.723)",
  "cyan-700": "oklch(52% 0.105 223.128)",
  "sky-500": "oklch(68.5% 0.169 237.323)",
  "sky-600": "oklch(58.8% 0.158 241.966)",
  "sky-700": "oklch(50% 0.134 242.749)",
  "blue-500": "oklch(62.3% 0.214 259.815)",
  "blue-600": "oklch(54.6% 0.245 262.881)",
  "blue-700": "oklch(48.8% 0.243 264.376)",
  "indigo-500": "oklch(58.5% 0.233 277.117)",
  "indigo-600": "oklch(51.1% 0.262 276.966)",
  "indigo-700": "oklch(45.7% 0.24 277.023)",
  "violet-500": "oklch(60.6% 0.25 292.717)",
  "violet-600": "oklch(54.1% 0.281 293.009)",
  "violet-700": "oklch(49.1% 0.27 292.581)",
  "purple-500": "oklch(62.7% 0.265 303.9)",
  "purple-600": "oklch(55.8% 0.288 302.321)",
  "purple-700": "oklch(49.6% 0.265 301.924)",
  "fuchsia-500": "oklch(66.7% 0.295 322.15)",
  "fuchsia-600": "oklch(59.1% 0.293 322.896)",
  "fuchsia-700": "oklch(51.8% 0.253 323.949)",
};

/**
 * Convert a Tailwind gradient class fragment ("from-X via-Y to-Z") into a
 * plain CSS `linear-gradient(...)` string usable in `style.background`.
 * Falls back to a sensible primary gradient if any color lookup fails.
 */
export function gradientCssFor(
  slug: string | null | undefined,
  direction = "to bottom right",
): string {
  const fragment = categoryVisualFor(slug).gradient;
  const stops: string[] = [];
  for (const token of fragment.split(/\s+/)) {
    const m = token.match(/^(from|via|to)-(.+)$/);
    if (!m) continue;
    const color = TW_COLOR[m[2]];
    if (color) stops.push(color);
  }
  if (stops.length < 2) {
    return `linear-gradient(${direction}, oklch(70.5% 0.213 47.604), oklch(57.7% 0.245 27.325))`;
  }
  return `linear-gradient(${direction}, ${stops.join(", ")})`;
}

export function formatPostDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatPostDateShort(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function siteOrigin(): string {
  if (typeof window !== "undefined" && window.location) {
    return window.location.origin;
  }
  return "";
}

export function absoluteUrl(path: string): string {
  const origin = siteOrigin();
  if (!path) return origin;
  if (path.startsWith("http")) return path;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
