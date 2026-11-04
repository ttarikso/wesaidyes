import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function Logo({ className = "", height = 38 }: { className?: string; height?: number }) {
  return (
    <Link href="/" className={`inline-flex items-center no-underline shrink-0 ${className}`} aria-label={`${BRAND.name} home`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/logo.png" alt={BRAND.name} width={Math.round(height * 4.48)} height={height} style={{ height, width: "auto" }} />
    </Link>
  );
}
