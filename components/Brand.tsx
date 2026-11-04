import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-baseline gap-1.5 no-underline text-[var(--s-ink)] ${className}`} aria-label={BRAND.name}>
      <span className="font-script text-[1.9rem] leading-none text-[var(--s-accent)]">{BRAND.short}</span>
      <span className="text-[.7rem] font-semibold tracking-[.22em] uppercase text-[var(--s-muted)]">Invites</span>
    </Link>
  );
}
