import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 no-underline text-[var(--s-ink)] ${className}`} aria-label={BRAND.name}>
      <span className="font-script text-[2rem] leading-none text-[var(--s-accent)] translate-y-[2px]">We said yes</span>
      <span aria-hidden className="text-[var(--s-accent)] text-sm">♡</span>
    </Link>
  );
}
