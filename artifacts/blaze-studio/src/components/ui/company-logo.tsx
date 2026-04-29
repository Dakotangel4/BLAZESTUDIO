import { useState } from "react";
import { cn } from "@/lib/utils";

export function clearbitLogoUrl(domain: string | null | undefined): string | null {
  if (!domain) return null;
  const clean = domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
  if (!clean || !clean.includes(".")) return null;
  return `https://logo.clearbit.com/${clean}`;
}

export function resolveLogoUrl(args: {
  companyLogoUrl?: string | null;
  companyDomain?: string | null;
}): string | null {
  if (args.companyLogoUrl && args.companyLogoUrl.trim()) {
    return args.companyLogoUrl.trim();
  }
  return clearbitLogoUrl(args.companyDomain ?? null);
}

interface CompanyLogoProps {
  companyName: string;
  companyDomain?: string | null;
  companyLogoUrl?: string | null;
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  greyscaleHover?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  sm: "h-5",
  md: "h-7",
  lg: "h-9",
} as const;

const FALLBACK_SIZE_CLASSES = {
  sm: "h-5 w-5 text-[10px]",
  md: "h-7 w-7 text-xs",
  lg: "h-9 w-9 text-sm",
} as const;

export default function CompanyLogo({
  companyName,
  companyDomain,
  companyLogoUrl,
  variant = "light",
  size = "md",
  greyscaleHover = false,
  className,
}: CompanyLogoProps) {
  const initialUrl = resolveLogoUrl({ companyLogoUrl, companyDomain });
  const [failed, setFailed] = useState(false);
  const url = failed ? null : initialUrl;

  if (!url) {
    const initial = companyName.trim().charAt(0).toUpperCase() || "?";
    return (
      <span
        aria-label={companyName}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-bold shrink-0",
          variant === "dark"
            ? "bg-white/10 text-white"
            : "bg-slate-200 text-slate-700",
          FALLBACK_SIZE_CLASSES[size],
          className,
        )}
      >
        {initial}
      </span>
    );
  }

  // Use a tinted pill on dark backgrounds so dark logos stay visible
  const wrapperClass =
    variant === "dark"
      ? "inline-flex items-center justify-center rounded-md bg-white/95 px-2 py-1"
      : "inline-flex items-center";

  return (
    <span className={cn(wrapperClass, className)}>
      <img
        src={url}
        alt={`${companyName} logo`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={cn(
          SIZE_CLASSES[size],
          "w-auto object-contain transition-all duration-300",
          greyscaleHover && "grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100",
        )}
      />
    </span>
  );
}
