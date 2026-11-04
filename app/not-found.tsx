import Link from "next/link";
export default function NotFound() {
  return (
    <main className="studio min-h-dvh grid place-items-center p-6 text-center">
      <div>
        <p className="text-[var(--accent)] font-medium">Page not found</p>
        <h1 className="s-h1 mt-2">This link does not lead anywhere</h1>
        <p className="mt-2 text-[var(--muted)]">If you are a guest, please check the link the couple sent you.</p>
        <Link href="/" className="s-btn s-btn-primary mt-6">Go to homepage</Link>
      </div>
    </main>
  );
}
